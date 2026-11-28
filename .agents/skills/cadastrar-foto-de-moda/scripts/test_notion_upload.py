"""Tests for notion_upload.py, with a fake `ntn` that records its arguments and standard input."""

from __future__ import annotations

import json
import os
import stat
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from notion_upload import create_page_command, upload_command  # noqa: E402

SCRIPT = HERE / "notion_upload.py"
FAKE_NTN = """#!/bin/sh
printf '%s\\n' "$@" > "$FAKE_DIR/arguments"
cat > "$FAKE_DIR/stdin"
echo '{"id": "fake-id"}'
"""


class CommandTest(unittest.TestCase):
    def test_upload_names_the_file_and_the_type(self) -> None:
        command = upload_command(Path("/x/jaqueta-frente.jpg"))
        self.assertEqual(command[:3], ["ntn", "files", "create"])
        self.assertIn("jaqueta-frente.jpg", command)
        self.assertIn("image/jpeg", command)

    def test_create_page_reads_the_body_from_standard_input(self) -> None:
        self.assertEqual(create_page_command()[-2:], ["-d", "@-"])


class CommandLineTest(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = Path(tempfile.mkdtemp())
        fake = self.directory / "ntn"
        fake.write_text(FAKE_NTN)
        fake.chmod(fake.stat().st_mode | stat.S_IEXEC)
        self.env = {**os.environ, "PATH": f"{self.directory}:{os.environ['PATH']}", "FAKE_DIR": str(self.directory)}

    def run_script(self, *arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), *arguments], capture_output=True, text=True, env=self.env, timeout=20
        )

    def test_upload_sends_the_file_bytes_and_closes_standard_input(self) -> None:
        photo = self.directory / "foto.jpg"
        photo.write_bytes(b"bytes")
        done = self.run_script("upload", str(photo))
        self.assertEqual(done.returncode, 0)
        self.assertEqual((self.directory / "stdin").read_bytes(), b"bytes")
        self.assertIn("fake-id", done.stdout)

    def test_create_page_sends_the_payload_and_does_not_hang(self) -> None:
        payload = self.directory / "page.json"
        payload.write_text(json.dumps({"parent": {}}))
        done = self.run_script("create-page", str(payload))
        self.assertEqual(done.returncode, 0)
        self.assertEqual(json.loads((self.directory / "stdin").read_text()), {"parent": {}})

    def test_an_invalid_payload_is_refused(self) -> None:
        payload = self.directory / "page.json"
        payload.write_text("not json")
        self.assertNotEqual(self.run_script("create-page", str(payload)).returncode, 0)

    def test_a_missing_file_exits_2(self) -> None:
        self.assertEqual(self.run_script("upload", str(self.directory / "no.jpg")).returncode, 2)


if __name__ == "__main__":
    unittest.main()
