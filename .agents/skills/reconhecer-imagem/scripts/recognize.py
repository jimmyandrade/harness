#!/usr/bin/env python3
"""Print the text lines of one image. Reads the recognition languages from the skill parameters."""

from __future__ import annotations

USAGE = "usage: one image"
UNREADABLE_IMAGE = "unreadable image"
READ_UNAVAILABLE = "read unavailable"
LANGUAGES_MISSING = "recognition languages are missing"

import hashlib
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "read.swift"


SKILL = "reconhecer-imagem"
LANGUAGES_KEY = "Idiomas do reconhecimento"
SKILL_FILE = ROOT.parent / "SKILL.md"
# This script ships with the core. The project is HARNESS_ROOT, or the working directory.
CORE = ROOT.parents[3]
# The core parameters module needs PyYAML, which lives in the core virtual environment.
CORE_PYTHON = CORE / ".venv" / "bin" / "python"


def use_core_python() -> None:
    try:
        import yaml  # noqa: F401
    except ModuleNotFoundError:
        if CORE_PYTHON.is_file() and Path(sys.executable) != CORE_PYTHON:
            os.execv(str(CORE_PYTHON), [str(CORE_PYTHON), __file__, *sys.argv[1:]])
        print(READ_UNAVAILABLE, file=sys.stderr)
        raise SystemExit(2)


def recognition_languages() -> list[str]:
    import importlib.util

    path = CORE / ".agents" / "scripts" / "project-parameters" / "project-parameters.py"
    if not path.is_file():
        print(LANGUAGES_MISSING, file=sys.stderr)
        raise SystemExit(2)
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    parameters = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parameters)
    project = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    languages = parameters.skill_parameter([project, CORE], SKILL, LANGUAGES_KEY, SKILL_FILE)
    if not isinstance(languages, list) or not languages:
        print(LANGUAGES_MISSING, file=sys.stderr)
        raise SystemExit(2)
    return [str(language) for language in languages]


def binary() -> Path:
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()[:16]
    cache = Path(tempfile.gettempdir()) / "recognize-image" / digest
    program = cache / "read"
    if program.is_file():
        return program
    cache.mkdir(parents=True, exist_ok=True)
    compiled = subprocess.run(
        ["swiftc", "-O", "-o", str(program), str(SOURCE)],
        capture_output=True,
        text=True,
    )
    if compiled.returncode != 0 or not program.is_file():
        print(READ_UNAVAILABLE, file=sys.stderr)
        raise SystemExit(2)
    return program


def main() -> int:
    if len(sys.argv) != 2:
        print(USAGE, file=sys.stderr)
        return 2
    image = Path(sys.argv[1])
    if not image.is_file():
        print(UNREADABLE_IMAGE, file=sys.stderr)
        return 2
    use_core_python()
    languages = recognition_languages()
    done = subprocess.run(
        [str(binary()), str(image), *languages],
        stderr=subprocess.DEVNULL,
    )
    if done.returncode == 0:
        return 0
    if done.returncode == 2:
        print(UNREADABLE_IMAGE, file=sys.stderr)
        return 2
    print(READ_UNAVAILABLE, file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
