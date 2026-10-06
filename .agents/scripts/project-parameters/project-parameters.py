#!/usr/bin/env python3
"""Read and validate the parameter block of a project's instructions file (ADR 0009).

The block is the first yaml code block after the heading HEADING. Skills read
it for their parameters, and the harness scripts read their settings from its
Global entry, or from its top level. A setting the project does not set comes
from the block of this harness, which holds the defaults.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml

HEADING = "## Parâmetros das habilidades"
SKILL_HEADING = "## Parâmetros de configuração"
INSTRUCTIONS = "AGENTS.md"
GLOBAL = "Global"
YAML_FENCE = re.compile(r"^```ya?ml\s*$")
INTEGER_SETTINGS = {"Palavras", "Linhas", "Tokens do catálogo", "Tokens do corpo"}
TEXT_SETTINGS = {
    "Organização",
    "Idioma do Gherkin",
    "Direção dos fluxogramas",
    "Ícone das páginas no Notion",
    "Cor do ícone das páginas no Notion",
    "Símbolo da pasta no macOS",
}
CHOICE_SETTINGS = {"Licença obrigatória": {"sim", "não"}}
# The version of the instructions file, which the Notion sync writes on its page.
VERSION_SETTING = "Versão das instruções do projeto"
VERSION = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
SCRIPT_SETTINGS = INTEGER_SETTINGS | TEXT_SETTINGS | set(CHOICE_SETTINGS) | {VERSION_SETTING}
# A script setting that is also a parameter of a skill reads that skill's entry first.
SETTING_SKILL = {
    "Palavras": "criar-habilidade",
    "Linhas": "criar-habilidade",
    "Tokens do catálogo": "criar-habilidade",
    "Tokens do corpo": "criar-habilidade",
}
FLOW_STYLE = re.compile(r'^\s*(?:-\s*)?(?:"[^"]*"|[^:"]+)?\s*:?\s*[{\[]')


def core_root() -> Path:
    return Path(__file__).resolve().parents[3]


def project_root(start: Path) -> Path:
    """The root of the git repository that contains start, or start itself."""
    for path in (start, *start.parents):
        if (path / ".git").exists():
            return path
    return start


def is_harness(root: Path) -> bool:
    """A harness has its own skills folder. A project that links it only uses the core skills."""
    skills = root / ".agents" / "skills"
    return skills.is_dir() and not skills.is_symlink()


def yaml_block(text: str, heading: str) -> tuple[object, int | None, str | None]:
    """(data, line of the opening fence, error) for the first yaml block after heading."""
    lines = text.splitlines()
    start = next((index for index, line in enumerate(lines) if line.strip() == heading), None)
    if start is None:
        return None, None, f'the heading "{heading}" is missing'
    fence = None
    for index in range(start + 1, len(lines)):
        if lines[index].startswith("## "):
            break
        if YAML_FENCE.match(lines[index].strip()):
            fence = index
            break
    if fence is None:
        return None, start + 1, f'"{heading}" has no yaml block'
    end = next((index for index in range(fence + 1, len(lines)) if lines[index].strip() == "```"), None)
    if end is None:
        return None, fence + 1, "the yaml block is not closed"
    try:
        data = yaml.safe_load("\n".join(lines[fence + 1 : end])) or {}
    except yaml.YAMLError as error:
        mark = getattr(error, "problem_mark", None)
        line = fence + 2 + mark.line if mark is not None else fence + 1
        return None, line, f"the yaml block does not parse: {getattr(error, 'problem', error)}"
    if not isinstance(data, dict):
        return None, fence + 1, "the yaml block must be a mapping"
    return data, fence + 1, None


def instructions_block(root: Path) -> dict:
    path = root / INSTRUCTIONS
    if not path.is_file():
        return {}
    data, _, error = yaml_block(path.read_text(encoding="utf-8"), HEADING)
    return data if error is None and isinstance(data, dict) else {}


def global_value(data: dict, key: str):
    entry = data.get(GLOBAL)
    if isinstance(entry, dict) and key in entry:
        return entry[key]
    if key in data and not isinstance(data[key], dict):
        return data[key]
    return None


def setting(roots: list[Path], key: str):
    """The value of a script setting: the first root that sets a valid value wins.

    In each root, the entry of the skill that shares the setting comes before Global.
    An invalid value is skipped here; the checker reports it.
    """
    for root in dict.fromkeys(roots):
        data = instructions_block(root)
        owner = data.get(SETTING_SKILL.get(key, ""))
        candidates = [owner.get(key) if isinstance(owner, dict) else None, global_value(data, key)]
        for value in candidates:
            if value is not None and setting_type_error(key, value) is None:
                return value
    raise SystemExit(f'"{key}" is missing from the parameter block of {INSTRUCTIONS}')


def instructions_version(text: str) -> tuple[int, int, int] | None:
    """The version set in the parameter block of an instructions text, if valid."""
    data, _, error = yaml_block(text, HEADING)
    if error is not None or not isinstance(data, dict):
        return None
    value = global_value(data, VERSION_SETTING)
    match = VERSION.fullmatch(value) if isinstance(value, str) else None
    return (int(match.group(1)), int(match.group(2)), int(match.group(3))) if match else None


def skill_parameter(roots: list[Path], skill: str, key: str, skill_file: Path | None = None):
    """The value a skill script should use for one of its parameters.

    In each root, the entry named after the skill comes first, then Global or the
    top level. Without a value there, the default from the skill's own block.
    """
    for root in dict.fromkeys(roots):
        data = instructions_block(root)
        entry = data.get(skill)
        if isinstance(entry, dict) and key in entry:
            return entry[key]
        value = global_value(data, key)
        if value is not None:
            return value
    if skill_file is not None and skill_file.is_file():
        defaults, _, error = yaml_block(skill_file.read_text(encoding="utf-8"), SKILL_HEADING)
        if error is None and isinstance(defaults, dict):
            return defaults.get(key)
    return None


def skill_parameter_keys(roots: list[Path]) -> dict[str, set[str]]:
    """The parameter keys of every skill in the given roots, by skill name."""
    keys: dict[str, set[str]] = {}
    for root in dict.fromkeys(roots):
        folder = root / ".agents" / "skills"
        if not folder.is_dir():
            continue
        for path in sorted(folder.glob("*/SKILL.md")):
            data, _, error = yaml_block(path.read_text(encoding="utf-8"), SKILL_HEADING)
            if error is None and isinstance(data, dict):
                keys.setdefault(path.parent.name, set()).update(str(key) for key in data)
    return keys


def key_line(text: str, key: str) -> int | None:
    pattern = re.compile(r'^\s*"?' + re.escape(key) + r'"?\s*:')
    for index, line in enumerate(text.splitlines(), 1):
        if pattern.match(line):
            return index
    return None


def setting_type_error(key: str, value) -> str | None:
    if key in INTEGER_SETTINGS and (not isinstance(value, int) or isinstance(value, bool) or value <= 0):
        return f'"{key}" must be a positive integer'
    if key in TEXT_SETTINGS and (not isinstance(value, str) or not value.strip()):
        return f'"{key}" must be a non-empty text'
    if key == VERSION_SETTING and (not isinstance(value, str) or VERSION.fullmatch(value) is None):
        return f'"{key}" must be a version such as "0.1.0", in quotes'
    if key in CHOICE_SETTINGS and value not in CHOICE_SETTINGS[key]:
        return f'"{key}" must be one of: ' + ", ".join(sorted(CHOICE_SETTINGS[key]))
    return None


def validate(text: str, skills: dict[str, set[str]], required: bool) -> list[tuple[str, int | None]]:
    """Problems of the parameter block, with their line."""
    data, line, error = yaml_block(text, HEADING)
    if error is not None:
        if not required and data is None and "is missing" in error:
            return []
        return [(error, line)]
    known = set().union(*skills.values()) if skills else set()
    errors: list[tuple[str, int | None]] = []
    lines = text.splitlines()
    end = next((index for index in range(line, len(lines)) if lines[index].strip() == "```"), len(lines))
    for index in range(line, end):
        if FLOW_STYLE.match(lines[index]):
            errors.append(("write the block in block style, not with { } or [ ]", index + 1))

    def check_global(key: str, value) -> None:
        if key not in known and key not in SCRIPT_SETTINGS:
            errors.append((f'"{key}" is not a parameter of any skill nor a script setting', key_line(text, key)))
            return
        if key in SCRIPT_SETTINGS:
            problem = setting_type_error(key, value)
            if problem:
                errors.append((problem, key_line(text, key)))

    for key, value in data.items():
        key = str(key)
        if key == GLOBAL:
            if not isinstance(value, dict):
                errors.append(('"Global" must be a mapping', key_line(text, key)))
                continue
            for inner, inner_value in value.items():
                check_global(str(inner), inner_value)
        elif isinstance(value, dict):
            if key not in skills:
                errors.append((f'"{key}" is not a skill here or in the core', key_line(text, key)))
                continue
            for inner, inner_value in value.items():
                if str(inner) not in skills[key]:
                    errors.append((f'"{inner}" is not a parameter of {key}', key_line(text, str(inner))))
                elif str(inner) in SCRIPT_SETTINGS:
                    problem = setting_type_error(str(inner), inner_value)
                    if problem:
                        errors.append((problem, key_line(text, str(inner))))
        else:
            check_global(key, value)
    return errors
