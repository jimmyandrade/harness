#!/usr/bin/env python3
"""Check that a pull request branch is named type/short-description.

The type is a Conventional Commits type. The description is ASCII kebab-case,
and a dot may join two parts, as in a version. Branches that bots name, such as
renovate/ and release-please--, are skipped.

Usage: check-branch-name.py [branch]
The branch defaults to GITHUB_HEAD_REF. Without one, as on a push, the check is
skipped. CHECK_BRANCH_TYPES and CHECK_BRANCH_EXEMPT are space-separated lists
that replace the defaults. A failure prints an ::error annotation and, when
GITHUB_STEP_SUMMARY is set, a line in the job summary.
"""

from __future__ import annotations

import os
import re
import sys

TYPES = ("feat", "fix", "docs", "refactor", "perf", "test", "chore", "ci")
EXEMPT = ("renovate/", "dependabot/", "release-please--")
DESCRIPTION = r"[a-z0-9]+(?:[.-][a-z0-9]+)*"


def check(branch: str, types: tuple[str, ...] = TYPES, exempt: tuple[str, ...] = EXEMPT) -> str | None:
    """None when the name is valid or exempt, else the reason it is not."""
    if any(branch.startswith(prefix) for prefix in exempt):
        return None
    pattern = rf"(?:{'|'.join(re.escape(kind) for kind in types)})/{DESCRIPTION}"
    if re.fullmatch(pattern, branch):
        return None
    kind = branch.split("/", 1)[0] if "/" in branch else ""
    if kind not in types:
        return (
            f"Branch {branch!r} does not start with a Conventional Commits type. "
            f"Name it type/short-description, with a type from {', '.join(types)}."
        )
    return (
        f"Branch {branch!r} has a description that is not ASCII kebab-case. "
        "Use lowercase letters, digits, and hyphens, as in fix/mcp-path."
    )


def listed(name: str, default: tuple[str, ...]) -> tuple[str, ...]:
    value = os.environ.get(name, "").split()
    return tuple(value) if value else default


def main(argv: list[str]) -> int:
    branch = argv[1] if len(argv) > 1 else os.environ.get("GITHUB_HEAD_REF", "")
    if not branch:
        print("No pull request branch. Skipping the branch name check.")
        return 0
    problem = check(branch, listed("CHECK_BRANCH_TYPES", TYPES), listed("CHECK_BRANCH_EXEMPT", EXEMPT))
    if problem is None:
        print(f"Branch {branch!r} follows type/short-description.")
        return 0
    print(f"::error title=Branch name::{problem} Rename the branch before the first push; renaming a branch with an open pull request closes that pull request.")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as file:
            file.write(f"## Branch name\n\n{problem}\n")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
