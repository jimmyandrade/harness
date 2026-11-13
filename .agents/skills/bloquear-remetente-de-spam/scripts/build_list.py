#!/usr/bin/env python3
"""Build a clean list of senders: sorted, with no repeats, and without what the screen already has.

The opening comment points at the parameters in the frontmatter of AGENTS.md. This script has none.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

BUTTON_TEXT = "desbloquear"
ANGLE = re.compile(r"<([^<>]+)>")
SCHEME = re.compile(r"^[a-z][a-z0-9+.-]*://")
AFTER_HOST = re.compile(r"[/?#:].*$")


def clean(line: str) -> str:
    """Return the address or domain of one line, in lowercase, or an empty string."""
    text = line.strip()
    if text.lower().endswith(BUTTON_TEXT):
        text = text[: -len(BUTTON_TEXT)].strip()
    inside = ANGLE.search(text)
    if inside:
        text = inside.group(1)
    text = text.replace("[.]", ".").replace("[@]", "@")
    return text.strip().lower()


def host(entry: str) -> str:
    """Return the domain of a URL, without scheme, port, path or query. An address stays as it is."""
    if "@" in entry:
        return entry
    return AFTER_HOST.sub("", SCHEME.sub("", entry))


def build(lines: list[str], exclude: list[str] | None = None, hosts_only: bool = False) -> list[str]:
    """Return the cleaned entries, sorted, without repeats and without the ones already on the screen."""
    excluded = {clean(line) for line in (exclude or [])}
    entries = {host(clean(line)) if hosts_only else clean(line) for line in lines}
    return sorted(entry for entry in entries if entry and entry not in excluded)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="text file with one sender per line, as pasted")
    parser.add_argument("--exclude", type=Path, action="append", default=[], help="file with what the screen already has")
    parser.add_argument("--hosts-only", action="store_true", help="turn each URL into its domain")
    args = parser.parse_args(argv)
    lines = args.source.read_text(encoding="utf-8").splitlines()
    excluded: list[str] = []
    for path in args.exclude:
        excluded.extend(path.read_text(encoding="utf-8").splitlines())
    for entry in build(lines, excluded, args.hosts_only):
        sys.stdout.write(entry + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
