#!/usr/bin/env python3
"""Check that every pin of the core harness in a project names the same tag.

The project is HARNESS_ROOT, or the working directory when it is unset.
A pin is a tag of jimmyandrade/harness in one of the places the Renovate preset moves:
- package.json and package-lock.json: the harness dependency, github:jimmyandrade/harness#<tag>;
- .github/workflows/: each `uses: jimmyandrade/harness/...@<tag>`;
- .claude-plugin/marketplace.json and .claude/settings.json: a `github` or `url` source of the core
  with a `ref`, as default.json matches it.
The pin in package.json is the reference, because it installs the scripts that run this check.
Without it, the first pin found is. Exits 1 when a pin names another tag, and reports each one at
its line, as a GitHub annotation when it runs in GitHub Actions, so the pull request shows it inline.
A project without pins, such as the core itself, passes.
"""

from __future__ import annotations

import importlib.util
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path

CORE = "jimmyandrade/harness"
PACKAGE_FILES = (Path("package.json"), Path("package-lock.json"))
WORKFLOWS = Path(".github") / "workflows"
PLUGIN_FILES = (Path(".claude-plugin") / "marketplace.json", Path(".claude") / "settings.json")

PACKAGE_PIN = re.compile(re.escape(CORE) + r"(?:\.git)?#(?P<tag>v[^\"\s]+)")
WORKFLOW_PIN = re.compile(re.escape(CORE) + r"(?:/[^@\s\"']*)?@(?P<tag>v[^\s\"']+)")
# The same sources as the customManagers of default.json.
PLUGIN_PINS = (
    re.compile(r"\"source\":\s*\"github\",\s*\"repo\":\s*\"" + re.escape(CORE) + r"\",\s*\"ref\":\s*\"(?P<tag>v[^\"]+)\""),
    re.compile(
        r"\"source\":\s*\"url\",\s*\"url\":\s*\"https://github\.com/" + re.escape(CORE) + r"\.git\",\s*\"ref\":\s*\"(?P<tag>v[^\"]+)\""
    ),
)


@dataclass(frozen=True)
class Pin:
    file: Path
    line: int
    tag: str


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


def matches(root: Path, relative: Path, patterns) -> list[Pin]:
    path = root / relative
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    pins = []
    for pattern in patterns:
        for match in pattern.finditer(text):
            line = text.count("\n", 0, match.start("tag")) + 1
            pins.append(Pin(relative, line, match.group("tag")))
    return pins


def pins(root: Path) -> list[Pin]:
    found: list[Pin] = []
    for relative in PACKAGE_FILES:
        found += matches(root, relative, (PACKAGE_PIN,))
    workflows = root / WORKFLOWS
    if workflows.is_dir():
        for path in sorted([*workflows.glob("*.yml"), *workflows.glob("*.yaml")]):
            found += matches(root, path.relative_to(root), (WORKFLOW_PIN,))
    for relative in PLUGIN_FILES:
        found += matches(root, relative, PLUGIN_PINS)
    return sorted(found, key=lambda pin: (pin.file.as_posix(), pin.line))


def check(root: Path) -> list[Finding]:
    found = pins(root)
    if not found:
        return []
    reference = next((pin for pin in found if pin.file == PACKAGE_FILES[0]), found[0])
    return [
        Finding(
            pin.file,
            pin.line,
            f"pins the core to {pin.tag}, but {reference.file}:{reference.line} pins {reference.tag}. "
            "Move every pin of the core together, as the core harness pull request of Renovate does.",
        )
        for pin in found
        if pin.tag != reference.tag
    ]


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
    print(f"::error file={file},line={finding.line},title=Core pins::{workflow_escape(finding.message, prop=False)}")


def main() -> int:
    parameters = load_parameters()
    root = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
    findings = check(root)
    for finding in findings:
        report(finding)
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
