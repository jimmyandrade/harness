#!/usr/bin/env python3
"""Write the macOS folder symbol from .agents/config.yml onto each skill folder.

The project is HARNESS_ROOT, or the working directory when it is unset.
A key missing from the project .agents/config.yml falls back to the one in this harness.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ICON_ATTR = "com.apple.icon.folder#S"
FINDER_ATTR = "com.apple.FinderInfo"
CUSTOM_ICON = 0x04


def repo_root(start: Path) -> Path:
    for parent in (start, *start.parents):
        if (parent / ".agents" / "config.yml").is_file():
            return parent
    print("skill folder symbol is missing", file=sys.stderr)
    raise SystemExit(1)


def section_value(texts: list[str], section: str, key: str) -> str:
    for text in texts:
        value = find_section_value(text, section, key)
        if value is not None:
            return value
    print(f"{section}.{key} is missing from .agents/config.yml", file=sys.stderr)
    raise SystemExit(1)


def find_section_value(text: str, section: str, key: str) -> str | None:
    in_section = False
    prefix = f"{key}:"
    for raw in text.splitlines():
        line = raw.split("#", 1)[0].rstrip()
        if not line.strip():
            continue
        if not line.startswith(" ") and not line.startswith("\t"):
            in_section = line == f"{section}:"
            continue
        if in_section and line.strip().startswith(prefix):
            return line.split(":", 1)[1].strip().strip("\"'")
    return None


def symbol_payload(symbol: str) -> bytes:
    if not symbol or any(char in symbol for char in "\"{}\\"):
        print("macos.folder_icon_symbol is empty", file=sys.stderr)
        raise SystemExit(1)
    return json.dumps({"sym": symbol}, separators=(",", ":")).encode()


def read_attr(path: Path, name: str) -> bytes | None:
    result = subprocess.run(
        ["xattr", "-px", name, str(path)],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    digits = "".join(result.stdout.split())
    return bytes.fromhex(digits) if digits else b""


def write_attr(path: Path, name: str, payload: bytes) -> None:
    subprocess.run(
        ["xattr", "-wx", name, payload.hex(), str(path)],
        check=True,
    )


def finder_info(path: Path) -> bytes:
    current = bytearray(read_attr(path, FINDER_ATTR) or b"")
    if len(current) < 32:
        current.extend(b"\x00" * (32 - len(current)))
    current[8] |= CUSTOM_ICON
    return bytes(current[:32])


def write_icon(path: Path, payload: bytes) -> None:
    if read_attr(path, ICON_ATTR) != payload:
        write_attr(path, ICON_ATTR, payload)
    info = finder_info(path)
    if read_attr(path, FINDER_ATTR) != info:
        write_attr(path, FINDER_ATTR, info)


def main() -> int:
    if sys.platform != "darwin":
        return 0
    root = repo_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    core = repo_root(Path(__file__).resolve())
    config = [
        (path / ".agents" / "config.yml").read_text(encoding="utf-8")
        for path in dict.fromkeys([root, core])
    ]
    payload = symbol_payload(section_value(config, "macos", "folder_icon_symbol"))
    skills = root / ".agents" / "skills"
    if not skills.is_dir():
        return 0
    for skill in sorted(skills.iterdir()):
        if skill.is_dir() and (skill / "SKILL.md").is_file():
            write_icon(skill, payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
