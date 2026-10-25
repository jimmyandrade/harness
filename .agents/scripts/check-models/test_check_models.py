"""Tests for check-models.py."""

from __future__ import annotations

import importlib.util
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("check_models", HERE / "check-models.py")
models = importlib.util.module_from_spec(spec)
sys.modules["check_models"] = models
spec.loader.exec_module(models)

RELATIVE = Path(".agents/assets/templates/reel-do-instagram.md")

MODEL = """---
name: reel-do-instagram
description: Use este modelo de saída quando for montar um Reel.
metadata:
  version: "1.0.0"
  aliases:
    - reel
---

## Contexto

Para montar um Reel.

## Formato

### Assunto

## Estilo

Cada item vira um heading.
"""


def messages(text: str, previous: str | None = None) -> list[str]:
    return [finding.message for finding in models.model_errors(RELATIVE, text, previous)]


class ModelTest(unittest.TestCase):
    def test_a_valid_model_passes(self) -> None:
        self.assertEqual(messages(MODEL), [])

    def test_a_file_that_is_not_yet_a_model_is_not_checked(self) -> None:
        self.assertEqual(messages("Meses nas colunas.\n"), [])
        self.assertEqual(messages('---\ndescription: x\nmetadata:\n  version: "0.1.0"\n---\n\n# x\n'), [])

    def test_name_must_match_the_file(self) -> None:
        self.assertIn(
            "name reel must match the file name reel-do-instagram",
            messages(MODEL.replace("name: reel-do-instagram", "name: reel")),
        )
        self.assertIn(
            "name must be ASCII kebab-case, up to 64 characters",
            messages(MODEL.replace("name: reel-do-instagram", "name: Reel do Instagram")),
        )

    def test_description_and_version_are_required(self) -> None:
        found = messages(MODEL.replace("description: Use este modelo de saída quando for montar um Reel.\n", ""))
        self.assertIn("description is required", found)
        found = messages(MODEL.replace('version: "1.0.0"', "version: 1.0.0"))
        self.assertIn('metadata.version must be a double-quoted semver, such as "0.1.0"', found)
        found = messages(MODEL.replace('  version: "1.0.0"\n', ""))
        self.assertIn('metadata.version must be a double-quoted semver, such as "0.1.0"', found)

    def test_version_rises_when_the_model_changes(self) -> None:
        changed = MODEL.replace("Para montar um Reel.", "Para montar um Reel curto.")
        self.assertIn("metadata.version must increase when the model changes", messages(changed, MODEL))
        self.assertEqual(messages(changed.replace('"1.0.0"', '"1.1.0"'), MODEL), [])
        self.assertEqual(messages(MODEL, MODEL), [])

    def test_lists_flags_and_fields(self) -> None:
        self.assertIn("metadata.aliases must be a list of names, one per line", messages(MODEL.replace("  aliases:\n    - reel\n", "  aliases: reel\n")))
        self.assertIn("metadata.notion is not a field: every model syncs to Notion", messages(MODEL.replace('  version: "1.0.0"\n', '  version: "1.0.0"\n  notion: false\n')))
        self.assertIn("metadata.internal is not a field: every model syncs to Notion", messages(MODEL.replace('  version: "1.0.0"\n', "  version: \"1.0.0\"\n  internal: true\n")))
        self.assertIn("unexpected frontmatter fields: license", messages(MODEL.replace("metadata:\n", "license: MIT\nmetadata:\n")))

    def test_the_body_has_the_three_sections_in_order(self) -> None:
        message = "the body needs the sections ## Contexto, ## Formato, and ## Estilo, once each, in this order"
        self.assertIn(message, messages(MODEL.replace("## Estilo", "## Tom")))
        self.assertIn(message, messages(MODEL.replace("## Contexto", "## Estilo0").replace("## Estilo\n", "## Contexto\n")))

    def test_a_notion_url_fails(self) -> None:
        self.assertIn("a model must not embed a Notion URL", messages(MODEL + "\nhttps://www.notion.so/abc\n"))

    def test_a_name_the_core_also_uses_fails(self) -> None:
        with tempfile.TemporaryDirectory() as project, tempfile.TemporaryDirectory() as core:
            for root in (project, core):
                folder = Path(root) / ".agents" / "assets" / "templates"
                folder.mkdir(parents=True)
                (folder / "reel-do-instagram.md").write_text(MODEL, encoding="utf-8")
            subprocess.run(["git", "init", "-q"], cwd=project, check=True)
            found = models.check(Path(project), Path(core))
            self.assertEqual([finding.message for finding in found], ["the core harness also has the model reel-do-instagram; rename one of them"])
            self.assertEqual(models.check(Path(project), Path(project)), [])

    def test_the_committed_version_is_the_reference(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            env = {**os.environ, "GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@example.com", "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@example.com"}
            folder = Path(project) / ".agents" / "assets" / "templates"
            folder.mkdir(parents=True)
            path = folder / "reel-do-instagram.md"
            path.write_text(MODEL, encoding="utf-8")
            for args in (["init", "-q"], ["add", "."], ["commit", "-qm", "one"]):
                subprocess.run(["git", *args], cwd=project, env=env, check=True)
            path.write_text(MODEL.replace("Para montar", "Para criar"), encoding="utf-8")
            found = models.check(Path(project), Path(project))
            self.assertEqual([finding.message for finding in found], ["metadata.version must increase when the model changes"])


if __name__ == "__main__":
    unittest.main()
