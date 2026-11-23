"""Tests for reinstall-dependencies.sh."""

from __future__ import annotations

import os
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "reinstall-dependencies.sh"
NO_COMMIT = "0" * 40


def git(repo: Path, *args: str) -> str:
    return subprocess.run(
        ["git", "-C", str(repo), *args], capture_output=True, text=True, check=True
    ).stdout.strip()


class ReinstallDependenciesTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmp.name)
        self.marker = self.repo / "reinstalled"
        git(self.repo, "init", "-q")
        git(self.repo, "config", "user.email", "test@example.com")
        git(self.repo, "config", "user.name", "Test")
        git(self.repo, "config", "commit.gpgsign", "false")
        (self.repo / ".gitignore").write_text("node_modules\nreinstalled\n")
        (self.repo / "package-lock.json").write_text('{"version": 1}\n')
        (self.repo / "app.txt").write_text("one\n")
        git(self.repo, "add", ".")
        git(self.repo, "commit", "-q", "--no-verify", "-m", "first")
        self.first = git(self.repo, "rev-parse", "HEAD")
        (self.repo / "node_modules").mkdir()

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def commit(self, path: str, text: str) -> str:
        (self.repo / path).write_text(text)
        git(self.repo, "add", path)
        git(self.repo, "commit", "-q", "--no-verify", "-m", f"change {path}")
        return git(self.repo, "rev-parse", "HEAD")

    def run_hook(self, *args: str, **env: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["sh", str(SCRIPT), *args],
            cwd=self.repo,
            capture_output=True,
            text=True,
            env={**os.environ, "REINSTALL_COMMAND": f"touch {self.marker}", **env},
        )

    def assert_reinstalled(self, out: subprocess.CompletedProcess[str], expected: bool) -> None:
        self.assertEqual(out.returncode, 0, out.stdout + out.stderr)
        self.assertEqual(self.marker.exists(), expected, out.stdout + out.stderr)

    def test_checkout_that_changes_the_lockfile_reinstalls(self) -> None:
        second = self.commit("package-lock.json", '{"version": 2}\n')
        self.assert_reinstalled(self.run_hook("post-checkout", self.first, second, "1"), True)

    def test_checkout_without_lockfile_change_skips(self) -> None:
        second = self.commit("app.txt", "two\n")
        self.assert_reinstalled(self.run_hook("post-checkout", self.first, second, "1"), False)

    def test_checkout_of_single_files_skips(self) -> None:
        second = self.commit("package-lock.json", '{"version": 2}\n')
        self.assert_reinstalled(self.run_hook("post-checkout", self.first, second, "0"), False)

    def test_first_checkout_of_a_new_worktree_skips(self) -> None:
        self.assert_reinstalled(self.run_hook("post-checkout", NO_COMMIT, self.first, "1"), False)

    def test_linked_dependencies_skip(self) -> None:
        second = self.commit("package-lock.json", '{"version": 2}\n')
        (self.repo / "node_modules").rmdir()
        (self.repo / "node_modules").symlink_to(self.tmp.name)
        self.assert_reinstalled(self.run_hook("post-checkout", self.first, second, "1"), False)

    def test_merge_that_changes_the_lockfile_reinstalls(self) -> None:
        self.commit("package-lock.json", '{"version": 2}\n')
        git(self.repo, "update-ref", "ORIG_HEAD", self.first)
        self.assert_reinstalled(self.run_hook("post-merge", "0"), True)

    def test_merge_without_lockfile_change_skips(self) -> None:
        self.commit("app.txt", "two\n")
        git(self.repo, "update-ref", "ORIG_HEAD", self.first)
        self.assert_reinstalled(self.run_hook("post-merge", "0"), False)

    def test_another_lockfile_is_read_from_the_variable(self) -> None:
        second = self.commit("app.txt", "two\n")
        self.assert_reinstalled(
            self.run_hook("post-checkout", self.first, second, "1", LOCKFILE="app.txt"), True
        )

    def test_unknown_hook_fails(self) -> None:
        out = self.run_hook("pre-push")
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("post-checkout", out.stderr)


if __name__ == "__main__":
    unittest.main()
