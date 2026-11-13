#!/usr/bin/env python3
"""Local batch transcription with whisper.cpp: resumable, atomic, single-instance.

Guardrails:
- one instance only (flock), so two runs never share temp files;
- every child process gets stdin=DEVNULL and an argument list (no shell), so
  ffmpeg can never read the queue and paths with spaces or accents are safe;
- the output only counts when .txt and .srt both exist and the txt is not
  empty; they are written under a temp name and renamed after success;
- one temp folder per file, always removed (even on failure or SIGTERM);
- per-file timeout, one retry, failures recorded with the stderr tail;
- free-disk check before starting;
- the optional progress state is written atomically to a JSON file.

Usage: transcribe_batch.py --queue files.txt --out <folder> [--durations d.json] [--state progress.json] [--dry-run]
Recordings run shortest first. Stop with SIGTERM: the current file finishes, then the batch exits.
"""
import argparse, fcntl, json, os, re, shutil, signal, subprocess, sys, tempfile, threading, time, unicodedata
from datetime import datetime

FREE_GB_MIN = 5
RETRIES = 1


def now():
    return datetime.now().strftime("%H:%M:%S")


def nfc(s):
    return unicodedata.normalize("NFC", s)


class State:
    def __init__(self, path, items):
        self.path, self.items, self.lock = path, items, threading.Lock()
        self.fin = False

    def write(self):
        if not self.path:
            return
        with self.lock:
            done = [i for i in self.items if i["st"] == "feito" and i["s"] > 0]
            run = [i for i in self.items if i["st"] == "rodando"]
            for i in run:
                i["s"] = round(time.time() - i["t0"])
            wall = sum(i["s"] for i in done)
            audio = sum(i["min"] for i in done)
            speed = audio * 60 / wall if wall else 0
            total = sum(i["min"] for i in self.items)
            part = min(run[0]["s"] * speed / 60, run[0]["min"] * 0.99) if run and speed else 0
            out = {
                "items": [{k: v for k, v in i.items() if k != "t0"} for i in self.items],
                "speed": round(speed, 1), "done_min": round(audio + part, 1),
                "tot_min": round(total, 1),
                "eta_min": round((total - audio - part) / speed) if speed else None,
                "fin": self.fin, "at": now(),
            }
            tmp = self.path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(out, f, ensure_ascii=False)
            os.replace(tmp, self.path)


def run(cmd, timeout):
    p = subprocess.run(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                       stderr=subprocess.PIPE, timeout=timeout, text=True, errors="replace")
    if p.returncode != 0:
        raise RuntimeError((p.stderr or "").strip()[-300:] or f"exit {p.returncode}")


def transcribe(src, out_base, model, lang, timeout):
    tmpdir = tempfile.mkdtemp(prefix="whisper-")
    try:
        wav = os.path.join(tmpdir, "audio.wav")
        run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", src, "-vn", "-ar", "16000", "-ac", "1", wav], timeout)
        tmp_base = os.path.join(tmpdir, "out")
        run(["whisper-cli", "-m", model, "-l", lang, "-ml", "0", "-otxt", "-osrt", "-of", tmp_base, "-f", wav], timeout)
        txt, srt = tmp_base + ".txt", tmp_base + ".srt"
        if not (os.path.exists(srt) and os.path.getsize(txt) > 0):
            raise RuntimeError("whisper produced no usable output")
        shutil.move(srt, out_base + ".srt")
        shutil.move(txt, out_base + ".txt")  # txt last: it marks the file as done
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def probe_seconds(path):
    p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True)
    try:
        return float(p.stdout.strip())
    except ValueError:
        return 0.0


def already_done(out_base):
    t = out_base + ".txt"
    return os.path.exists(t) and os.path.getsize(t) > 0 and os.path.exists(out_base + ".srt")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--queue", required=True, help="text file with one recording path per line")
    ap.add_argument("--durations", help="json {path: seconds}; when missing, ffprobe measures each file")
    ap.add_argument("--out", required=True)
    ap.add_argument("--state", help="optional json file with the progress, rewritten every 5 seconds")
    ap.add_argument("--model", default=os.path.expanduser("~/.local/share/whisper.cpp/models/ggml-large-v3-turbo-q5_0.bin"))
    ap.add_argument("--lang", default="pt")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    os.makedirs(a.out, exist_ok=True)
    lockf = open(os.path.join(a.out, ".batch.lock"), "w")
    try:
        fcntl.flock(lockf, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        sys.exit("another instance is already running")
    for tool in ("ffmpeg", "ffprobe", "whisper-cli"):
        if not shutil.which(tool):
            sys.exit(f"missing tool: {tool}")
    if not os.path.exists(a.model):
        sys.exit(f"missing model: {a.model}")
    if shutil.disk_usage(a.out).free / 1e9 < FREE_GB_MIN:
        sys.exit("less than %d GB free" % FREE_GB_MIN)

    dur = json.load(open(a.durations, encoding="utf-8")) if a.durations else {}
    tpath = os.path.join(a.out, "_tempos.json")
    tempos = json.load(open(tpath, encoding="utf-8")) if os.path.exists(tpath) else {}
    paths = [l.strip() for l in open(a.queue, encoding="utf-8") if l.strip()]
    items = []
    for p in paths:
        if not os.path.isfile(p):
            print("skip, not a file:", p)
            continue
        if p not in dur:
            dur[p] = probe_seconds(p)
        base = nfc(os.path.splitext(os.path.basename(p))[0])
        out_base = os.path.join(a.out, base)
        items.append({"n": base, "min": round(dur.get(p, 0) / 60, 1), "s": tempos.get(base, 0), "st": "feito" if already_done(out_base) else "fila",
                      "src": p, "base": out_base, "t0": 0})
    items.sort(key=lambda i: (i["st"] != "feito", i["min"]))  # shortest first, finished ones stay on top
    st = State(a.state, items)
    if a.dry_run:
        print({k: sum(1 for i in items if i["st"] == k) for k in ("feito", "fila")})
        return

    stop = threading.Event()
    signal.signal(signal.SIGTERM, lambda *_: stop.set())
    signal.signal(signal.SIGINT, lambda *_: stop.set())

    def heartbeat():
        while not stop.wait(5) and not st.fin:
            st.write()
    threading.Thread(target=heartbeat, daemon=True).start()

    st.write()
    for it in items:
        if stop.is_set():
            break
        if it["st"] != "fila":
            continue
        it["st"], it["t0"] = "rodando", time.time()
        st.write()
        timeout = max(300, int(it["min"] * 60 / 4) + 120)
        err = None
        for attempt in range(RETRIES + 1):
            try:
                transcribe(it["src"], it["base"], a.model, a.lang, timeout)
                err = None
                break
            except Exception as e:  # recorded, never aborts the batch
                err = str(e)
                if stop.is_set():
                    break
        it["s"] = round(time.time() - it["t0"])
        it["st"] = "feito" if err is None else "erro"
        if err:
            it["erro"] = err
        else:
            tempos[it["n"]] = it["s"]
            with open(tpath + ".tmp", "w", encoding="utf-8") as f:
                json.dump(tempos, f, ensure_ascii=False)
            os.replace(tpath + ".tmp", tpath)
        st.write()
    st.fin = not stop.is_set()
    st.write()


if __name__ == "__main__":
    main()
