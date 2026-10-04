"""Tests for the metadata.related rules of check-skill.py."""

from __future__ import annotations

import importlib.util
import os
import subprocess
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
        self.assertEqual(self.errors(None, "Siga `fechar-pedido`."), [])

    def test_a_listed_skill_that_the_body_cites_passes(self) -> None:
        self.assertEqual(self.errors(["fechar-pedido", "criar-commit"], "Siga `fechar-pedido` e `criar-commit`."), [])

    def test_a_name_that_is_not_a_skill_fails(self) -> None:
        self.assertEqual(
            self.errors(["cancelar-pedido"], ""),
            ["metadata.related names cancelar-pedido, which is not a skill here or in the core"],
        )

    def test_a_cited_skill_missing_from_the_list_fails(self) -> None:
        self.assertEqual(
            self.errors([], "Depois, siga `fechar-pedido`."),
            ["the body cites fechar-pedido; add it to metadata.related"],
        )

    def test_a_plain_name_in_prose_is_not_a_citation(self) -> None:
        self.assertEqual(self.errors([], "Depois, siga fechar-pedido."), [])

    def test_a_name_in_a_mermaid_diagram_is_a_citation(self) -> None:
        self.assertEqual(
            self.errors([], "```mermaid\nflowchart LR\n  A --> B[Siga fechar-pedido]\n```\n"),
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
        self.assertEqual(self.errors([], "Use `fechar-pedido-antigo`."), [])


class GherkinTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / ".agents" / "config.yml").write_text("organization:\n  name: example\n")
        write_skill(self.project, "abrir-pedido")
        self.checker = load_checker(self.project)
        self.skill = self.project / ".agents" / "skills" / "abrir-pedido"

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, text: str, language: str = "pt") -> list[tuple[str, int | None]]:
        (self.skill / "features").mkdir(exist_ok=True)
        (self.skill / "features" / "abrir.feature").write_text(text, encoding="utf-8")
        return [(finding.message, finding.line) for finding in self.checker.gherkin_errors(self.skill, language)]

    def test_a_feature_that_starts_with_the_language_and_dado_que_passes(self) -> None:
        text = "# language: pt\n\nFuncionalidade: Abrir\n  Exemplo: Pedido\n    Dado que existe um pedido\n    E o pedido está aberto\n"
        self.assertEqual(self.errors(text), [])

    def test_a_feature_without_the_language_line_fails(self) -> None:
        self.assertEqual(self.errors("Funcionalidade: Abrir\n"), [("a feature must start with # language: pt", 1)])

    def test_a_feature_in_another_language_than_the_config_fails(self) -> None:
        self.assertEqual(self.errors("# language: pt\n", "en"), [("a feature must start with # language: en", 1)])

    def test_a_given_that_agrees_with_the_noun_fails(self) -> None:
        text = "# language: pt\n  Dada uma thread aberta\n  Dados dois pedidos\n  Dado um pedido\n"
        self.assertEqual(
            self.errors(text),
            [('a Given starts with "Dado que"', 2), ('a Given starts with "Dado que"', 3), ('a Given starts with "Dado que"', 4)],
        )

    def test_the_dado_que_rule_applies_only_to_portuguese(self) -> None:
        self.assertEqual(self.errors("# language: en\n  Dado um pedido\n", "en"), [])

    def test_a_skill_without_features_passes(self) -> None:
        self.assertEqual(self.checker.gherkin_errors(self.skill, "pt"), [])


class VersionReferenceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / ".agents" / "config.yml").write_text("organization:\n  name: example\n")
        self.git("init", "-q")
        write_skill(self.project, "abrir-pedido", body="Primeira versão.")
        self.base = self.commit("base")
        write_skill(self.project, "abrir-pedido", body="Segunda versão, sem subir a versão.")
        self.head = self.commit("head")
        self.relative = Path(".agents/skills/abrir-pedido/SKILL.md")

    def tearDown(self) -> None:
        self.tmp.cleanup()
        for key in ("HARNESS_ROOT", "CHECK_SKILL_BASE", "CHECK_SKILL_HEAD"):
            os.environ.pop(key, None)

    def git(self, *args: str) -> str:
        return subprocess.run(
            ["git", "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
            cwd=self.project, check=True, capture_output=True, text=True,
        ).stdout.strip()

    def commit(self, message: str) -> str:
        self.git("add", "-A")
        self.git("commit", "-q", "-m", message)
        return self.git("rev-parse", "HEAD")

    def test_a_committed_change_is_compared_with_the_base(self) -> None:
        os.environ["CHECK_SKILL_BASE"] = self.base
        os.environ["CHECK_SKILL_HEAD"] = self.head
        checker = load_checker(self.project)
        self.assertIn("Primeira versão.", checker.committed_text(self.relative))

    def test_without_a_base_the_change_is_compared_with_head(self) -> None:
        checker = load_checker(self.project)
        self.assertIn("Segunda versão", checker.committed_text(self.relative))


if __name__ == "__main__":
    unittest.main()


class ExtensionTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents").mkdir()
        (self.project / ".agents" / "config.yml").write_text("organization:\n  name: example\n")
        self.checker = load_checker(self.project)
        self.core_names = {path.parent.name for path in self.checker.skill_files(self.checker.CORE)}
        self.notice = self.checker.composer.extension_notice("criar-commit")

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, body: str, extends: str = "core:criar-commit", name: str = "criar-commit") -> list[str]:
        return [finding.message for finding in self.checker.extension_errors(name, extends, body, self.core_names)]

    def test_should_accept_points_and_appended_sections(self) -> None:
        body = f"\n# Criar commit\n\n{self.notice}\n\n## Pontos de extensão\n\n### tipo\n\nX.\n\n## Pegadinhas\n\n- Y.\n"
        self.assertEqual(self.errors(body), [])

    def test_should_reject_an_extension_without_the_opening(self) -> None:
        self.assertEqual(len(self.errors("\n# Criar commit\n\nOutra frase.\n")), 1)

    def test_should_reject_a_section_that_is_not_appendable(self) -> None:
        body = f"\n# Criar commit\n\n{self.notice}\n\n## Instruções\n\nX.\n"
        self.assertEqual(
            self.errors(body),
            ["an extension has only Pontos de extensão and the sections it appends, not Instruções"],
        )

    def test_should_require_extends_to_name_the_same_core_skill(self) -> None:
        self.assertEqual(self.errors("", extends="core:criar-pull-request"), ["metadata.extends must be core:criar-commit"])

    def test_should_reject_a_skill_the_core_does_not_have(self) -> None:
        self.assertEqual(self.errors("", extends="core:abrir-pedido", name="abrir-pedido"), ["the core has no skill abrir-pedido to extend"])

    def test_should_require_the_notice_on_a_skill_with_extension_points(self) -> None:
        body = "<!-- extension-point: tipo -->\nX.\n<!-- /extension-point -->\n"
        self.assertEqual(len(self.checker.extension_point_errors(body)), 1)
        self.assertEqual(self.checker.extension_point_errors(body + self.checker.composer.CORE_NOTICE + "\n"), [])
