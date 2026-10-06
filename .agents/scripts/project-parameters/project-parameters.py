#!/usr/bin/env python3
"""Read and validate the parameters of a project's instructions file (ADR 0009).

The parameters live in the frontmatter of that file, under metadata.parameters,
and its version under metadata.version. Skills read their parameters there, and
the harness scripts read their settings from its Global entry, or from its top
level. A setting the project does not set comes from the instructions file of
this harness, which holds the defaults.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml

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
VERSION = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
SCRIPT_SETTINGS = INTEGER_SETTINGS | TEXT_SETTINGS | set(CHOICE_SETTINGS)
# A script setting that is also a parameter of a skill reads that skill's entry first.
SETTING_SKILL = {
    "Palavras": "criar-habilidade",
    "Linhas": "criar-habilidade",
    "Tokens do catálogo": "criar-habilidade",
    "Tokens do corpo": "criar-habilidade",
}
# The Notion sync reads the frontmatter line by line, so the checker rejects what it cannot read.
BLOCK_SCALAR = re.compile(r':\s*[>|][+-]?\s*$')
QUOTED = re.compile(r'"[^"]*"|\'[^\']*\'')
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


def frontmatter(text: str) -> tuple[dict | None, int | None, str | None]:
    """(data, last line of the frontmatter, error) of a Markdown text."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, None, "the frontmatter is missing"
    end = next((index for index in range(1, len(lines)) if lines[index].strip() == "---"), None)
    if end is None:
        return None, 1, "the frontmatter is not closed"
    try:
        data = yaml.safe_load("\n".join(lines[1:end])) or {}
    except yaml.YAMLError as error:
        mark = getattr(error, "problem_mark", None)
        line = 2 + mark.line if mark is not None else 1
        return None, line, f"the frontmatter does not parse: {getattr(error, 'problem', error)}"
    if not isinstance(data, dict):
        return None, 1, "the frontmatter must be a mapping"
    return data, end + 1, None


def instructions_parameters(text: str) -> tuple[dict | None, int | None, str | None]:
    """(metadata.parameters, last frontmatter line, error) of an instructions text."""
    data, end, error = frontmatter(text)
    if error is not None:
        return None, end, error
    metadata = data.get("metadata")
    if metadata is None or not isinstance(metadata, dict) or "parameters" not in metadata:
        return None, end, "metadata.parameters is missing from the frontmatter"
    parameters = metadata["parameters"] or {}
    if not isinstance(parameters, dict):
        return None, end, "metadata.parameters must be a mapping"
    return parameters, end, None


def instructions_block(root: Path) -> dict:
    path = root / INSTRUCTIONS
    if not path.is_file():
        return {}
    data, _, error = instructions_parameters(path.read_text(encoding="utf-8"))
    return data if error is None and data is not None else {}


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
    raise SystemExit(f'"{key}" is missing from metadata.parameters of {INSTRUCTIONS}')


def instructions_version(text: str) -> tuple[int, int, int] | None:
    """metadata.version of an instructions text, if it is a valid version."""
    data, _, error = frontmatter(text)
    metadata = data.get("metadata") if error is None and data else None
    value = metadata.get("version") if isinstance(metadata, dict) else None
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
    if key in CHOICE_SETTINGS and value not in CHOICE_SETTINGS[key]:
        return f'"{key}" must be one of: ' + ", ".join(sorted(CHOICE_SETTINGS[key]))
    return None


def validate(text: str, skills: dict[str, set[str]], required: bool) -> list[tuple[str, int | None]]:
    """Problems of metadata.parameters in the frontmatter, with their line."""
    data, end, error = instructions_parameters(text)
    if error is not None:
        if not required and "is missing" in error:
            return []
        return [(error, end)]
    known = set().union(*skills.values()) if skills else set()
    errors: list[tuple[str, int | None]] = []
    lines = text.splitlines()
    for index in range(1, (end or 1) - 1):
        line = lines[index]
        if FLOW_STYLE.match(line):
            errors.append(("write the frontmatter in block style, not with { } or [ ]", index + 1))
        if BLOCK_SCALAR.search(line):
            errors.append(("write each frontmatter value on one line, not with > or |", index + 1))
        unquoted = QUOTED.sub("", line)
        if unquoted.lstrip().startswith("#") or " #" in unquoted:
            errors.append(("remove comments from the frontmatter", index + 1))

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
