#!/usr/bin/env python3
"""Keep one skill check comment on a pull request, edited on each push.

Reads the report that check-skill.py wrote to CHECK_SKILL_REPORT. The comment
starts with MARKER, so the next run finds and edits it instead of adding
another. Without a report, it edits an existing comment to say that no skill
changes, and adds nothing when there is none.

Usage: comment-report.py <owner/repo> <pull request number> <report file>
Needs GH_TOKEN with pull-requests: write.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

MARKER = "<!-- check-skill-report -->"
NO_CHANGE = "## Skill check\n\nNo skill changes in this pull request.\n"


def plan(comments: list[dict], report: str | None) -> tuple[str, int | None, str | None]:
    """("create" | "update" | "skip", comment id, body)."""
    existing = next((item["id"] for item in comments if str(item.get("body", "")).startswith(MARKER)), None)
    if report:
        body = f"{MARKER}\n{report}"
        return ("update", existing, body) if existing is not None else ("create", None, body)
    if existing is not None:
        return "update", existing, f"{MARKER}\n{NO_CHANGE}"
    return "skip", None, None


def gh(args: list[str], body: str | None = None) -> str:
    command = ["gh", "api", *args]
    if body is not None:
        command += ["--input", "-"]
    result = subprocess.run(
        command,
        input=json.dumps({"body": body}) if body is not None else None,
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__.strip().splitlines()[-2], file=sys.stderr)
        return 2
    repository, number, report_path = argv[1:]
    path = Path(report_path)
    report = path.read_text(encoding="utf-8") if path.is_file() else None
    try:
        pages = gh(["--paginate", "--slurp", f"repos/{repository}/issues/{number}/comments"])
        comments = [item for page in json.loads(pages or "[]") for item in page]
        action, comment_id, body = plan(comments, report)
        if action == "create":
            gh(["-X", "POST", f"repos/{repository}/issues/{number}/comments"], body)
        elif action == "update":
            gh(["-X", "PATCH", f"repos/{repository}/issues/comments/{comment_id}"], body)
    except subprocess.CalledProcessError as error:
        detail = (error.stderr or "").strip().splitlines()
        reason = detail[-1] if detail else "gh failed"
        print(
            f"::warning title=Skill check comment::{reason}. Give the workflow permissions: pull-requests: write.",
        )
        return 0
    print(f"skill check comment: {action}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
