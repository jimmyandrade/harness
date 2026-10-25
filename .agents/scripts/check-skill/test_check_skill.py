"""Tests for the metadata.related rules of check-skill.py."""

from __future__ import annotations

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location(
    "project_parameters", HERE.parent / "project-parameters" / "project-parameters.py"
)
project_parameters = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(project_parameters)
INSTRUCTIONS = project_parameters.INSTRUCTIONS
PARAMETERS = '---\nmetadata:\n  parameters:\n    "Global":\n      "Organização": "example"\n---\n\n# Instruções\n'


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
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
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
            ["metadata.related names cancelar-pedido, which is not a skill here, in the core, or in a plugin"],
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


class PluginSkillsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        write_skill(self.project, "abrir-pedido")
        plugin = self.project / "node_modules" / "glossario"
        write_skill(plugin, "definir-termo", body='## Parâmetros de configuração\n\n```yaml\n"Categorias": {}\n```\n')
        (self.project / "node_modules" / "sem-skills").mkdir()
        self.checker = load_checker(self.project)

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def check_instructions(self, entry: str) -> subprocess.CompletedProcess:
        text = PARAMETERS.replace(
            "---\nmetadata:\n", '---\ndescription: Use essa habilidade sempre que for executar qualquer tarefa.\nmetadata:\n  version: "0.1.0"\n', 1
        ).replace("---\n\n", f"{entry}---\n\n", 1)
        (self.project / INSTRUCTIONS).write_text(text, encoding="utf-8")
        env = {**os.environ, "HARNESS_ROOT": str(self.project)}
        env.pop("GITHUB_STEP_SUMMARY", None)
        return subprocess.run(
            [sys.executable, str(HERE / "check-skill.py"), INSTRUCTIONS], env=env, capture_output=True, text=True
        )

    def test_the_plugins_are_the_packages_with_skills(self) -> None:
        self.assertEqual(self.checker.PLUGINS, [self.checker.ROOT / "node_modules" / "glossario"])

    def test_known_names_include_the_plugin_skills(self) -> None:
        self.assertIn("definir-termo", self.checker.known_skill_names())

    def test_the_instructions_accept_a_parameter_of_a_plugin_skill(self) -> None:
        result = self.check_instructions('    "definir-termo":\n      "Categorias": "x"\n')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_the_instructions_reject_a_key_the_plugin_skill_does_not_have(self) -> None:
        result = self.check_instructions('    "definir-termo":\n      "Cores": "x"\n')
        self.assertEqual(result.returncode, 1)
        self.assertIn('"Cores" is not a parameter of definir-termo', result.stdout + result.stderr)


def write_model(root: Path, name: str) -> None:
    folder = root / ".agents" / "assets" / "templates"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{name}.md").write_text("Meses nas colunas.\n", encoding="utf-8")


class ModelCitationTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
        write_model(self.project, "resumo-de-reuniao")
        self.checker = load_checker(self.project)
        self.known = self.checker.known_model_names()

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, models: list[str] | None, body: str) -> list[str]:
        lines = ["name: abrir-pedido", "description: x", "metadata:", '  version: "0.1.0"']
        if models is not None:
            lines.append("  models:")
            lines.extend(f"    - {item}" for item in models)
        block = "\n".join(lines)
        return [finding.message for finding in self.checker.models_errors(block, body, self.known)]

    def test_known_models_include_the_project_and_the_core(self) -> None:
        self.assertIn("resumo-de-reuniao", self.known)
        self.assertIn("dre-simplificada", self.known)

    def test_a_skill_without_models_is_not_checked(self) -> None:
        self.assertEqual(self.errors(None, "Leia .agents/assets/templates/resumo-de-reuniao.md quando for gerar a saída."), [])

    def test_a_listed_model_cited_by_name_passes(self) -> None:
        body = "Leia o modelo de saída `resumo-de-reuniao` quando for gerar a saída."
        self.assertEqual(self.errors(["resumo-de-reuniao"], body), [])

    def test_a_name_that_is_not_a_model_fails(self) -> None:
        self.assertEqual(
            self.errors(["ata"], ""),
            ["metadata.models names ata, which is not a model here or in the core"],
        )

    def test_a_cited_model_missing_from_the_list_fails(self) -> None:
        self.assertEqual(
            self.errors([], "Leia o modelo de saída `dre-simplificada` quando for gerar a saída."),
            ["the body cites the model dre-simplificada; add it to metadata.models"],
        )

    def test_a_path_fails_once_the_skill_lists_its_models(self) -> None:
        self.assertEqual(
            self.errors(["resumo-de-reuniao"], "Leia .agents/assets/templates/resumo-de-reuniao.md quando for gerar a saída."),
            ["cite the model by name: Leia o modelo de saída `resumo-de-reuniao` quando for gerar a saída."],
        )

    def test_a_list_written_as_text_fails(self) -> None:
        block = 'name: abrir-pedido\nmetadata:\n  version: "0.1.0"\n  models: resumo-de-reuniao'
        self.assertEqual(
            [finding.message for finding in self.checker.metadata_list_errors(block)],
            ["metadata.models must be a list"],
        )


