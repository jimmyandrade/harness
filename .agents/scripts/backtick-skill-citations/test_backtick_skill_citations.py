"""Tests for backtick-skill-citations.py."""

from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("backtick", HERE / "backtick-skill-citations.py")
codemod = importlib.util.module_from_spec(spec)
sys.modules["backtick"] = codemod
spec.loader.exec_module(codemod)

NAMES = {"criar-commit", "criar-pull-request", "abrir-pedido"}


def body(text: str) -> str:
    return codemod.rewrite("---\nname: abrir-pedido\n---\n" + text, NAMES, "abrir-pedido").split("---\n", 2)[2]


class BacktickTest(unittest.TestCase):
    def test_a_plain_citation_gets_backticks(self) -> None:
        self.assertEqual(body("Siga criar-commit."), "Siga `criar-commit`.")

    def test_an_existing_backticked_citation_is_left_alone(self) -> None:
        self.assertEqual(body("Siga `criar-commit`."), "Siga `criar-commit`.")

    def test_a_fenced_block_is_left_alone(self) -> None:
        text = "```mermaid\nA[Siga criar-commit]\n```\n"
        self.assertEqual(body(text), text)

    def test_the_longer_name_wins(self) -> None:
        self.assertEqual(body("Use criar-pull-request."), "Use `criar-pull-request`.")

    def test_a_path_is_left_alone(self) -> None:
        text = "Veja skills/criar-commit/SKILL.md e criar-commit.md."
        self.assertEqual(body(text), text)

    def test_the_skill_does_not_cite_itself(self) -> None:
        self.assertEqual(body("Esta é abrir-pedido."), "Esta é abrir-pedido.")

    def test_the_frontmatter_is_left_alone(self) -> None:
        text = "---\nname: abrir-pedido\ndescription: NÃO use para criar-commit.\n---\nSiga criar-commit.\n"
        self.assertEqual(
            codemod.rewrite(text, NAMES, "abrir-pedido"),
            "---\nname: abrir-pedido\ndescription: NÃO use para criar-commit.\n---\nSiga `criar-commit`.\n",
        )


if __name__ == "__main__":
    unittest.main()
