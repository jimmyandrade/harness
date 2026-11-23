"""Tests for draft_alt_text.py."""

from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from draft_alt_text import runs_here  # noqa: E402

SCRIPT = HERE / "draft_alt_text.py"


class RunsHereTest(unittest.TestCase):
    def test_macos_27_runs(self) -> None:
        self.assertTrue(runs_here("Darwin", "27.0"))

    def test_a_later_macos_runs(self) -> None:
        self.assertTrue(runs_here("Darwin", "28.1.2"))

    def test_macos_26_does_not_run(self) -> None:
        self.assertFalse(runs_here("Darwin", "26.4"))

    def test_linux_does_not_run(self) -> None:
        self.assertFalse(runs_here("Linux", ""))

    def test_an_unreadable_version_does_not_run(self) -> None:
        self.assertFalse(runs_here("Darwin", ""))


class CommandLineTest(unittest.TestCase):
    def run_script(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run([sys.executable, str(SCRIPT), *arguments], capture_output=True, text=True)

    def test_without_arguments_it_prints_the_usage(self) -> None:
        done = self.run_script()
        self.assertEqual(done.returncode, 2)
        self.assertIn("usage", done.stderr)

    def test_a_missing_image_is_unreadable(self) -> None:
        done = self.run_script(str(HERE / "no-such-image.png"), "context")
        self.assertEqual(done.returncode, 2)
        self.assertIn("unreadable image", done.stderr)


if __name__ == "__main__":
    unittest.main()
