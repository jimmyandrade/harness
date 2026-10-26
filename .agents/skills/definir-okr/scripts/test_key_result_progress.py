"""Tests for key_result_progress.py."""

from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from key_result_progress import progress  # noqa: E402

SCRIPT = HERE / "key_result_progress.py"


class ProgressTest(unittest.TestCase):
    def test_increase_from_zero(self) -> None:
        self.assertEqual(progress("increase", 500, 1000), {"progress": 0.5, "reached": False})

    def test_increase_from_a_base(self) -> None:
        self.assertEqual(progress("increase", 150, 200, base=100), {"progress": 0.5, "reached": False})

    def test_decrease_at_the_base_is_zero(self) -> None:
        self.assertEqual(progress("decrease", 4000, 3000, base=4000), {"progress": 0.0, "reached": False})

    def test_decrease_halfway(self) -> None:
        self.assertEqual(progress("decrease", 3500, 3000, base=4000), {"progress": 0.5, "reached": False})

    def test_decrease_to_zero_is_reached(self) -> None:
        result = progress("decrease", 0, 3130, base=3912.28)
        self.assertTrue(result["reached"])
        self.assertGreater(result["progress"], 1)

    def test_decrease_without_a_base_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "base"):
            progress("decrease", 100, 50)

    def test_decrease_with_a_base_below_the_target_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "above the target"):
            progress("decrease", 100, 50, base=40)

    def test_stay_above(self) -> None:
        self.assertEqual(progress("stay-above", 70, 60), {"progress": 1.0, "reached": True})
        self.assertEqual(progress("stay-above", 30, 60), {"progress": 0.5, "reached": False})

    def test_stay_below(self) -> None:
        self.assertEqual(progress("stay-below", 12, 15), {"progress": 1.0, "reached": True})
        self.assertEqual(progress("stay-below", 30, 15), {"progress": 0.5, "reached": False})

    def test_unknown_direction_fails(self) -> None:
        with self.assertRaisesRegex(ValueError, "direction"):
            progress("sideways", 1, 2)

    def test_command_line_prints_json(self) -> None:
        out = subprocess.run(
            [sys.executable, str(SCRIPT), "--direction", "decrease", "--current", "0", "--target", "3130", "--base", "3912.28"],
            capture_output=True,
            text=True,
            check=True,
        )
        self.assertTrue(json.loads(out.stdout)["reached"])


if __name__ == "__main__":
    unittest.main()
