"""Tests for check-branch-name.py."""

from __future__ import annotations

import importlib.util
import os
import sys
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("check_branch_name", HERE / "check-branch-name.py")
check_branch_name = importlib.util.module_from_spec(spec)
sys.modules["check_branch_name"] = check_branch_name
spec.loader.exec_module(check_branch_name)

check = check_branch_name.check


class CheckTest(unittest.TestCase):
    def test_should_accept_a_type_and_a_kebab_case_description(self) -> None:
        for branch in ("feat/build-on-install", "fix/mcp-path", "ci/check-branch-name", "chore/vocabulary-v0.3.0", "docs/adr7"):
            self.assertIsNone(check(branch), branch)

    def test_should_refuse_a_tool_prefix(self) -> None:
        self.assertIn("Conventional Commits type", check("claude/fix-mcp-node-modules-e5de02") or "")
        self.assertIn("Conventional Commits type", check("cursor/new-thing") or "")

    def test_should_refuse_a_branch_without_a_type(self) -> None:
        self.assertIn("Conventional Commits type", check("build-on-install") or "")
        self.assertIn("Conventional Commits type", check("feature/login") or "")

    def test_should_refuse_a_description_that_is_not_kebab_case(self) -> None:
        for branch in ("feat/Build", "fix/mcp_path", "feat/", "docs/a--b", "fix/a/b", "feat/ação"):
            self.assertIn("kebab-case", check(branch) or "", branch)

    def test_should_skip_bot_branches(self) -> None:
        for branch in ("renovate/harness-core", "dependabot/npm_and_yarn/zod-4.6.6", "release-please--branches--main--components--harness"):
            self.assertIsNone(check(branch), branch)

    def test_should_use_the_given_types(self) -> None:
        self.assertIsNone(check("build/node-26", types=("build",)))
        self.assertIsNotNone(check("feat/x", types=("build",)))


class MainTest(unittest.TestCase):
    def run_main(self, env: dict[str, str], argv: list[str]) -> tuple[int, str]:
        output = StringIO()
        with mock.patch.dict(os.environ, env, clear=True), redirect_stdout(output):
            status = check_branch_name.main(["check-branch-name.py", *argv])
        return status, output.getvalue()

    def test_should_skip_without_a_branch(self) -> None:
        status, output = self.run_main({}, [])
        self.assertEqual(status, 0)
        self.assertIn("Skipping", output)

    def test_should_read_the_pull_request_branch(self) -> None:
        status, output = self.run_main({"GITHUB_HEAD_REF": "claude/x"}, [])
        self.assertEqual(status, 1)
        self.assertTrue(output.startswith("::error title=Branch name::"))

    def test_should_read_the_types_and_exempt_lists(self) -> None:
        env = {"CHECK_BRANCH_TYPES": "feat build", "CHECK_BRANCH_EXEMPT": "bot/"}
        self.assertEqual(self.run_main(env, ["build/x"])[0], 0)
        self.assertEqual(self.run_main(env, ["bot/anything"])[0], 0)
        self.assertEqual(self.run_main(env, ["renovate/x"])[0], 1)


if __name__ == "__main__":
    unittest.main()
