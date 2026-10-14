"""Tests for core-pins.py."""

from __future__ import annotations

import contextlib
import importlib.util
import io
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("core_pins", HERE / "core-pins.py")
pins = importlib.util.module_from_spec(spec)
sys.modules["core_pins"] = pins
spec.loader.exec_module(pins)

CORE = Path(__file__).resolve().parents[3]

PACKAGE = '{\n  "devDependencies": {\n    "harness": "github:jimmyandrade/harness#%s"\n  }\n}\n'
LOCK = (
    '{\n  "packages": {\n    "": {\n      "devDependencies": {\n'
    '        "harness": "github:jimmyandrade/harness#%s"\n      }\n    },\n'
    '    "node_modules/harness": {\n'
    '      "resolved": "git+ssh://git@github.com/jimmyandrade/harness.git#4b4fb7e795cafd7ea9b51ab20b4fa541d23f51c4"\n'
    "    }\n  }\n}\n"
)
WORKFLOW = (
    "jobs:\n  check:\n    steps:\n"
    "      - uses: jimmyandrade/harness/.github/actions/check-skill@%s\n"
    "      - uses: jimmyandrade/harness/.github/actions/sync-skill-pages@%s\n"
)
MARKETPLACE = (
    '{\n  "plugins": [\n'
    '    { "name": "core", "source": { "source": "url", "url": "https://github.com/jimmyandrade/harness.git", "ref": "%s" } }\n'
    "  ]\n}\n"
)
SETTINGS = (
    '{\n  "extraKnownMarketplaces": {\n    "harness": {\n'
    '      "source": {\n        "source": "github",\n        "repo": "jimmyandrade/harness",\n        "ref": "%s"\n      }\n'
    "    }\n  }\n}\n"
)


class CorePinsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write(self, relative: str, text: str) -> None:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    def project(self, package="v1.2.0", lock="v1.2.0", workflow=("v1.2.0", "v1.2.0"), marketplace="v1.2.0", settings="v1.2.0"):
        self.write("package.json", PACKAGE % package)
        self.write("package-lock.json", LOCK % lock)
        self.write(".github/workflows/skills.yml", WORKFLOW % workflow)
        self.write(".claude-plugin/marketplace.json", MARKETPLACE % marketplace)
        self.write(".claude/settings.json", SETTINGS % settings)

    def test_a_project_without_pins_passes(self) -> None:
        self.assertEqual(pins.check(self.root), [])

    def test_every_pin_is_found(self) -> None:
        self.project()
        found = {(pin.file.as_posix(), pin.line) for pin in pins.pins(self.root)}
        self.assertEqual(
            found,
            {
                ("package.json", 3),
                ("package-lock.json", 5),
                (".github/workflows/skills.yml", 4),
                (".github/workflows/skills.yml", 5),
                (".claude-plugin/marketplace.json", 3),
                (".claude/settings.json", 7),
            },
        )

    def test_matching_pins_pass(self) -> None:
        self.project()
        self.assertEqual(pins.check(self.root), [])

    def test_a_stale_marketplace_fails_at_its_line(self) -> None:
        self.project(marketplace="v1.1.0")
        findings = pins.check(self.root)
        self.assertEqual(len(findings), 1)
        self.assertEqual((findings[0].file.as_posix(), findings[0].line), (".claude-plugin/marketplace.json", 3))
        self.assertIn("v1.1.0", findings[0].message)
        self.assertIn("package.json:3 pins v1.2.0", findings[0].message)

    def test_each_stale_pin_is_reported(self) -> None:
        self.project(workflow=("v1.1.0", "v1.2.0"), settings="v1.1.0")
        found = {(finding.file.as_posix(), finding.line) for finding in pins.check(self.root)}
        self.assertEqual(found, {(".github/workflows/skills.yml", 4), (".claude/settings.json", 7)})

    def test_without_package_json_the_first_pin_is_the_reference(self) -> None:
        self.write(".github/workflows/skills.yml", WORKFLOW % ("v1.2.0", "v1.1.0"))
        findings = pins.check(self.root)
        self.assertEqual([(f.file.as_posix(), f.line) for f in findings], [(".github/workflows/skills.yml", 5)])

    def test_the_lockfile_commit_is_not_a_pin(self) -> None:
        self.project()
        tags = {pin.tag for pin in pins.pins(self.root) if pin.file.name == "package-lock.json"}
        self.assertEqual(tags, {"v1.2.0"})

    def test_another_repository_is_not_a_pin(self) -> None:
        self.write(".github/workflows/skills.yml", "      - uses: example/harness/.github/actions/check@v9.9.9\n")
        self.assertEqual(pins.pins(self.root), [])

    def test_github_actions_gets_an_inline_annotation(self) -> None:
        finding = pins.Finding(Path(".claude-plugin/marketplace.json"), 3, "pins the core to v1.1.0")
        out, err = io.StringIO(), io.StringIO()
        with mock.patch.dict(os.environ, {"GITHUB_ACTIONS": "true"}), contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            pins.report(finding)
        self.assertEqual(
            out.getvalue().strip(),
            "::error file=.claude-plugin/marketplace.json,line=3,title=Core pins::pins the core to v1.1.0",
        )
        self.assertIn(".claude-plugin/marketplace.json:3:", err.getvalue())

    def test_outside_github_actions_there_is_no_annotation(self) -> None:
        finding = pins.Finding(Path("package.json"), 3, "message")
        out = io.StringIO()
        with mock.patch.dict(os.environ, {"GITHUB_ACTIONS": ""}), contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
            pins.report(finding)
        self.assertEqual(out.getvalue(), "")

    def test_this_repository_and_the_example_pass(self) -> None:
        self.assertEqual(pins.check(CORE), [])
        self.assertEqual(pins.check(CORE / "examples" / "business-harness"), [])


if __name__ == "__main__":
    unittest.main()
