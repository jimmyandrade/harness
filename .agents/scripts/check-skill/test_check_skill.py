"""Tests for the metadata.related rules of check-skill.py."""

from __future__ import annotations

import importlib.util
import os
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load_checker(project: Path):
    os.environ["HARNESS_ROOT"] = str(project)
    spec = importlib.util.spec_from_file_location("check_skill", HERE / "check-skill.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules["check_skill"] = module
    spec.loader.exec_module(module)
    return module


def write_skill(root: Path, name: str, related: list[str] | None = None, body: str = "") -> None:
    folder = root / ".agents" / "skills" / name
    folder.mkdir(parents=True, exist_ok=True)
    lines = ["---", f"name: {name}", "description: x", "metadata:", "  author: example", '  version: "0.1.0"']
    if related is not None:
        lines.append("  related:")
        lines.extend(f"    - {item}" for item in related)
    lines += ["---", "", body]
    (folder / "SKILL.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


class RelatedSkillsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents").mkdir()
        (self.project / ".agents" / "config.yml").write_text("organization:\n  name: example\n")
        write_skill(self.project, "abrir-pedido")
        write_skill(self.project, "fechar-pedido")
        self.checker = load_checker(self.project)
        self.known = self.checker.known_skill_names()

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, related: list[str] | None, body: str) -> list[str]:
        write_skill(self.project, "abrir-pedido", related, body)
        text = (self.project / ".agents" / "skills" / "abrir-pedido" / "SKILL.md").read_text()
        block = self.checker.frontmatter(text, Path("SKILL.md"))
        return [finding.message for finding in self.checker.related_errors(block, body, "abrir-pedido", self.known)]

    def test_known_names_include_the_project_and_the_core(self) -> None:
        self.assertIn("abrir-pedido", self.known)
        self.assertIn("criar-commit", self.known)

    def test_a_skill_without_related_is_not_checked(self) -> None:
        self.assertEqual(self.errors(None, "Siga fechar-pedido."), [])

    def test_a_listed_skill_that_the_body_cites_passes(self) -> None:
        self.assertEqual(self.errors(["fechar-pedido", "criar-commit"], "Siga fechar-pedido e criar-commit."), [])

    def test_a_name_that_is_not_a_skill_fails(self) -> None:
        self.assertEqual(
            self.errors(["cancelar-pedido"], ""),
            ["metadata.related names cancelar-pedido, which is not a skill here or in the core"],
        )

    def test_a_cited_skill_missing_from_the_list_fails(self) -> None:
        self.assertEqual(
            self.errors([], "Depois, siga fechar-pedido."),
            ["the body cites fechar-pedido; add it to metadata.related"],
        )

    def test_the_skill_itself_and_repeats_fail(self) -> None:
        self.assertEqual(
            self.errors(["abrir-pedido", "fechar-pedido", "fechar-pedido"], "fechar-pedido"),
            [
                "metadata.related must not name the skill itself",
                "metadata.related repeats fechar-pedido",
            ],
        )

    def test_a_longer_name_is_not_a_citation_of_a_shorter_one(self) -> None:
        self.assertEqual(self.errors([], "Use fechar-pedido-antigo."), [])


if __name__ == "__main__":
    unittest.main()
