"""Tests for .github/scripts/duplicate-pull-request.sh."""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / ".github" / "scripts" / "duplicate-pull-request.sh"
TITLE = "refactor(definir-x)!: rename to clarify entries"
HEAD = "60644ff1fd44465c946ddd47ee9fea0d8cc6a473"


def pull_request(number: int, title: str = TITLE, head: str = HEAD) -> dict[str, object]:
    return {
        "number": number,
        "title": title,
        "headRefOid": head,
        "url": f"https://github.com/owner/repo/pull/{number}",
    }


class DuplicatePullRequestTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        fake_gh = Path(self.tmp.name) / "gh"
        fake_gh.write_text('#!/usr/bin/env bash\nprintf "%s" "$FAKE_GH_OUTPUT"\n')
        fake_gh.chmod(0o755)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def check(self, open_pull_requests: list[dict[str, object]]) -> subprocess.CompletedProcess[str]:
        env = {
            **os.environ,
            "PATH": f"{self.tmp.name}{os.pathsep}{os.environ['PATH']}",
            "FAKE_GH_OUTPUT": json.dumps(open_pull_requests),
        }
        return subprocess.run(
            ["bash", str(SCRIPT), "owner/repo", "699", TITLE, HEAD],
            capture_output=True, text=True, env=env,
        )

    def test_pull_request_alone_passes(self) -> None:
        out = self.check([pull_request(699)])
        self.assertEqual(out.returncode, 0, out.stdout + out.stderr)

    def test_other_title_and_commit_pass(self) -> None:
        out = self.check([pull_request(699), pull_request(700, "fix: other change", "ff70a3de")])
        self.assertEqual(out.returncode, 0, out.stdout + out.stderr)

    def test_same_title_fails_and_points_to_the_other(self) -> None:
        out = self.check([pull_request(699), pull_request(698, head="ff70a3de")])
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("#698", out.stdout)
        self.assertIn("https://github.com/owner/repo/pull/698", out.stdout)
        self.assertIn("title", out.stdout)

    def test_same_head_commit_fails_and_points_to_the_other(self) -> None:
        out = self.check([pull_request(699), pull_request(698, "fix: other title")])
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("#698", out.stdout)
        self.assertIn("commit", out.stdout)

    def test_every_duplicate_is_listed(self) -> None:
        out = self.check([pull_request(699), pull_request(667), pull_request(668)])
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("#667", out.stdout)
        self.assertIn("#668", out.stdout)


if __name__ == "__main__":
    unittest.main()
