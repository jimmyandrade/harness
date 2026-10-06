"""Tests for measure.py."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "measure.py"
_spec = importlib.util.spec_from_file_location(
    "project_parameters",
    Path(__file__).resolve().parents[4] / ".agents" / "scripts" / "project-parameters" / "project-parameters.py",
)
project_parameters = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(project_parameters)
SKILL = """---
name: abrir-pedido
description: Use essa habilidade sempre que for abrir um pedido.
metadata:
  author: example
  version: "0.1.0"
---

# Abrir pedido
"""


class MeasureTest(unittest.TestCase):
    def measure(self, config: str) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".agents" / "skills" / "abrir-pedido").mkdir(parents=True)
            (root / ".git").mkdir()
            (root / project_parameters.INSTRUCTIONS).write_text(
                f'{project_parameters.HEADING}\n\n```yaml\n"Global":\n{config}```\n', encoding="utf-8"
            )
            skill = root / ".agents" / "skills" / "abrir-pedido" / "SKILL.md"
            skill.write_text(SKILL, encoding="utf-8")
            return subprocess.run([sys.executable, str(SCRIPT), str(skill)], capture_output=True, text=True)

    def test_limits_missing_from_the_project_come_from_the_harness(self) -> None:
        run = self.measure('  "Organização": "example"\n')
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertIn("body_limit: 5000", run.stdout)

    def test_a_limit_in_the_project_wins(self) -> None:
        run = self.measure('  "Tokens do corpo": 1000\n')
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertIn("body_limit: 1000", run.stdout)
        self.assertIn("line_limit: 500", run.stdout)


if __name__ == "__main__":
    unittest.main()
