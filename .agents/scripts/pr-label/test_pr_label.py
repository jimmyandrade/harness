"""Tests for .github/scripts/pr-label.sh."""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / ".github" / "scripts" / "pr-label.sh"


def label(title: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["bash", str(SCRIPT), title], capture_output=True, text=True)


class PrLabelTest(unittest.TestCase):
    def assert_label(self, title: str, expected: str) -> None:
        out = label(title)
        self.assertEqual(out.returncode, 0, out.stderr)
        self.assertEqual(out.stdout.strip(), expected)

    def test_feature_is_an_enhancement(self) -> None:
        self.assert_label("feat(definir-okr): create objectives", "enhancement")

    def test_fix_is_a_bug(self) -> None:
        self.assert_label("fix: wait for a background command", "bug")

    def test_breaking_fix_is_a_bug(self) -> None:
        self.assert_label("fix(criar-commit)!: rename the skill", "bug")

    def test_docs_is_documentation(self) -> None:
        self.assert_label("docs(features): add definir-okr", "documentation")

    def test_ci_is_ci(self) -> None:
        self.assert_label("ci: label pull requests by title", "ci")

    def test_dependency_update_is_dependencies(self) -> None:
        self.assert_label("chore(deps): update dependency harness to v1.13.1", "dependencies")
        self.assert_label("fix(deps): update dependency flags to v4.4.0", "dependencies")

    def test_type_without_label_fails(self) -> None:
        out = label("refactor: split the checker")
        self.assertNotEqual(out.returncode, 0)
        self.assertIn("refactor", out.stderr)

    def test_title_without_type_fails(self) -> None:
        out = label("Update README")
        self.assertNotEqual(out.returncode, 0)


if __name__ == "__main__":
    unittest.main()
