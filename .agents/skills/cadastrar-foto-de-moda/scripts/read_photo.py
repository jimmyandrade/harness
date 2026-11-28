#!/usr/bin/env python3
"""Print what the Vision framework and ImageIO read from one photo, as JSON.

The output has the EXIF orientation and date, the displayed size with the orientation applied,
the Vision labels, the people count, the recognized text and the attention area. With --thumbnail
it also writes an upright JPEG thumbnail. It only runs in a local session on macOS with swiftc.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import platform
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

UNREADABLE_IMAGE = "unreadable image"
READER_UNAVAILABLE = "photo reader unavailable"
SWAPS_SIDES = {5, 6, 7, 8}

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "read_photo.swift"


def displayed_size(width: int, height: int, orientation: int) -> dict[str, int]:
    """Return the size as a person sees the photo: EXIF orientations 5 to 8 swap the sides."""
    if orientation in SWAPS_SIDES:
        return {"width": height, "height": width}
    return {"width": width, "height": height}


def with_displayed_size(reading: dict) -> dict:
    """Add `displayed` and `portrait` to the Swift reading."""
    pixels = reading["pixels"]
    shown = displayed_size(pixels["width"], pixels["height"], reading.get("orientation", 1))
    return {**reading, "displayed": shown, "portrait": shown["height"] > shown["width"]}


def binary() -> Path:
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()[:16]
    program = Path(tempfile.gettempdir()) / "read-photo" / digest / "read"
    if program.is_file():
        return program
    program.parent.mkdir(parents=True, exist_ok=True)
    compiled = subprocess.run(
        ["swiftc", "-O", "-parse-as-library", "-o", str(program), str(SOURCE)],
        capture_output=True,
        text=True,
    )
    if compiled.returncode != 0 or not program.is_file():
        print(READER_UNAVAILABLE, file=sys.stderr)
        raise SystemExit(3)
    return program


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path)
    parser.add_argument("--thumbnail", type=Path, help="write an upright JPEG thumbnail here")
    parser.add_argument("--side", type=int, default=512, help="longest side of the thumbnail")
    args = parser.parse_args()
    if not args.image.is_file():
        print(UNREADABLE_IMAGE, file=sys.stderr)
        return 2
    if platform.system() != "Darwin" or shutil.which("swiftc") is None:
        print(READER_UNAVAILABLE, file=sys.stderr)
        return 3
    command = [str(binary()), str(args.image)]
    if args.thumbnail:
        command += [str(args.thumbnail), str(args.side)]
    done = subprocess.run(command, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    if done.returncode != 0:
        print(UNREADABLE_IMAGE if done.returncode == 2 else READER_UNAVAILABLE, file=sys.stderr)
        return 2 if done.returncode == 2 else 3
    print(json.dumps(with_displayed_size(json.loads(done.stdout)), ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
