"""Tests for comment-report.py."""

from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("comment_report", HERE / "comment-report.py")
comment_report = importlib.util.module_from_spec(spec)
sys.modules["comment_report"] = comment_report
spec.loader.exec_module(comment_report)

MARKER = comment_report.MARKER


class PlanTest(unittest.TestCase):
    def test_should_create_a_comment_when_none_has_the_marker(self) -> None:
        action, comment_id, body = comment_report.plan([{"id": 1, "body": "LGTM"}], "## Skill check\n")
        self.assertEqual((action, comment_id), ("create", None))
        self.assertTrue(body.startswith(MARKER))

    def test_should_edit_the_comment_that_has_the_marker(self) -> None:
        comments = [{"id": 1, "body": "LGTM"}, {"id": 7, "body": f"{MARKER}\nold"}]
        action, comment_id, body = comment_report.plan(comments, "new table\n")
        self.assertEqual((action, comment_id), ("update", 7))
        self.assertIn("new table", body)

    def test_should_say_no_skill_changes_on_an_existing_comment_without_a_report(self) -> None:
        action, comment_id, body = comment_report.plan([{"id": 7, "body": f"{MARKER}\nold"}], None)
        self.assertEqual((action, comment_id), ("update", 7))
        self.assertIn("No skill changes", body)

    def test_should_skip_without_a_report_or_a_comment(self) -> None:
        self.assertEqual(comment_report.plan([], None), ("skip", None, None))

    def test_should_ignore_a_comment_that_only_quotes_the_marker_later(self) -> None:
        action, _, _ = comment_report.plan([{"id": 3, "body": f"see {MARKER}"}], "table\n")
        self.assertEqual(action, "create")


if __name__ == "__main__":
    unittest.main()
