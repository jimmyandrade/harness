#!/usr/bin/env python3
"""Show the progress of a long job on a page that refreshes itself, with no dependency and no token cost.

A producer writes one JSON file, with `write_progress` or `update_progress`, or with the `update` command from a shell.
`serve` reads that file and serves a page on the loopback address. Open the page in a browser while the job runs.

The state is {"title", "updated_at", "phases": [{"name", "status", "done", "total", "detail"}], "counters", "log"}.
The status of a phase is pending, running, done, or failed.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "127.0.0.1"
DEFAULT_PORT = 8765
MAX_LOG_LINES = 50

PAGE = """<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Progresso</title>
<style>
:root{--bg:#fafaf8;--fg:#1d1d1b;--muted:#6b6b66;--line:#dcdcd6;--bar:#e8e8e2;--ok:#2f7d4f;--run:#2a62c9;--bad:#b3261e}
@media(prefers-color-scheme:dark){:root{--bg:#161614;--fg:#ececE6;--muted:#9a9a92;--line:#34342f;--bar:#2a2a26;--ok:#5ec28a;--run:#7ea6f4;--bad:#f2766d}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px}
h1{font-size:20px;margin:0 0 4px}.sub{color:var(--muted);font-size:13px;margin-bottom:20px}
.phase{border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-bottom:10px}
.row{display:flex;justify-content:space-between;gap:12px;font-size:14px}.name{font-weight:600}
.bar{height:8px;background:var(--bar);border-radius:99px;margin:8px 0 4px;overflow:hidden}
.fill{height:100%;background:var(--run);transition:width .4s}.done .fill{background:var(--ok)}.failed .fill{background:var(--bad)}
.detail{color:var(--muted);font-size:13px}
.counters{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.counter{border:1px solid var(--line);border-radius:8px;padding:6px 10px;font-size:13px}.counter b{font-size:16px;margin-left:6px}
pre{background:var(--bar);border-radius:10px;padding:12px;font-size:12px;overflow:auto;max-height:220px;white-space:pre-wrap}
.stale{color:var(--bad)}
</style></head><body><main>
<h1 id="title">Progresso</h1><div class="sub" id="sub">Aguardando…</div>
<div id="phases"></div><div class="counters" id="counters"></div><pre id="log" hidden></pre>
</main>
<script>
const $=id=>document.getElementById(id);
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
async function tick(){
  let s;try{s=await (await fetch('progress.json',{cache:'no-store'})).json()}catch(e){$('sub').textContent='Sem conexão com o servidor.';return}
  $('title').textContent=s.title||'Progresso';
  const sub=$('sub');sub.className='sub';
  if(s.status==='waiting'){sub.textContent='Aguardando o primeiro progresso…'}
  else if(s.status==='error'){sub.textContent='Erro ao ler o progresso: '+s.message;sub.classList.add('stale')}
  else{const age=Math.round((Date.now()-new Date(s.updated_at))/1000);
    sub.textContent='Atualizado há '+age+' s';if(age>60)sub.classList.add('stale')}
  const ph=$('phases');ph.replaceChildren();
  for(const p of s.phases||[]){
    const box=el('div','phase '+(p.status||'pending'));
    const row=el('div','row');row.append(el('span','name',p.name),el('span','',(p.done??0)+' de '+(p.total??'?')+' · '+(p.percent??0)+'%'));
    const bar=el('div','bar');const fill=el('div','fill');fill.style.width=(p.percent??0)+'%';bar.append(fill);
    box.append(row,bar);if(p.detail)box.append(el('div','detail',p.detail));ph.append(box)}
  const c=$('counters');c.replaceChildren();
  for(const [k,v] of Object.entries(s.counters||{})){const d=el('div','counter',k);d.append(el('b','',String(v)));c.append(d)}
  const log=$('log');if((s.log||[]).length){log.hidden=false;log.textContent=s.log.join('\\n');log.scrollTop=log.scrollHeight}
}
tick();setInterval(tick,1000);
</script></body></html>
"""


def percent(done: float, total: float) -> int:
    """Return the share of the work done, from 0 to 100."""
    if not total or total <= 0:
        return 0
    return max(0, min(100, round(done * 100 / total)))


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def write_progress(path: Path, state: dict) -> None:
    """Write the state atomically, so the page never reads half a file."""
    path = Path(path)
    state = {**state, "updated_at": now()}
    handle, temporary = tempfile.mkstemp(dir=path.parent, prefix=f".{path.name}.", suffix=".tmp")
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as stream:
            json.dump(state, stream, ensure_ascii=False)
        os.replace(temporary, path)
    except BaseException:
        Path(temporary).unlink(missing_ok=True)
        raise


def read_progress(path: Path) -> dict:
    """Return the state with the percent of each phase, or a state that says why there is none."""
    try:
        state = json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {"status": "waiting", "phases": [], "counters": {}, "log": []}
    except (OSError, ValueError) as error:
        return {"status": "error", "message": str(error), "phases": [], "counters": {}, "log": []}
    for phase in state.get("phases", []):
        phase["percent"] = percent(phase.get("done", 0), phase.get("total", 0))
    return state


def update_progress(
    path: Path,
    *,
    title: str | None = None,
    phase: str | None = None,
    done: int | None = None,
    total: int | None = None,
    status: str | None = None,
    detail: str | None = None,
    counters: dict | None = None,
    log: str | None = None,
) -> None:
    """Change one phase, the counters, or the log of the file, keeping the rest."""
    try:
        state = json.loads(Path(path).read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        state = {}
    state.setdefault("phases", [])
    state.setdefault("counters", {})
    state.setdefault("log", [])
    if title is not None:
        state["title"] = title
    if phase is not None:
        found = next((p for p in state["phases"] if p["name"] == phase), None)
        if found is None:
            found = {"name": phase, "status": "pending", "done": 0, "total": 0}
            state["phases"].append(found)
        for key, value in (("done", done), ("total", total), ("status", status), ("detail", detail)):
            if value is not None:
                found[key] = value
    if counters:
        state["counters"].update(counters)
    if log is not None:
        state["log"] = (state["log"] + [log])[-MAX_LOG_LINES:]
    write_progress(path, state)


def make_server(path: Path, port: int = DEFAULT_PORT, host: str = HOST) -> ThreadingHTTPServer:
    """Build the server of the page. It answers only `/` and `/progress.json`."""

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:  # noqa: N802
            if self.path == "/":
                self.send(200, "text/html; charset=utf-8", PAGE.encode())
            elif self.path == "/progress.json":
                self.send(200, "application/json", json.dumps(read_progress(path), ensure_ascii=False).encode())
            else:
                self.send(404, "text/plain; charset=utf-8", b"not found")

        def send(self, status: int, kind: str, body: bytes) -> None:
            self.send_response(status)
            self.send_header("Content-Type", kind)
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args: object) -> None:
            pass

    return ThreadingHTTPServer((host, port), Handler)


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest="command", required=True)
    serve = commands.add_parser("serve", help="serve the page")
    serve.add_argument("file", type=Path)
    serve.add_argument("--port", type=int, default=DEFAULT_PORT)
    update = commands.add_parser("update", help="change one phase, the counters, or the log of the file")
    update.add_argument("file", type=Path)
    update.add_argument("--title")
    update.add_argument("--phase")
    update.add_argument("--done", type=int)
    update.add_argument("--total", type=int)
    update.add_argument("--status", choices=["pending", "running", "done", "failed"])
    update.add_argument("--detail")
    update.add_argument("--counter", action="append", default=[], metavar="NAME=VALUE")
    update.add_argument("--log")
    args = parser.parse_args(argv)
    if args.command == "serve":
        server = make_server(args.file, args.port)
        print(f"http://{HOST}:{server.server_address[1]}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        return 0
    counters = {name: value for name, _, value in (item.partition("=") for item in args.counter)}
    update_progress(
        args.file, title=args.title, phase=args.phase, done=args.done, total=args.total,
        status=args.status, detail=args.detail, counters=counters or None, log=args.log,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
