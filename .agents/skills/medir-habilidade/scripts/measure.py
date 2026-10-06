#!/usr/bin/env python3
"""Print the size of one skill. Reads limits from the instructions parameters.

The limits come from the project of the measured skill. A key missing there
falls back to the instructions file of the harness that ships this script.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

USAGE = "usage: one SKILL.md"
CORE = Path(__file__).resolve().parents[4]
UNREADABLE = "unreadable skill"
LIMIT_MISSING = "skill limits are missing"


def load_parameters():
    path = CORE / ".agents" / "scripts" / "project-parameters" / "project-parameters.py"
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def front_value(block: str, key: str) -> str:
    prefix = f"{key}:"
    for raw in block.splitlines():
        if raw.startswith(prefix):
            return raw.split(":", 1)[1].strip()
    return ""


def body_slice(text: str) -> str:
    if not text.startswith("---\n"):
        print(UNREADABLE, file=sys.stderr)
        raise SystemExit(2)
    end = text.find("\n---", 4)
    if end < 0:
        print(UNREADABLE, file=sys.stderr)
        raise SystemExit(2)
    return text[end + 4 :]


def result(over: bool) -> str:
    return "fail" if over else "pass"


def main() -> int:
    if len(sys.argv) != 2:
        print(USAGE, file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        print(UNREADABLE, file=sys.stderr)
        return 2
    try:
        import tiktoken
    except ImportError:
        print("tiktoken is required", file=sys.stderr)
        return 2
    parameters = load_parameters()
    roots = [parameters.project_root(path.resolve().parent), CORE]
    word_limit = int(parameters.setting(roots, "Palavras"))
    line_limit = int(parameters.setting(roots, "Linhas"))
    catalog_limit = int(parameters.setting(roots, "Tokens do catálogo"))
    body_limit = int(parameters.setting(roots, "Tokens do corpo"))
    encoding = tiktoken.get_encoding("o200k_base")
    body = body_slice(text)
    front = text[4 : text.find("\n---", 4)]
    name = front_value(front, "name")
    description = front_value(front, "description")
    body_tokens = len(encoding.encode(body))
    catalog_tokens = len(encoding.encode(f"{name}\n{description}"))
    lines = len(text.splitlines())
    words = len(text.split())
    share = f"{body_tokens * 100 / body_limit:.1f}%" if body_limit > 0 else "unavailable"
    rows = [
        ("body_tokens", str(body_tokens)),
        ("body_limit", str(body_limit)),
        ("body_share", share),
        ("body_result", result(body_tokens >= body_limit)),
        ("lines", str(lines)),
        ("line_limit", str(line_limit)),
        ("line_result", result(lines >= line_limit)),
        ("words", str(words)),
        ("word_limit", str(word_limit)),
        ("word_result", result(words > word_limit)),
        ("body_characters", str(len(body))),
        ("catalog_tokens", str(catalog_tokens)),
        ("catalog_limit", str(catalog_limit)),
        ("catalog_result", result(catalog_tokens > catalog_limit)),
    ]
    for key, value in rows:
        print(f"{key}: {value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
