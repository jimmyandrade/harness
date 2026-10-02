"""Tests for skill-graph.py."""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("skill_graph", HERE / "skill-graph.py")
graph = importlib.util.module_from_spec(spec)
sys.modules["skill_graph"] = graph
spec.loader.exec_module(graph)


def write_skill(root: Path, name: str, related: list[str] | None = None, body: str = "") -> None:
    folder = root / ".agents" / "skills" / name
    folder.mkdir(parents=True, exist_ok=True)
    lines = ["---", f"name: {name}", "description: x", "metadata:", "  author: example", '  version: "0.1.0"']
    if related is not None:
        lines.append("  related:")
        lines.extend(f"    - {item}" for item in related)
    lines += ["---", "", body]
    (folder / "SKILL.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def make_root(path: Path, organization: str) -> Path:
    (path / ".agents").mkdir(parents=True)
    (path / ".agents" / "config.yml").write_text(
        f"organization:\n  name: {organization}\nmermaid:\n  flowchart_direction: LR\n"
    )
    return path


class SkillGraphTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.core = make_root(base / "core", "core")
        self.project = make_root(base / "project", "example")
        write_skill(self.core, "criar-commit", ["criar-pull-request"], "Siga criar-pull-request.")
        write_skill(self.core, "criar-pull-request")

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def test_declared_related_draws_a_solid_arrow(self) -> None:
        text = graph.build(self.core, self.core)
        self.assertIn("criar_commit --> criar_pull_request", text)

    def test_a_skill_without_related_draws_dotted_arrows_from_its_body(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Depois, criar-commit.")
        text = graph.build(self.project, self.core)
        self.assertIn("abrir_pedido -.-> criar_commit", text)

    def test_the_project_and_the_core_are_separate_groups(self) -> None:
        write_skill(self.project, "abrir-pedido")
        text = graph.build(self.project, self.core)
        self.assertIn('subgraph project["example"]', text)
        self.assertIn('subgraph core["Core"]', text)

    def test_the_table_lists_who_uses_a_skill(self) -> None:
        text = graph.build(self.core, self.core)
        self.assertIn("| `criar-pull-request` | Core | 0.1.0 | — | `criar-commit` |", text)

    def test_a_longer_name_is_not_a_citation_of_a_shorter_one(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Veja criar-commit-antigo.")
        text = graph.build(self.project, self.core)
        self.assertNotIn("abrir_pedido -.-> criar_commit", text)


if __name__ == "__main__":
    unittest.main()
