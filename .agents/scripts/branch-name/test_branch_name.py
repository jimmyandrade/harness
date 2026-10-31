"""Tests for .github/scripts/branch-name.sh."""

from __future__ import annotations

import os
import subprocess
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = ROOT / ".github" / "scripts" / "branch-name.sh"
ACTION_INPUTS = yaml.safe_load((ROOT / ".github" / "actions" / "check-branch-name" / "action.yml").read_text())["inputs"]
DEFAULTS = {
    "BRANCH_TYPES": ACTION_INPUTS["types"]["default"],
    "BLOCKED_BRANCH_PREFIXES": ACTION_INPUTS["blocked-prefixes"]["default"],
    "ALLOWED_BRANCH_PREFIXES": ACTION_INPUTS["allowed-prefixes"]["default"],
}


def check(branch: str, **env: str) -> subprocess.CompletedProcess[str]:
    """Run the script as the action does, with the action's default lists unless a test replaces one."""
    return subprocess.run(
        ["bash", str(SCRIPT), branch], capture_output=True, text=True, env={**os.environ, **DEFAULTS, **env}
    )


class BranchNameTest(unittest.TestCase):
    def assert_passes(self, branch: str) -> None:
        out = check(branch)
        self.assertEqual(out.returncode, 0, out.stdout + out.stderr)

    def assert_agent_message(self, branch: str) -> None:
        out = check(branch)
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("coding agent", out.stdout)
        self.assertIn("criar-pull-request", out.stdout)
        self.assertIn("jimmyandrade/harness", out.stdout)

    def test_type_and_description_pass(self) -> None:
        self.assert_passes("ci/reject-duplicate-pull-requests")
        self.assert_passes("fix/wait-for-v1.2")

    def test_bot_branches_pass(self) -> None:
        self.assert_passes("renovate/harness-1.x")
        self.assert_passes("dependabot/npm_and_yarn/zod-4.6.7")
        self.assert_passes("release-please--branches--main")

    def test_agent_prefix_gets_the_agent_message(self) -> None:
        for branch in (
            "cursor/refactor-rename-lancamento-to-financeiro-ab78",
            "claude/fix-the-check",
            "copilot/fix-123",
            "codex/add-a-check",
        ):
            with self.subTest(branch=branch):
                self.assert_agent_message(branch)

    def test_agent_message_asks_to_check_the_instructions_first(self) -> None:
        out = check("cursor/fix-the-check")
        self.assertIn("check whether your instructions already have this rule", out.stdout)

    def test_agent_message_lists_the_accepted_types(self) -> None:
        out = check("cursor/fix-the-check")
        self.assertIn("feat, fix, docs, refactor, perf, test, chore, ci", out.stdout)

    def test_every_listed_type_passes(self) -> None:
        for branch_type in ("feat", "fix", "docs", "refactor", "perf", "test", "chore", "ci"):
            with self.subTest(branch_type=branch_type):
                self.assert_passes(f"{branch_type}/short-description")

    def test_custom_types_replace_the_default_list(self) -> None:
        self.assertEqual(check("build/bump-node", BRANCH_TYPES="feat fix build").returncode, 0)
        out = check("cursor/x", BRANCH_TYPES="feat,fix,build")
        self.assertIn("accepted here: feat, fix, build.", out.stdout)

    def test_type_left_out_of_custom_types_fails(self) -> None:
        self.assertNotEqual(check("docs/readme", BRANCH_TYPES="feat fix").returncode, 0)

    def test_custom_blocked_prefixes_replace_the_default_list(self) -> None:
        out = check("devin/fix-it", BLOCKED_BRANCH_PREFIXES="devin, cursor")
        self.assertIn("coding agent", out.stdout)
        self.assertNotIn("coding agent", check("claude/fix-it", BLOCKED_BRANCH_PREFIXES="devin").stdout)

    def test_custom_allowed_prefixes_replace_the_default_list(self) -> None:
        self.assertEqual(check("snyk-upgrade-zod", ALLOWED_BRANCH_PREFIXES="snyk- renovate/").returncode, 0)
        self.assertNotEqual(check("dependabot/npm/zod", ALLOWED_BRANCH_PREFIXES="snyk-,renovate/").returncode, 0)

    def test_empty_list_fails_and_names_the_variable(self) -> None:
        for variable in DEFAULTS:
            with self.subTest(variable=variable):
                out = check("docs/readme", **{variable: ""})
                self.assertNotEqual(out.returncode, 0)
                self.assertIn(variable, out.stdout)

    def test_other_invalid_name_gets_the_usual_message(self) -> None:
        out = check("my-branch")
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("is not type/short-description", out.stdout)
        self.assertNotIn("coding agent", out.stdout)


if __name__ == "__main__":
    unittest.main()
