#!/usr/bin/env python3
"""Print a local alt text draft for one fashion photo, as JSON.

The draft comes from the Vision reading and the on-device model, with the image attached.
It only runs in a local session on macOS 27 or later. It is a draft: check it against the image.
"""

from __future__ import annotations

import hashlib
import platform
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

USAGE = "usage: draft_alt_text.py <image> <context>"
UNREADABLE_IMAGE = "unreadable image"
DRAFT_UNAVAILABLE = "local draft unavailable"
MINIMUM_MACOS = 27

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "draft_alt_text.swift"


def runs_here(system: str, release: str) -> bool:
    """Tell whether the local draft can run on this system and macOS release."""
    if system != "Darwin":
        return False
    major = release.split(".")[0]
    return major.isdigit() and int(major) >= MINIMUM_MACOS


def binary() -> Path:
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()[:16]
    cache = Path(tempfile.gettempdir()) / "draft-alt-text" / digest
    program = cache / "draft"
    if program.is_file():
        return program
    cache.mkdir(parents=True, exist_ok=True)
    compiled = subprocess.run(
        ["swiftc", "-O", "-parse-as-library", "-o", str(program), str(SOURCE)],
        capture_output=True,
        text=True,
    )
    if compiled.returncode != 0 or not program.is_file():
        print(DRAFT_UNAVAILABLE, file=sys.stderr)
        raise SystemExit(3)
    return program


def main() -> int:
    if len(sys.argv) != 3:
        print(USAGE, file=sys.stderr)
        return 2
    image = Path(sys.argv[1])
    if not image.is_file():
        print(UNREADABLE_IMAGE, file=sys.stderr)
        return 2
    if not runs_here(platform.system(), platform.mac_ver()[0]) or shutil.which("swiftc") is None:
        print(DRAFT_UNAVAILABLE, file=sys.stderr)
        return 3
    done = subprocess.run([str(binary()), str(image), sys.argv[2]], stderr=subprocess.DEVNULL)
    if done.returncode == 0:
        return 0
    if done.returncode == 2:
        print(UNREADABLE_IMAGE, file=sys.stderr)
        return 2
    print(DRAFT_UNAVAILABLE, file=sys.stderr)
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
