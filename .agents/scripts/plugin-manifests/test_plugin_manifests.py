"""Tests for plugin-manifests.py."""

from __future__ import annotations

import importlib.util
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("plugin_manifests", HERE / "plugin-manifests.py")
manifests = importlib.util.module_from_spec(spec)
sys.modules["plugin_manifests"] = manifests
spec.loader.exec_module(manifests)

CORE = Path(__file__).resolve().parents[3]
PLUGIN = {"name": "example", "description": "Skills of this business.", "skills": "./.agents/skills/"}


def write(root: Path, relative: Path, data: object) -> None:
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data), encoding="utf-8")


class PluginManifestsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def test_a_project_without_manifests_passes(self) -> None:
        self.assertEqual(manifests.check(self.root), [])

    def test_matching_manifests_pass(self) -> None:
        write(self.root, manifests.CLAUDE_PLUGIN, PLUGIN)
        write(self.root, manifests.CURSOR_PLUGIN, {**PLUGIN, "displayName": "Example"})
        self.assertEqual(manifests.check(self.root), [])

    def test_a_different_shared_field_fails(self) -> None:
        write(self.root, manifests.CLAUDE_PLUGIN, PLUGIN)
        write(self.root, manifests.CURSOR_PLUGIN, {**PLUGIN, "skills": "./skills/"})
        errors = manifests.check(self.root)
        self.assertEqual(len(errors), 1)
        self.assertIn("`skills`", errors[0])

    def test_a_field_only_one_manifest_sets_fails(self) -> None:
        write(self.root, manifests.CLAUDE_PLUGIN, {**PLUGIN, "version": "1.0.0"})
        write(self.root, manifests.CURSOR_PLUGIN, PLUGIN)
        self.assertIn("`version`", manifests.check(self.root)[0])

    def test_a_cursor_manifest_without_a_claude_manifest_fails(self) -> None:
        write(self.root, manifests.CURSOR_PLUGIN, PLUGIN)
        self.assertIn("missing", manifests.check(self.root)[0])

    def test_a_github_plugin_source_fails(self) -> None:
        write(
            self.root,
            manifests.CLAUDE_MARKETPLACE,
            {"plugins": [{"name": "core", "source": {"source": "github", "repo": "jimmyandrade/harness", "ref": "v1.0.0"}}]},
        )
        errors = manifests.check(self.root)
        self.assertEqual(len(errors), 1)
        self.assertIn("plugin core", errors[0])

    def test_path_and_url_plugin_sources_pass(self) -> None:
        url = {"source": "url", "url": "https://github.com/jimmyandrade/harness.git", "ref": "v1.0.0"}
        write(self.root, manifests.CLAUDE_MARKETPLACE, {"plugins": [{"name": "example", "source": "."}, {"name": "core", "source": url}]})
        self.assertEqual(manifests.check(self.root), [])

    def test_renovate_reads_the_core_pin_of_the_business_marketplace(self) -> None:
        manager = json.loads((CORE / "default.json").read_text(encoding="utf-8"))["customManagers"][0]
        patterns = [re.compile(text.replace("(?<", "(?P<")) for text in manager["matchStrings"]]
        text = (CORE / "examples" / "business-harness" / manifests.CLAUDE_MARKETPLACE).read_text(encoding="utf-8")
        found = [match.groupdict() for pattern in patterns for match in pattern.finditer(text)]
        self.assertEqual(found, [{"depName": "jimmyandrade/harness", "currentValue": "vX.Y.Z"}])

    def test_this_repository_and_the_business_example_pass(self) -> None:
        self.assertEqual(manifests.check(CORE), [])
        self.assertEqual(manifests.check(CORE / "examples" / "business-harness"), [])


if __name__ == "__main__":
    unittest.main()
