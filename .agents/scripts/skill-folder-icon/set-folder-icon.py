#!/usr/bin/env python3
"""Write the macOS folder symbol from the AGENTS.md parameter block onto each skill folder.

The project is HARNESS_ROOT, or the working directory when it is unset.
A setting missing from the project AGENTS.md falls back to the one in this harness.
"""

from __future__ import annotations

import json
import importlib.util
import os
import subprocess
import sys
from pathlib import Path

ICON_ATTR = "com.apple.icon.folder#S"
FINDER_ATTR = "com.apple.FinderInfo"
CUSTOM_ICON = 0x04


CORE = Path(__file__).resolve().parents[3]


def load_parameters():
    path = CORE / ".agents" / "scripts" / "project-parameters" / "project-parameters.py"
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


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
    parameters = load_parameters()
    root = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    payload = symbol_payload(str(parameters.setting([root, CORE], "Símbolo da pasta no macOS")))
    skills = root / ".agents" / "skills"
    if not skills.is_dir():
        return 0
    for skill in sorted(skills.iterdir()):
        if skill.is_dir() and (skill / "SKILL.md").is_file():
            write_icon(skill, payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
