#!/usr/bin/env python3
"""Compose a project skill that extends a core skill into one SKILL.md.

A core skill marks each extension point in its body:

    <!-- extension-point: name -->
    Default text.
    <!-- /extension-point -->

A project skill with the same name declares metadata.extends: core:<name>. Its
body opens with EXTENSION_NOTICE, then lists one H3 per extension point under
"## Pontos de extensão". Composing replaces each point with the extension text,
or keeps the default, drops the markers, takes the frontmatter of the extension,
and appends any other section of the extension to the core section of the same
title. A core skill alone is composed by dropping its markers.

Usage: compose-skill.py <project root> <core root> <skill name>
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

POINT = re.compile(
    r"^<!-- extension-point: ([a-z0-9]+(?:-[a-z0-9]+)*) -->\n(.*?)^<!-- /extension-point -->\n",
    re.M | re.S,
)
MARKER = re.compile(r"^<!-- /?extension-point(?:: [^>]*)? -->$", re.M)
POINTS_SECTION = "Pontos de extensão"
APPENDABLE = ("Problemas comuns", "Exemplos de entrada e saída", "Casos-limite", "Pegadinhas")
CORE_NOTICE = "Se o projeto tem uma skill com o mesmo nome que estende esta, siga a extensão."


def extension_notice(name: str) -> str:
    return (
        f"Siga `core:{name}`. Em cada ponto de extensão abaixo, use este texto no lugar "
        "do texto padrão do core. As outras seções completam as seções do core com o mesmo título."
    )


def split(text: str) -> tuple[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("missing frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("missing frontmatter")
    return text[: end + 5], text[end + 5 :]


def extends(text: str) -> str | None:
    front, _ = split(text)
    match = re.search(r"^  extends: *(\S+) *$", front, re.M)
    return match.group(1).strip('"') if match else None


def points(core_body: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for match in POINT.finditer(core_body):
        name, default = match.group(1), match.group(2)
        nested = MARKER.search(default)
        if nested:
            raise ValueError(f"malformed extension point marker: {nested.group(0)}")
        if name in found:
            raise ValueError(f"extension point {name} is declared twice")
        found[name] = default
    leftover = MARKER.findall(POINT.sub("", core_body))
    if leftover:
        raise ValueError(f"malformed extension point marker: {leftover[0]}")
    return found


def sections(body: str) -> dict[str, str]:
    """H2 title to its text, up to the next H2, outside code fences."""
    found: dict[str, list[str]] = {}
    current: str | None = None
    fence = False
    for line in body.splitlines(keepends=True):
        if line.startswith("```"):
            fence = not fence
        if not fence and line.startswith("## "):
            current = line[3:].strip()
            found[current] = []
            continue
        if current is not None:
            found[current].append(line)
    return {title: "".join(lines) for title, lines in found.items()}


def extension_parts(body: str) -> tuple[dict[str, str], dict[str, str]]:
    """The H3 texts under the points section, and the other H2 sections."""
    by_title = sections(body)
    fills: dict[str, str] = {}
    current: str | None = None
    for line in by_title.pop(POINTS_SECTION, "").splitlines(keepends=True):
        if line.startswith("### "):
            current = line[4:].strip()
            fills[current] = ""
        elif current is not None:
            fills[current] += line
    return {key: value.strip("\n") + "\n" for key, value in fills.items()}, by_title


def strip_markers(body: str) -> str:
    return POINT.sub(lambda match: match.group(2), body)


def append_to_section(body: str, title: str, extra: str) -> str:
    lines = body.splitlines(keepends=True)
    fence = False
    start = None
    for index, line in enumerate(lines):
        if line.startswith("```"):
            fence = not fence
        if fence or not line.startswith("## "):
            continue
        if start is not None:
            return "".join(lines[:index]).rstrip("\n") + "\n\n" + extra.strip("\n") + "\n\n" + "".join(lines[index:])
        if line[3:].strip() == title:
            start = index
    if start is None:
        return body.rstrip("\n") + f"\n\n## {title}\n\n" + extra.strip("\n") + "\n"
    return body.rstrip("\n") + "\n\n" + extra.strip("\n") + "\n"


def compose(core_text: str, extension_text: str | None = None) -> str:
    core_front, core_body = split(core_text)
    if extension_text is None:
        return core_front + strip_markers(core_body)
    extension_front, extension_body = split(extension_text)
    declared = points(core_body)
    fills, extra = extension_parts(extension_body)
    unknown = sorted(set(fills) - set(declared))
    if unknown:
        raise ValueError(f"the core declares no extension point {unknown[0]}")
    body = POINT.sub(lambda match: fills.get(match.group(1), match.group(2)), core_body)
    for title in APPENDABLE:
        if extra.get(title, "").strip():
            body = append_to_section(body, title, extra[title])
    return extension_front + body


def skill_text(root: Path, name: str) -> str | None:
    path = root / ".agents" / "skills" / name / "SKILL.md"
    return path.read_text(encoding="utf-8") if path.is_file() else None


def compose_named(project: Path, core: Path, name: str) -> str:
    project_text = skill_text(project, name) if project != core else None
    core_text = skill_text(core, name)
    if project_text is not None and extends(project_text):
        if core_text is None:
            raise ValueError(f"{name} extends a core skill that does not exist")
        return compose(core_text, project_text)
    text = project_text if project_text is not None else core_text
    if text is None:
        raise ValueError(f"{name} is not a skill")
    return compose(text)


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    sys.stdout.write(compose_named(Path(argv[1]), Path(argv[2]), argv[3]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
