#!/usr/bin/env python3
"""Check that the plugin manifests of a project agree, as ADR 0011 decides.

The project is HARNESS_ROOT, or the working directory when it is unset.
.claude-plugin/ is the source of truth. Claude Code and Codex read it as it is.
Cursor reads .cursor-plugin/plugin.json, which repeats the fields both formats share.
Exits 1 when:
- .cursor-plugin/plugin.json sets a shared field to another value than .claude-plugin/plugin.json,
  or sets it where the other does not;
- .claude-plugin/marketplace.json has a plugin source that Codex skips. Codex reads a `./` path,
  `.`, or a `url`, `git-subdir`, or `npm` object, and skips a `github` object without an error.
A project without .claude-plugin/ passes.
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys
from pathlib import Path

CLAUDE_PLUGIN = Path(".claude-plugin") / "plugin.json"
CLAUDE_MARKETPLACE = Path(".claude-plugin") / "marketplace.json"
CURSOR_PLUGIN = Path(".cursor-plugin") / "plugin.json"

# Fields with the same meaning in a Claude Code and a Cursor plugin.json.
SHARED_FIELDS = ("name", "version", "description", "author", "homepage", "repository", "license", "keywords", "skills")
REQUIRED_FIELDS = ("name", "skills")
CODEX_SOURCES = ("url", "git-subdir", "npm")


def load_parameters():
    path = Path(__file__).resolve().parents[1] / "project-parameters" / "project-parameters.py"
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_json(root: Path, relative: Path) -> tuple[dict | None, str | None]:
    path = root / relative
    if not path.is_file():
        return None, None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        return None, f"{relative}: invalid JSON: {error}"
    if not isinstance(data, dict):
        return None, f"{relative}: expected an object"
    return data, None


def manifest_errors(claude: dict, cursor: dict) -> list[str]:
    errors = []
    for field in REQUIRED_FIELDS:
        if field not in claude:
            errors.append(f"{CLAUDE_PLUGIN}: `{field}` is required")
    for field in SHARED_FIELDS:
        if claude.get(field) != cursor.get(field):
            errors.append(
                f"{CURSOR_PLUGIN}: `{field}` is {json.dumps(cursor.get(field))}, "
                f"but {CLAUDE_PLUGIN} has {json.dumps(claude.get(field))}"
            )
    return errors


def marketplace_errors(marketplace: dict) -> list[str]:
    errors = []
    for index, plugin in enumerate(marketplace.get("plugins") or []):
        source = plugin.get("source") if isinstance(plugin, dict) else None
        if isinstance(source, str):
            continue
        kind = source.get("source") if isinstance(source, dict) else None
        if kind not in CODEX_SOURCES:
            name = plugin.get("name", index) if isinstance(plugin, dict) else index
            errors.append(
                f"{CLAUDE_MARKETPLACE}: plugin {name} has source {json.dumps(kind)}, which Codex skips; "
                'use {"source": "url", "url": "https://github.com/<owner>/<repo>.git", "ref": "<tag>"}'
            )
    return errors


def check(root: Path) -> list[str]:
    errors = []
    claude, error = read_json(root, CLAUDE_PLUGIN)
    errors += [error] if error else []
    cursor, error = read_json(root, CURSOR_PLUGIN)
    errors += [error] if error else []
    marketplace, error = read_json(root, CLAUDE_MARKETPLACE)
    errors += [error] if error else []
    if cursor is not None and not (root / CLAUDE_PLUGIN).is_file():
        errors.append(f"{CURSOR_PLUGIN}: {CLAUDE_PLUGIN} is missing; it is the source of truth")
    if cursor is not None and claude is not None:
        errors += manifest_errors(claude, cursor)
    if marketplace is not None:
        errors += marketplace_errors(marketplace)
    return errors


def main() -> int:
    parameters = load_parameters()
    root = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    errors = check(root)
    for error in errors:
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