class MetadataFlagTest(unittest.TestCase):
    def setUp(self) -> None:
        self.checker = load_checker(Path(tempfile.mkdtemp()))

    def errors(self, *lines: str) -> list[str]:
        block = "\n".join(["name: x", "metadata:", '  version: "0.1.0"', *lines])
        front = list(enumerate(block.splitlines(), start=2))
        return [finding.message for finding in self.checker.metadata_flag_errors(block, front)]

    def test_notion_and_internal_fail(self) -> None:
        self.assertEqual(
            self.errors('  notion: "false"', "  internal: true"),
            [
                "metadata.notion is not a field: every skill syncs to Notion",
                "metadata.internal is not a field: every skill syncs to Notion",
            ],
        )

    def test_a_skill_without_flags_passes(self) -> None:
        self.assertEqual(self.errors(), [])

    def test_a_quoted_internal_fails(self) -> None:
        self.assertEqual(
            self.errors('  internal: "true"'),
            ["metadata.internal is not a field: every skill syncs to Notion"],
        )

    def test_notion_true_fails(self) -> None:
        self.assertEqual(
            self.errors('  notion: "true"'),
            ["metadata.notion is not a field: every skill syncs to Notion"],
        )


class GherkinTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
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
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
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


class RemovedSkillSummaryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
        self.git("init", "-q")
        write_skill(self.project, "abrir-pedido", body="Abre o pedido.")
        write_skill(self.project, "fechar-pedido", body="Fecha o pedido.")
        self.base = self.commit("base")
        self.git("rm", "-q", "-r", ".agents/skills/fechar-pedido")
        self.head = self.commit("head")
        os.environ["CHECK_SKILL_BASE"] = self.base
        os.environ["CHECK_SKILL_HEAD"] = self.head
        self.checker = load_checker(self.project)
        import tiktoken

        self.encoding = tiktoken.get_encoding("o200k_base")

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

    def report(self) -> str:
        results = {"abrir-pedido": []}
        measures = {"abrir-pedido": ("0.1.0", 3)}
        return self.checker.summary_markdown(results, measures, 5000, self.encoding, only_changed=True)

    def test_a_removed_skill_gets_a_removed_row(self) -> None:
        row = next(line for line in self.report().splitlines() if "`fechar-pedido`" in line)
        self.assertIn("0.1.0 → —", row)
        self.assertIn("🗑️ removed", row)

    def test_an_unchanged_skill_stays_out_of_the_pull_request_report(self) -> None:
        self.assertNotIn("`abrir-pedido`", self.report())


class RenamedSkillSummaryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
        self.git("init", "-q")
        write_skill(self.project, "fechar-pedido", body="Fecha o pedido.")
        self.base = self.commit("base")
        self.git("mv", ".agents/skills/fechar-pedido", ".agents/skills/fechar-pedido-da-loja")
        skill = self.project / ".agents" / "skills" / "fechar-pedido-da-loja" / "SKILL.md"
        skill.write_text(
            "\n".join([
                "---", "name: fechar-pedido-da-loja", "description: x", "metadata:", "  author: example",
                '  version: "0.2.0"', "  aliases:", "    - fechar-pedido", "---", "", "Fecha o pedido.",
            ]) + "\n",
            encoding="utf-8",
        )
        self.head = self.commit("head")
        os.environ["HARNESS_ROOT"] = str(self.project)
        os.environ["CHECK_SKILL_BASE"] = self.base
        os.environ["CHECK_SKILL_HEAD"] = self.head
        self.checker = load_checker(self.project)
        import tiktoken

        self.encoding = tiktoken.get_encoding("o200k_base")

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

    def report(self) -> str:
        results = {"fechar-pedido-da-loja": []}
        measures = {"fechar-pedido-da-loja": ("0.2.0", 3)}
        return self.checker.summary_markdown(results, measures, 5000, self.encoding, only_changed=True)

    def test_a_renamed_skill_compares_with_its_previous_name(self) -> None:
        row = next(line for line in self.report().splitlines() if "`fechar-pedido-da-loja`" in line)
        self.assertIn("0.1.0 → 0.2.0", row)
        self.assertIn("renamed from `fechar-pedido`", row)

    def test_the_previous_name_gets_no_removed_row(self) -> None:
        self.assertNotIn("🗑️ removed", self.report())


