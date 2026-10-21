#!/usr/bin/env python3
"""Check the frontmatter and the sections of every model in .agents/assets/templates.

The project is HARNESS_ROOT, or the working directory when it is unset.
A model is a Markdown file there whose frontmatter has `name`, as ADR 0012 and ADR 0015 decide.
A file without frontmatter, or whose frontmatter has no `name`, is an output shape not yet written
as a model, and the sync leaves it out of Notion, so it is not checked.
A model has `name`, equal to the file name in ASCII kebab-case, `description`, and `metadata.version`
as a double-quoted semver that rises when the file changes. `metadata.aliases` and `metadata.tags`
are lists. Its body has the sections Contexto, Formato, and Estilo, in this order.
A model name that the core also uses stops the sync, so it fails here too.
Exits 1 on a finding, and reports each one at its line, as a GitHub annotation in GitHub Actions.
"""

from __future__ import annotations

import importlib.util
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import yaml

TEMPLATES = Path(".agents") / "assets" / "templates"
ALLOWED_FIELDS = {"name", "description", "metadata"}
LIST_FIELDS = ("aliases", "tags")
SECTIONS = ("Contexto", "Formato", "Estilo")
NAME = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SEMVER = re.compile(r'^"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"$')
NOTION_URL = re.compile(r"notion\.(?:so|com)|collection://|view://", re.IGNORECASE)
SECTION = re.compile(r"^##[ \t]+(.+?)\s*$")


@dataclass(frozen=True)
class Finding:
    file: Path
    line: int
    message: str


def load_parameters():
    path = Path(__file__).resolve().parents[1] / "project-parameters" / "project-parameters.py"
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def split(text: str) -> tuple[list[str], int] | None:
    """The frontmatter lines and the line number where the body starts, or None without frontmatter."""
    lines = text.split("\n")
    if not lines or lines[0] != "---":
        return None
    for index in range(1, len(lines)):
        if lines[index] == "---":
            return lines[1:index], index + 2
    return None


def line_of(front: list[str], key: str, indent: int = 0) -> int:
    prefix = " " * indent + f"{key}:"
    for index, raw in enumerate(front):
        if raw.startswith(prefix):
            return index + 2
    return 1


def raw_version(front: list[str]) -> str | None:
    in_metadata = False
    for raw in front:
        if raw and not raw.startswith(" "):
            in_metadata = raw.startswith("metadata:")
            continue
        if in_metadata and re.match(r"^ {2}version:", raw):
            return raw.split(":", 1)[1].strip()
    return None


def version_key(raw: str | None) -> tuple[int, int, int] | None:
    match = SEMVER.fullmatch(raw or "")
    return None if match is None else tuple(int(part) for part in match.groups())


def model_name(text: str) -> str | None:
    """The name of a model, or None when the file is not a model."""
    parts = split(text)
    if parts is None:
        return None
    try:
        data = yaml.safe_load("\n".join(parts[0]))
    except yaml.YAMLError:
        return None
    if not isinstance(data, dict) or "name" not in data:
        return None
    return str(data["name"])


