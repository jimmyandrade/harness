"""Tests for .github/scripts/change-scope.sh."""

from __future__ import annotations

import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / ".github" / "scripts" / "change-scope.sh"


def git(cwd: Path, *args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=cwd, check=True, capture_output=True, text=True
    ).stdout.strip()


class ChangeScopeTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.repo = Path(self.tmp.name)
        git(self.repo, "init", "-q")
        git(self.repo, "config", "user.email", "test@example.com")
        git(self.repo, "config", "user.name", "Test")
        self.write("README.md", "start")
        git(self.repo, "add", "-A")
        git(self.repo, "commit", "-q", "-m", "start")
        self.base = git(self.repo, "rev-parse", "HEAD")

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write(self, path: str, text: str) -> None:
        target = self.repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)

    def scope(self, *paths: str) -> dict[str, str]:
        for path in paths:
            self.write(path, "changed")
        git(self.repo, "add", "-A")
        git(self.repo, "commit", "-q", "-m", "change")
        out = subprocess.run(
            ["bash", str(SCRIPT), self.base, "HEAD"],
            cwd=self.repo, check=True, capture_output=True, text=True,
        ).stdout
        return dict(line.split("=") for line in out.split())

    def test_documentation_needs_no_check(self):
        self.assertEqual(self.scope("docs/adr/0001-a.md", "NOTES.md"), {"code": "false", "node": "false"})

    def test_skill_text_skips_node_but_runs_the_skill_check(self):
        result = self.scope(
            ".agents/skills/a/SKILL.md",
            ".agents/skills/a/evals/evals.json",
            ".agents/skills/a/features/x.feature",
            ".agents/skills/README.md",
        )
        self.assertEqual(result, {"code": "true", "node": "false"})

    def test_skill_script_runs_node(self):
        self.assertEqual(self.scope(".agents/skills/a/scripts/read.py"), {"code": "true", "node": "true"})

    def test_a_skill_text_next_to_a_script_runs_node(self):
        result = self.scope(".agents/skills/a/SKILL.md", ".agents/scripts/b/run.sh")
        self.assertEqual(result, {"code": "true", "node": "true"})

    def test_agents_md_runs_everything(self):
        self.assertEqual(self.scope("AGENTS.md"), {"code": "true", "node": "true"})

    def test_workflow_runs_everything(self):
        self.assertEqual(self.scope(".github/workflows/ci.yml"), {"code": "true", "node": "true"})

    def test_without_a_base_runs_everything(self):
        out = subprocess.run(
            ["bash", str(SCRIPT), "", "HEAD"],
            cwd=self.repo, check=True, capture_output=True, text=True,
        ).stdout
        self.assertEqual(dict(line.split("=") for line in out.split()), {"code": "true", "node": "true"})


if __name__ == "__main__":
    unittest.main()