class InstructionsVersionSummaryTest(unittest.TestCase):
    def setUp(self) -> None:
        # Without these, the cells carry no links, as outside GitHub Actions.
        self.github = {key: os.environ.pop(key) for key in ("GITHUB_SERVER_URL", "GITHUB_REPOSITORY") if key in os.environ}
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        self.git("init", "-q")

    def tearDown(self) -> None:
        self.tmp.cleanup()
        for key in ("HARNESS_ROOT", "CHECK_SKILL_BASE", "CHECK_SKILL_HEAD"):
            os.environ.pop(key, None)
        os.environ.update(self.github)

    def git(self, *args: str) -> str:
        return subprocess.run(
            ["git", "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
            cwd=self.project, check=True, capture_output=True, text=True,
        ).stdout.strip()

    def commit(self, message: str) -> str:
        self.git("add", "-A")
        self.git("commit", "-q", "-m", message)
        return self.git("rev-parse", "HEAD")

    def row(self, before: str, after: str) -> str:
        import tiktoken

        (self.project / INSTRUCTIONS).write_text(before, encoding="utf-8")
        base = self.commit("base")
        (self.project / INSTRUCTIONS).write_text(after, encoding="utf-8")
        head = self.commit("head")
        os.environ["CHECK_SKILL_BASE"] = base
        os.environ["CHECK_SKILL_HEAD"] = head
        checker = load_checker(self.project)
        encoding = tiktoken.get_encoding("o200k_base")
        measures = {INSTRUCTIONS: checker.body_measure(after, encoding)}
        report = checker.summary_markdown({INSTRUCTIONS: []}, measures, 5000, encoding, only_changed=True)
        return next(line for line in report.splitlines() if f"`{INSTRUCTIONS}`" in line)

    def test_the_instructions_row_shows_the_version_change(self) -> None:
        before = '---\nmetadata:\n  version: "0.9.0"\n---\n\n# Instruções\n'
        after = '---\nmetadata:\n  version: "0.9.1"\n---\n\n# Instruções\n'
        self.assertIn("0.9.0 → 0.9.1", self.row(before, after))

    def test_instructions_without_a_version_show_a_dash(self) -> None:
        self.assertIn("| — |", self.row("# Instruções\n", "# Instruções do projeto\n"))


class StagedBinaryTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name).resolve()
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
        self.git("init", "-q")
        self.git("commit", "-q", "--allow-empty", "-m", "base")

    def tearDown(self) -> None:
        self.tmp.cleanup()
        for key in ("HARNESS_ROOT", "CHECK_SKILL_BASE", "CHECK_SKILL_HEAD"):
            os.environ.pop(key, None)

    def git(self, *args: str) -> None:
        subprocess.run(
            ["git", "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
            cwd=self.project, check=True, capture_output=True,
        )

    def test_a_staged_binary_eval_input_does_not_crash_the_check(self) -> None:
        write_skill(self.project, "abrir-pedido")
        image = self.project / ".agents/skills/abrir-pedido/evals/files/print.webp"
        image.parent.mkdir(parents=True)
        image.write_bytes(b"RIFF\xa2\x00\x00\x00WEBPVP8 \xff\xfe\x80")
        self.git("add", "-A")
        checker = load_checker(self.project)
        self.assertEqual(checker.rename_alias_findings(), [])
        self.assertIsNotNone(checker.git_output(["git", "show", ":.agents/skills/abrir-pedido/evals/files/print.webp"]))


class InstructionsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents").mkdir()
        (self.project / INSTRUCTIONS).write_text(PARAMETERS, encoding="utf-8")
        self.checker = load_checker(self.project)
        import tiktoken

        self.encoding = tiktoken.get_encoding("o200k_base")

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, text: str, words: int = 5000, lines: int = 500, tokens: int = 5000) -> list[str]:
        return [finding.message for finding in self.checker.instructions_errors(text, self.encoding, words, lines, tokens)]

    def test_should_pass_small_instructions(self) -> None:
        self.assertEqual(self.errors("# AGENTS\n\nLeia CONTRIBUTING.md.\n"), [])

    def test_should_fail_instructions_over_the_body_token_limit(self) -> None:
        self.assertEqual(len(self.errors("palavra " * 100, tokens=50)), 1)

    def test_should_fail_instructions_over_the_line_limit(self) -> None:
        self.assertEqual(len(self.errors("x\n" * 20, lines=10)), 1)

    def test_should_measure_a_file_without_frontmatter_as_body(self) -> None:
        version, tokens = self.checker.body_measure("# AGENTS\n", self.encoding)
        self.assertIsNone(version)
        self.assertGreater(tokens, 0)

    def test_should_measure_the_whole_file_when_the_frontmatter_does_not_close(self) -> None:
        version, tokens = self.checker.body_measure("---\nname: x\n" + "palavra " * 100, self.encoding)
        self.assertIsNone(version)
        self.assertGreater(tokens, 50)

    def test_should_point_the_instructions_at_the_repository_root(self) -> None:
        self.assertEqual(self.checker.item_path(INSTRUCTIONS), INSTRUCTIONS)
        self.assertEqual(self.checker.item_path("criar-commit"), ".agents/skills/criar-commit/SKILL.md")



class InstructionsVersionTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents" / "skills").mkdir(parents=True)
        self.checker = load_checker(self.project)

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    @staticmethod
    def text(version: str, rule: str = "Uma regra.") -> str:
        return PARAMETERS.replace(
            "---\nmetadata:\n", f'---\ndescription: Use essa habilidade sempre que for executar qualquer tarefa.\nmetadata:\n  version: "{version}"\n', 1
        ).replace("# Instruções\n", f"# Instruções\n\n{rule}\n")

    def test_should_require_description_and_version_in_a_business_harness(self) -> None:
        self.assertEqual(
            [message for message, _ in self.checker.instructions_version_errors(PARAMETERS)],
            [
                "description is required in the frontmatter of a business harness",
                'metadata.version is required, as a quoted version such as "0.1.0"',
            ],
        )

    def test_should_require_a_higher_version_when_the_instructions_change(self) -> None:
        git = ["git", "-c", "user.email=t@example.com", "-c", "user.name=t"]
        subprocess.run(["git", "init", "-q"], cwd=self.project, check=True)
        (self.project / INSTRUCTIONS).write_text(self.text("0.5.0", "Regra antiga."), encoding="utf-8")
        subprocess.run(git + ["add", "."], cwd=self.project, check=True)
        subprocess.run(git + ["commit", "-q", "-m", "x"], cwd=self.project, check=True)
        self.assertEqual(
            [message for message, _ in self.checker.instructions_version_errors(self.text("0.5.0", "Regra nova."))],
            ["metadata.version must increase when the instructions change"],
        )
        self.assertEqual(self.checker.instructions_version_errors(self.text("0.6.0", "Regra nova.")), [])

    def test_should_require_only_the_version_outside_a_business_harness(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            (project / ".git").mkdir()
            checker = load_checker(project)
            self.assertEqual(
                [message for message, _ in checker.instructions_version_errors(PARAMETERS)],
                ['metadata.version is required, as a quoted version such as "0.1.0"'],
            )
        self.checker = load_checker(self.project)

    def test_should_accept_a_version_without_history(self) -> None:
        self.assertEqual(self.checker.instructions_version_errors(self.text("0.5.0")), [])

if __name__ == "__main__":
    unittest.main()


class OpportunityGroupTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents" / "mappings").mkdir(parents=True)
        self.checker = load_checker(self.project)
        self.roots = [self.project, self.checker.CORE]

    def tearDown(self) -> None:
        self.tmp.cleanup()
        os.environ.pop("HARNESS_ROOT", None)

    def errors(self, parameters: str, properties: dict | None) -> list[str]:
        text = f'---\nmetadata:\n  parameters:\n{parameters}---\n\n# Instruções\n'
        (self.project / INSTRUCTIONS).write_text(text, encoding="utf-8")
        mapping = self.project / ".agents" / "mappings" / "oportunidades.notion.json"
        if properties is not None:
            mapping.write_text(json.dumps({"properties": properties}), encoding="utf-8")
        return [message for message, _ in self.checker.opportunity_group_errors(text, self.roots)]

    def test_a_project_without_the_opportunity_mapping_passes(self) -> None:
        self.assertEqual(self.errors('    "Global":\n      "Organização": "example"\n', None), [])

    def test_the_default_sim_requires_the_group_in_the_mapping(self) -> None:
        errors = self.errors('    "Global":\n      "Organização": "example"\n', {"opportunity": "Nome"})
        self.assertEqual(len(errors), 1)
        self.assertIn("does not map group", errors[0])

    def test_a_mapped_group_passes(self) -> None:
        self.assertEqual(self.errors('    "Global":\n      "Organização": "example"\n', {"group": "Grupo"}), [])

    def test_nao_does_not_require_the_group(self) -> None:
        parameters = '    "Global":\n      "Considerar grupos de oportunidades": "não"\n'
        self.assertEqual(self.errors(parameters, {"opportunity": "Nome"}), [])

    def test_sim_under_one_skill_requires_the_group(self) -> None:
        parameters = (
            '    "Global":\n      "Considerar grupos de oportunidades": "não"\n'
            '    "criar-oportunidade":\n      "Considerar grupos de oportunidades": "sim"\n'
        )
        self.assertEqual(len(self.errors(parameters, {"opportunity": "Nome"})), 1)


class DescriptionOpeningTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.project = Path(self.tmp.name)
        (self.project / ".agents" / "skills" / "abrir-pedido").mkdir(parents=True)
        self.checker = load_checker(self.project)
        self.path = self.project / ".agents" / "skills" / "abrir-pedido" / "SKILL.md"

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def messages(self, description: str) -> list[str]:
        front = [(2, "name: abrir-pedido"), (3, f"description: {description}")]
        errors = self.checker.spec_errors(front, self.path, "abrir-pedido", description, False)
        return [error.message for error in errors if "description" in error.message]

    def test_should_accept_a_description_in_the_third_person(self) -> None:
        self.assertEqual(self.messages("Abre pedidos de compra. Usada quando chega um pedido novo. Não serve para pagar."), [])

    def test_should_still_accept_the_old_opening_until_every_skill_moves(self) -> None:
        self.assertEqual(self.messages("Use essa habilidade sempre que chegar um pedido. NÃO use para pagar."), [])
