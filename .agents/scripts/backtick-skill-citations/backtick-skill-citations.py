#!/usr/bin/env python3
"""Temporary codemod: wrap plain skill names in SKILL.md bodies in backticks.

The checker and the skill graph count a citation only as a skill name between
backticks. This rewrites the bodies of the project skills once, so existing
plain citations keep counting. It leaves the frontmatter, fenced code blocks,
inline code, and paths alone. --check lists the changes without writing.
Remove this script once every business harness has run it.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

FENCE = re.compile(r"(^```.*?^```[^\n]*$)", re.M | re.S)
INLINE = re.compile(r"(`[^`\n]*`)")


def repo_root(start: Path) -> Path:
    for path in (start, *start.parents):
        if (path / ".agents" / "config.yml").is_file():
            return path
    raise SystemExit(".agents/config.yml not found")


def skill_names(*roots: Path) -> set[str]:
    return {path.parent.name for root in roots for path in (root / ".agents" / "skills").glob("*/SKILL.md")}


def wrap_plain(text: str, names: set[str], own: str) -> str:
    pattern = re.compile(
        r"(?<![a-z0-9\-/._`])("
        + "|".join(re.escape(name) for name in sorted(names - {own}, key=len, reverse=True))
        + r")(?![a-z0-9\-/`]|\.[a-z0-9])"
    )
    return pattern.sub(r"`\1`", text)


def wrap_body(body: str, names: set[str], own: str) -> str:
    if not names - {own}:
        return body
    out: list[str] = []
    for block in FENCE.split(body):
        if block.startswith("```"):
            out.append(block)
            continue
        out.extend(part if part.startswith("`") else wrap_plain(part, names, own) for part in INLINE.split(block))
    return "".join(out)


def rewrite(text: str, names: set[str], own: str) -> str:
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---", 4)
    if end < 0:
        return text
    head, body = text[: end + 4], text[end + 4 :]
    return head + wrap_body(body, names, own)


def main(argv: list[str]) -> int:
    project = repo_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    core = repo_root(Path(__file__).resolve().parent)
    names = skill_names(project, core)
    changed = 0
    for path in sorted((project / ".agents" / "skills").glob("*/SKILL.md")):
        text = path.read_text(encoding="utf-8")
        new = rewrite(text, names, path.parent.name)
        if new == text:
            continue
        changed += 1
        print(f"{path.relative_to(project)}: {(new.count('`') - text.count('`')) // 2} citations")
        if "--check" not in argv:
            path.write_text(new, encoding="utf-8")
    print(f"{changed} skills {'would change' if '--check' in argv else 'changed'}")
    return 1 if "--check" in argv and changed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