def model_errors(relative: Path, text: str, previous: str | None = None) -> list[Finding]:
    """Findings of one file, none when it is not a model."""
    parts = split(text)
    if parts is None:
        return []
    front, body_start = parts
    try:
        data = yaml.safe_load("\n".join(front))
    except yaml.YAMLError as error:
        return [Finding(relative, 1, f"frontmatter is not valid YAML: {error}")]
    if not isinstance(data, dict) or "name" not in data:
        return []
    found: list[Finding] = []

    def add(line: int, message: str) -> None:
        found.append(Finding(relative, line, message))

    unexpected = sorted(set(data) - ALLOWED_FIELDS)
    if unexpected:
        add(line_of(front, unexpected[0]), "unexpected frontmatter fields: " + ", ".join(unexpected))
    name = data.get("name")
    if not isinstance(name, str) or NAME.fullmatch(name) is None or len(name) > 64:
        add(line_of(front, "name"), "name must be ASCII kebab-case, up to 64 characters")
    elif name != relative.stem:
        add(line_of(front, "name"), f"name {name} must match the file name {relative.stem}")
    description = data.get("description")
    if not isinstance(description, str) or not description.strip():
        add(line_of(front, "description"), "description is required")
    elif len(description) > 1024:
        add(line_of(front, "description"), f"description exceeds 1024 characters ({len(description)})")
    metadata = data.get("metadata")
    if not isinstance(metadata, dict):
        add(line_of(front, "metadata"), 'metadata is required, with version as a double-quoted semver such as "0.1.0"')
        metadata = {}
    else:
        version = raw_version(front)
        if version_key(version) is None:
            add(line_of(front, "version", 2), 'metadata.version must be a double-quoted semver, such as "0.1.0"')
        elif previous is not None and previous != text:
            earlier = split(previous)
            old = version_key(raw_version(earlier[0])) if earlier else None
            if old is not None and version_key(version) <= old:
                add(line_of(front, "version", 2), "metadata.version must increase when the model changes")
        for key in LIST_FIELDS:
            value = metadata.get(key)
            if value is None:
                continue
            if not isinstance(value, list) or not all(isinstance(item, str) and item.strip() for item in value):
                add(line_of(front, key, 2), f"metadata.{key} must be a list of names, one per line")
        if "notion" in metadata and metadata["notion"] != "false":
            add(line_of(front, "notion", 2), 'metadata.notion must be "false"')
        if "internal" in metadata and metadata["internal"] is not True:
            add(line_of(front, "internal", 2), "metadata.internal must be true")
    lines = text.split("\n")
    headings = [
        (number, match.group(1))
        for number, raw in enumerate(lines[body_start - 1 :], start=body_start)
        if (match := SECTION.match(raw))
    ]
    titles = [title for _, title in headings if title in SECTIONS]
    if titles != list(SECTIONS):
        add(
            headings[0][0] if headings else body_start,
            "the body needs the sections ## Contexto, ## Formato, and ## Estilo, once each, in this order",
        )
    for number, raw in enumerate(lines, start=1):
        if NOTION_URL.search(raw):
            add(number, "a model must not embed a Notion URL")
    return found


def model_files(root: Path) -> list[Path]:
    folder = root / TEMPLATES
    if not folder.is_dir():
        return []
    return sorted(path for path in folder.glob("*.md") if path.is_file())


def reference() -> str:
    base = os.environ.get("CHECK_SKILL_BASE", "")
    return base if base and not set(base) <= {"0"} else "HEAD"


def committed(root: Path, relative: Path) -> str | None:
    result = subprocess.run(
        ["git", "show", f"{reference()}:{relative.as_posix()}"],
        cwd=root,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    return result.stdout if result.returncode == 0 else None


def check(root: Path, core: Path) -> list[Finding]:
    found: list[Finding] = []
    core_names = (
        {name for path in model_files(core) if (name := model_name(path.read_text(encoding="utf-8")))}
        if core.resolve() != root.resolve()
        else set()
    )
    for path in model_files(root):
        relative = path.relative_to(root)
        text = path.read_text(encoding="utf-8")
        found += model_errors(relative, text, committed(root, relative))
        name = model_name(text)
        if name in core_names:
            found.append(Finding(relative, 2, f"the core harness also has the model {name}; rename one of them"))
    return found


def workflow_escape(value: str, *, prop: bool) -> str:
    value = value.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    if prop:
        value = value.replace(":", "%3A").replace(",", "%2C")
    return value


def report(finding: Finding) -> None:
    print(f"{finding.file.as_posix()}:{finding.line}: {finding.message}", file=sys.stderr)
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    file = workflow_escape(finding.file.as_posix(), prop=True)
    print(f"::error file={file},line={finding.line},title=Models::{workflow_escape(finding.message, prop=False)}")


def main() -> int:
    parameters = load_parameters()
    root = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    findings = check(root, parameters.core_root())
    for finding in findings:
        report(finding)
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
