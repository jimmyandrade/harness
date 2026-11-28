"""Tests for read_photo.py."""

from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from read_photo import displayed_size, with_displayed_size  # noqa: E402

SCRIPT = HERE / "read_photo.py"


class DisplayedSizeTest(unittest.TestCase):
    def test_upright_keeps_the_sides(self) -> None:
        self.assertEqual(displayed_size(6000, 4000, 1), {"width": 6000, "height": 4000})

    def test_rotated_orientations_swap_the_sides(self) -> None:
        for orientation in (5, 6, 7, 8):
            self.assertEqual(displayed_size(6000, 4000, orientation), {"width": 4000, "height": 6000})

    def test_flipped_orientations_keep_the_sides(self) -> None:
        for orientation in (2, 3, 4):
            self.assertEqual(displayed_size(6000, 4000, orientation), {"width": 6000, "height": 4000})


class WithDisplayedSizeTest(unittest.TestCase):
    def test_orientation_6_makes_a_landscape_file_portrait(self) -> None:
        reading = with_displayed_size({"orientation": 6, "pixels": {"width": 6000, "height": 4000}})
        self.assertTrue(reading["portrait"])
        self.assertEqual(reading["displayed"], {"width": 4000, "height": 6000})

    def test_a_missing_orientation_counts_as_upright(self) -> None:
        reading = with_displayed_size({"pixels": {"width": 100, "height": 200}})
        self.assertTrue(reading["portrait"])


class CommandLineTest(unittest.TestCase):
    def test_a_missing_image_is_unreadable(self) -> None:
        done = subprocess.run(
            [sys.executable, str(SCRIPT), str(HERE / "no-such-image.jpg")], capture_output=True, text=True
        )
        self.assertEqual(done.returncode, 2)
        self.assertIn("unreadable image", done.stderr)


if __name__ == "__main__":
    unittest.main()
