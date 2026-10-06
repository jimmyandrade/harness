"""Tests for project-parameters.py."""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("project_parameters", HERE / "project-parameters.py")
parameters = importlib.util.module_from_spec(spec)
sys.modules["project_parameters"] = parameters
spec.loader.exec_module(parameters)

SKILLS = {"criar-commit": {"Idioma da mensagem de commit", "Comando de testes"}, "criar-habilidade": {"Tokens do corpo"}}


def block(yaml: str) -> str:
    indented = "".join(f"    {line}" if line.strip() else line for line in yaml.splitlines(keepends=True))
    return f"---\nmetadata:\n  parameters:\n{indented}---\n\n# Instruções\n"


class ValidateTest(unittest.TestCase):
    def errors(self, text: str, required: bool = True) -> list[str]:
        return [message for message, _ in parameters.validate(text, SKILLS, required)]

    def test_should_accept_global_and_skill_entries(self) -> None:
        text = block('"Global":\n  "Comando de testes": "npm test"\n  "Organização": "example"\n"criar-commit":\n  "Idioma da mensagem de commit": "inglês"\n')
        self.assertEqual(self.errors(text), [])

    def test_should_accept_a_flat_block(self) -> None:
        self.assertEqual(self.errors(block('"Comando de testes": "npm test"\n')), [])

    def test_should_require_the_heading_only_when_asked(self) -> None:
        self.assertEqual(len(self.errors("# Instruções\n")), 1)
        self.assertEqual(self.errors("# Instruções\n", required=False), [])

    def test_should_report_yaml_that_does_not_parse_with_its_line(self) -> None:
        found = parameters.validate(block('"Global":\n  "Comando de testes": "npm test\n'), SKILLS, True)
        self.assertEqual(len(found), 1)
        self.assertIn("does not parse", found[0][0])
        self.assertIsNotNone(found[0][1])

    def test_should_reject_a_misspelled_key(self) -> None:
        self.assertEqual(
            self.errors(block('"Global":\n  "Tokens de corpo": 5000\n')),
            ['"Tokens de corpo" is not a parameter of any skill nor a script setting'],
        )

    def test_should_reject_an_entry_that_is_not_a_skill(self) -> None:
        self.assertEqual(self.errors(block('"abrir-pedido":\n  "Comando de testes": "x"\n')), ['"abrir-pedido" is not a skill here or in the core'])

    def test_should_reject_a_key_of_another_skill_under_a_skill(self) -> None:
        self.assertEqual(
            self.errors(block('"criar-habilidade":\n  "Comando de testes": "x"\n')),
            ['"Comando de testes" is not a parameter of criar-habilidade'],
        )

    def test_should_check_the_type_of_script_settings(self) -> None:
        self.assertEqual(self.errors(block('"Global":\n  "Tokens do corpo": "muitos"\n')), ['"Tokens do corpo" must be a positive integer'])
        self.assertEqual(self.errors(block('"Global":\n  "Licença obrigatória": "talvez"\n')), ['"Licença obrigatória" must be one of: não, sim'])


    def test_should_reject_flow_style(self) -> None:
        self.assertEqual(
            self.errors(block('"Global": {"Organização": "x"}\n')),
            ["write the frontmatter in block style, not with { } or [ ]"],
        )

    def test_should_check_the_type_of_a_script_setting_under_its_skill(self) -> None:
        self.assertEqual(
            self.errors(block('"criar-habilidade":\n  "Tokens do corpo": "muitos"\n')),
            ['"Tokens do corpo" must be a positive integer'],
        )


    def test_should_read_the_instructions_version_from_metadata(self) -> None:
        text = block('"Global":\n  "Organização": "x"\n').replace("metadata:\n", 'metadata:\n  version: "0.5.0"\n', 1)
        self.assertEqual(parameters.instructions_version(text), (0, 5, 0))
        self.assertIsNone(parameters.instructions_version(text.replace('"0.5.0"', "5")))
        self.assertIsNone(parameters.instructions_version(block('"Global":\n  "Organização": "x"\n')))


class SettingTest(unittest.TestCase):
    def test_should_read_the_project_first_and_fall_back_to_the_next_root(self) -> None:
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            Path(first, parameters.INSTRUCTIONS).write_text(block('"Global":\n  "Tokens do corpo": 1000\n'), encoding="utf-8")
            Path(second, parameters.INSTRUCTIONS).write_text(block('"Global":\n  "Tokens do corpo": 5000\n  "Linhas": 500\n'), encoding="utf-8")
            roots = [Path(first), Path(second)]
            self.assertEqual(parameters.setting(roots, "Tokens do corpo"), 1000)
            self.assertEqual(parameters.setting(roots, "Linhas"), 500)

    def test_should_read_the_entry_of_the_skill_that_shares_the_setting_first(self) -> None:
        with tempfile.TemporaryDirectory() as root:
            Path(root, parameters.INSTRUCTIONS).write_text(
                block('"Global":\n  "Tokens do corpo": 5000\n"criar-habilidade":\n  "Tokens do corpo": 3000\n'), encoding="utf-8"
            )
            self.assertEqual(parameters.setting([Path(root)], "Tokens do corpo"), 3000)

    def test_should_skip_an_invalid_value_and_fall_back(self) -> None:
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            Path(first, parameters.INSTRUCTIONS).write_text(block('"Global":\n  "Tokens do corpo": "muitos"\n'), encoding="utf-8")
            Path(second, parameters.INSTRUCTIONS).write_text(block('"Global":\n  "Tokens do corpo": 5000\n'), encoding="utf-8")
            self.assertEqual(parameters.setting([Path(first), Path(second)], "Tokens do corpo"), 5000)

    def test_should_read_a_skill_parameter_from_its_entry_then_global_then_its_default(self) -> None:
        with tempfile.TemporaryDirectory() as root:
            skill = Path(root, "SKILL.md")
            skill.write_text(
                f'{parameters.SKILL_HEADING}\n\n```yaml\n"Idiomas":\n  - "pt-BR"\n"Modo": "a"\n"Outro": "x"\n```\n', encoding="utf-8"
            )
            Path(root, parameters.INSTRUCTIONS).write_text(
                block('"Global":\n  "Modo": "b"\n"ler-imagem":\n  "Idiomas":\n    - "en-US"\n'), encoding="utf-8"
            )
            roots = [Path(root)]
            self.assertEqual(parameters.skill_parameter(roots, "ler-imagem", "Idiomas", skill), ["en-US"])
            self.assertEqual(parameters.skill_parameter(roots, "ler-imagem", "Modo", skill), "b")
            self.assertEqual(parameters.skill_parameter(roots, "ler-imagem", "Outro", skill), "x")
            self.assertIsNone(parameters.skill_parameter(roots, "ler-imagem", "Ausente", skill))

    def test_should_ignore_a_key_under_a_skill_entry(self) -> None:
        self.assertIsNone(parameters.global_value({"criar-commit": {"Organização": "x"}}, "Organização"))

    def test_should_treat_a_linked_skills_folder_as_a_project_that_only_uses_the_core(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "core-skills").mkdir()
            (root / ".agents").mkdir()
            (root / ".agents" / "skills").symlink_to(root / "core-skills")
            self.assertFalse(parameters.is_harness(root))


if __name__ == "__main__":
    unittest.main()
