#!/usr/bin/env python3
"""Upload a file to Notion and create a page, both through the `ntn` command line.

`upload <file>` prints the file upload id as JSON. `create-page <payload.json>` sends the payload,
written by the caller from the project's data source and property names, to the pages endpoint and
prints the response. The script knows no data source or property name. It always gives `ntn` a
closed standard input, because `ntn api -d` waits on an open one.
"""

from __future__ import annotations

import json
import mimetypes
import subprocess
import sys
from pathlib import Path

USAGE = "usage: notion_upload.py upload <file> | create-page <payload.json>"


def upload_command(path: Path) -> list[str]:
    content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return ["ntn", "files", "create", "--filename", path.name, "--content-type", content_type, "--json"]


def create_page_command() -> list[str]:
    return ["ntn", "api", "/v1/pages", "-X", "POST", "-d", "@-"]


def run(command: list[str], stdin_bytes: bytes) -> subprocess.CompletedProcess[bytes]:
    """Run `ntn` with the given bytes as the whole standard input, then close it."""
    return subprocess.run(command, input=stdin_bytes, capture_output=True)


def main(argv: list[str]) -> int:
    if len(argv) != 3 or argv[1] not in {"upload", "create-page"}:
        print(USAGE, file=sys.stderr)
        return 2
    path = Path(argv[2])
    if not path.is_file():
        print(f"no such file: {path}", file=sys.stderr)
        return 2
    if argv[1] == "upload":
        done = run(upload_command(path), path.read_bytes())
    else:
        json.loads(path.read_text())
        done = run(create_page_command(), path.read_bytes())
    sys.stdout.buffer.write(done.stdout)
    sys.stderr.buffer.write(done.stderr)
    return done.returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
