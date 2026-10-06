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
    (path / graph.parameters.INSTRUCTIONS).write_text(
        f'{graph.parameters.HEADING}\n\n```yaml\n"Global":\n  "Organização": "{organization}"\n  "Direção dos fluxogramas": "LR"\n```\n',
        encoding="utf-8",
    )
    return path


class SkillGraphTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.core = make_root(base / "core", "core")
        self.project = make_root(base / "project", "example")
        write_skill(self.core, "criar-commit", ["criar-pull-request"], "Siga `criar-pull-request`.")
        write_skill(self.core, "criar-pull-request")

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def test_declared_related_draws_a_solid_arrow(self) -> None:
        text = graph.build(self.core, self.core)
        self.assertIn("criar_commit --> criar_pull_request", text)

    def test_a_skill_without_related_draws_dotted_arrows_from_its_body(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Depois, `fechar-pedido`.")
        write_skill(self.project, "fechar-pedido")
        text = graph.build(self.project, self.core)
        self.assertIn("abrir_pedido -.-> fechar_pedido", text)

    def test_the_project_and_the_core_are_separate_groups(self) -> None:
        write_skill(self.project, "abrir-pedido", ["criar-commit"], "Depois, criar-commit.")
        text = graph.build(self.project, self.core)
        self.assertIn('subgraph project["example"]', text)
        self.assertIn('subgraph core["Core"]', text)

    def test_the_readme_has_only_the_graph(self) -> None:
        text = graph.build(self.core, self.core)
        self.assertNotIn("| ", text)
        self.assertTrue(text.rstrip().endswith("```"))

    def test_a_longer_name_is_not_a_citation_of_a_shorter_one(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Veja criar-commit-antigo.")
        text = graph.build(self.project, self.core)
        self.assertNotIn("abrir_pedido -.-> criar_commit", text)

    def test_a_project_graph_shows_only_the_core_skills_it_cites(self) -> None:
        write_skill(self.project, "abrir-pedido", ["criar-commit"], "Depois, criar-commit.")
        text = graph.build(self.project, self.core)
        self.assertIn('criar_commit["criar-commit"]', text)
        self.assertNotIn('criar_pull_request["criar-pull-request"]', text)

    def test_a_project_graph_draws_no_arrows_between_core_skills(self) -> None:
        write_skill(self.project, "abrir-pedido", ["criar-commit", "criar-pull-request"], "Depois, criar-commit e criar-pull-request.")
        text = graph.build(self.project, self.core)
        self.assertNotIn("criar_commit --> criar_pull_request", text)

    def test_a_core_release_that_adds_or_relates_skills_leaves_the_project_graph_unchanged(self) -> None:
        write_skill(self.project, "abrir-pedido", ["criar-commit"], "Depois, criar-commit.")
        before = graph.build(self.project, self.core)
        write_skill(self.core, "revisar-pedido")
        write_skill(self.core, "criar-commit", ["criar-pull-request", "revisar-pedido"], "Siga criar-pull-request.")
        self.assertEqual(graph.build(self.project, self.core), before)

    def test_a_project_graph_keeps_the_core_group_without_citations(self) -> None:
        write_skill(self.project, "abrir-pedido")
        text = graph.build(self.project, self.core)
        self.assertIn('subgraph core["Core"]', text)
        self.assertIn('core_plugin(["core"])', text)
        self.assertNotIn('criar_commit["criar-commit"]', text)

    def test_the_core_graph_has_no_core_plugin_node(self) -> None:
        self.assertNotIn("core_plugin", graph.build(self.core, self.core))

    def test_a_body_citation_of_a_core_skill_added_later_leaves_the_project_graph_unchanged(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Depois, revisar-pedido.")
        before = graph.build(self.project, self.core)
        write_skill(self.core, "revisar-pedido")
        self.assertEqual(graph.build(self.project, self.core), before)

    def test_a_plain_name_in_prose_draws_no_arrow(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "Depois, fechar-pedido.")
        write_skill(self.project, "fechar-pedido")
        self.assertNotIn("abrir_pedido -.-> fechar_pedido", graph.build(self.project, self.core))

    def test_a_name_in_a_mermaid_diagram_draws_a_dotted_arrow(self) -> None:
        write_skill(self.project, "abrir-pedido", None, "```mermaid\nflowchart LR\n  A --> B[Siga fechar-pedido]\n```\n")
        write_skill(self.project, "fechar-pedido")
        self.assertIn("abrir_pedido -.-> fechar_pedido", graph.build(self.project, self.core))



class CoreOnlyProjectTest(unittest.TestCase):
    def test_should_skip_the_graph_in_a_project_that_links_its_skills_to_the_core(self) -> None:
        import os
        import subprocess

        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            (project / ".git").mkdir()
            (project / ".agents").mkdir()
            (project / ".agents" / "skills").symlink_to(HERE.parents[1] / "skills")
            result = subprocess.run(
                [sys.executable, str(HERE / "skill-graph.py"), "--check"],
                env={**os.environ, "HARNESS_ROOT": str(project)},
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
