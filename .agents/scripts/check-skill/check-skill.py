#!/usr/bin/env python3
"""Fail when a SKILL.md or the project instructions file breaks a harness rule or passes a limit.

A skill that lists metadata.related names only skills that exist in the project
or in this harness, and lists every skill its body cites.

The project is HARNESS_ROOT, or the working directory when it is unset.
Settings come from metadata.parameters in the frontmatter of the project instructions file, then of this harness (ADR 0009).
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import yaml

HEADING = re.compile(r"^(#{1,6})[ \t]+(.+?)\s*$")
STEP = re.compile(r"^Passo ([1-9]\d*)$")
FRONTMATTER_FIELD = re.compile(r"^([A-Za-z0-9-]+):(.*)$")
ASCII_NAME = re.compile(r"^[a-z0-9-]+$")
NOTION_URL = re.compile(r"notion\.(?:so|com)|collection://|view://", re.IGNORECASE)
SKILL_NAMES = {"SKILL.md", "skill.md"}
EXAMPLE_NOTICE = "Estes exemplos ilustram fatos. Eles podem não estar no data source."
FLOWCHART = re.compile(
    r"^(?:flowchart|graph)(?:[ \t]+([A-Za-z]{2}))?(?:[ \t]|$)",
    re.IGNORECASE,
)
FLOWCHART_DIRECTIONS = {"LR", "RL", "TD", "TB", "BT"}
SKILL_PATH = re.compile(r"^\.agents/skills/([^/]+)/(?:SKILL|skill)\.md$")
ALLOWED_FIELDS = {
    "name",
    "description",
    "license",
    "allowed-tools",
    "metadata",
    "compatibility",
}
SEMVER = re.compile(
    r"^\"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"
    r"(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)"
    r"(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?"
    r"(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?\"$"
)


def load_parameters():
    path = Path(__file__).resolve().parents[1] / "project-parameters" / "project-parameters.py"
    spec = importlib.util.spec_from_file_location("project_parameters", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


parameters = load_parameters()
ROOT = parameters.project_root(Path(os.environ.get("HARNESS_ROOT") or Path.cwd()).resolve())
CORE = parameters.core_root()
# A project that links its skills to the core only uses the core skills, so only
# its instructions are checked.
IS_HARNESS = parameters.is_harness(ROOT)


@dataclass(frozen=True)
class Finding:
    message: str
    line: int | None = None
    file: str | None = None


def skill_sections(text: str) -> tuple[list[tuple[int, str]], list[tuple[int, str]]]:
    lines = text.splitlines()
    marks = [index for index, line in enumerate(lines) if line.strip() == "---"]
    if len(marks) < 2:
        return [], []
    start, end = marks[0], marks[1]
    front = [(index + 1, lines[index]) for index in range(start + 1, end)]
    body = [(index + 1, lines[index]) for index in range(end + 1, len(lines))]
    return front, body


def skill_key(relative: Path) -> str:
    parts = relative.parts
    if "skills" in parts:
        index = parts.index("skills")
        if index + 1 < len(parts):
            return parts[index + 1]
    return relative.as_posix()


def workflow_escape(value: str, *, prop: bool) -> str:
    value = value.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    if prop:
        value = value.replace(":", "%3A").replace(",", "%2C")
    return value


def report(relative: Path, finding: Finding) -> None:
    target = Path(finding.file) if finding.file else relative
    where = f"{target}:{finding.line}" if finding.line else str(target)
    print(f"{where}: {finding.message}", file=sys.stderr)
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return
    props = [f"file={workflow_escape(target.as_posix(), prop=True)}"]
    if finding.line is not None:
        props.append(f"line={finding.line}")
    message = workflow_escape(finding.message, prop=False)
    print(f"::error {','.join(props)}::{message}")


def skill_measure(text: str, encoding) -> tuple[str | None, int | None]:
    if not text.startswith("---\n"):
        return None, None
    end = text.find("\n---", 4)
    if end == -1:
        return None, None
    version = None
    in_metadata = False
    for raw in text[4:end].splitlines():
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            continue
        if in_metadata and raw.strip().startswith("version:"):
            version = raw.strip().split(":", 1)[1].strip().strip('"') or None
            break
    body_tokens = len(encoding.encode(text[end + 4 :]))
    return version, body_tokens


INSTRUCTIONS = parameters.INSTRUCTIONS


def item_path(name: str) -> str:
    """Repository path of a checked item: a skill name, or the project instructions."""
    return INSTRUCTIONS if name == INSTRUCTIONS else f".agents/skills/{name}/SKILL.md"


def body_measure(text: str, encoding) -> tuple[str | None, int | None]:
    """Version and body tokens of a skill, or of a file without frontmatter."""
    if text.startswith("---\n"):
        version, tokens = skill_measure(text, encoding)
        if tokens is not None:
            return version, tokens
    return None, len(encoding.encode(text))


def changed_skill_names() -> set[str] | None:
    base = os.environ.get("CHECK_SKILL_BASE", "")
    head = os.environ.get("CHECK_SKILL_HEAD", "")
    if base or head:
        if not base or not head or set(base) <= {"0"}:
            return None
        raw = git_output(
            ["git", "diff", "--name-only", base, head, "--", ".agents/skills", INSTRUCTIONS]
        )
    else:
        chunks: list[str] = []
        for args in (
            ["git", "diff", "--name-only", "--", ".agents/skills", INSTRUCTIONS],
            ["git", "diff", "--cached", "--name-only", "--", ".agents/skills", INSTRUCTIONS],
        ):
            raw = git_output(args)
            if raw is None:
                return None
            chunks.append(raw)
        raw = "\n".join(chunks)
    if raw is None:
        return None
    return {
        skill_key(Path(line.strip()))
        for line in raw.splitlines()
        if line.strip()
    }


SUMMARY_GROUP = {"new": 0, "changed": 1, "unchanged": 2}


def summary_order(kind: str | None, body_tokens: int | None, name: str) -> tuple[int, int, str]:
    group = 0 if kind is None else SUMMARY_GROUP[kind]
    tokens = body_tokens if body_tokens is not None else -1
    return (group, -tokens, name)


def result_label(passed: bool, kind: str | None) -> str:
    if kind is None:
        return "✅ passing" if passed else "❌ failing"
    if kind == "new":
        return "✅ passing, new" if passed else "❌ failing, new"
    if kind == "changed":
        return "✅ passing, changed" if passed else "❌ failing, changed"
    return "⚪ passing" if passed else "⚠️ failing, unchanged"


def limit_share(body_tokens: int | None, body_limit: int) -> str:
    if body_tokens is None or body_limit <= 0:
        return "unavailable"
    return f"{body_tokens * 100 / body_limit:.1f}%"


def share_number(body_tokens: int | None, body_limit: int) -> float | None:
    if body_tokens is None or body_limit <= 0:
        return None
    return body_tokens * 100 / body_limit


def signed_number(value: int) -> str:
    if value > 0:
        return f"+{value}"
    return str(value)


def signed_share(value: float) -> str:
    if value > 0:
        return f"+{value:.1f}"
    return f"{value:.1f}"


def summary_base() -> str | None:
    base = os.environ.get("CHECK_SKILL_BASE", "")
    head = os.environ.get("CHECK_SKILL_HEAD", "")
    if not base or not head or set(base) <= {"0"}:
        return None
    return base


def summary_head() -> str:
    return os.environ.get("CHECK_SKILL_HEAD", "") or os.environ.get("GITHUB_SHA", "")


def github_base_url() -> str | None:
    server = os.environ.get("GITHUB_SERVER_URL", "").rstrip("/")
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if not server or not repository:
        return None
    return f"{server}/{repository}"


def skill_file_url(name: str, head: str) -> str | None:
    root = github_base_url()
    if root is None or not head:
        return None
    return f"{root}/blob/{head}/{item_path(name)}"


def skill_diff_url(name: str, base: str, head: str) -> str | None:
    root = github_base_url()
    if root is None or not base or not head:
        return None
    path = item_path(name)
    digest = hashlib.sha256(path.encode()).hexdigest()
    return f"{root}/compare/{base}...{head}#diff-{digest}"


def markdown_link(label: str, url: str | None) -> str:
    if not url:
        return label
    return f"[{label}]({url})"


def previous_measure(
    name: str, base: str | None, encoding
) -> tuple[str | None, int | None] | None:
    if base is None:
        return None
    text = revision_text(base, item_path(name))
    if text is None:
        return None
    return body_measure(text, encoding)


def pair_text(before: str | None, after: str | None, *, compared: bool) -> str:
    current = after if after else "unavailable"
    if not compared:
        return current
    previous = before if before else "—"
    return f"{previous} → {current}"


def write_summary(
    results: dict[str, list[tuple[Path, Finding]]],
    measures: dict[str, tuple[str | None, int | None]],
    body_limit: int,
    encoding,
) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with Path(path).open("a", encoding="utf-8") as summary:
            summary.write(summary_markdown(results, measures, body_limit, encoding))
    report = os.environ.get("CHECK_SKILL_REPORT")
    if report:
        text = summary_markdown(results, measures, body_limit, encoding, only_changed=True)
        if text:
            Path(report).write_text(text, encoding="utf-8")


def summary_markdown(
    results: dict[str, list[tuple[Path, Finding]]],
    measures: dict[str, tuple[str | None, int | None]],
    body_limit: int,
    encoding,
    only_changed: bool = False,
) -> str:
    """The skill check table. With only_changed, only new, changed, or failing skills, and "" when none."""
    changed = changed_skill_names()
    base = summary_base()
    head = summary_head()
    ranked: list[tuple[tuple[int, int, str], str]] = []
    finding_lines: list[str] = []
    for name, items in results.items():
        version, body_tokens = measures.get(name, (None, None))
        earlier = previous_measure(name, base, encoding)
        compared = base is not None
        old_version = earlier[0] if earlier else None
        old_tokens = earlier[1] if earlier else None
        if changed is None:
            kind = None
        elif name in changed and earlier is None:
            kind = "new"
        elif name in changed:
            kind = "changed"
        else:
            kind = "unchanged"
        if only_changed and kind not in {"new", "changed"} and not items:
            continue
        label = result_label(not items, kind)
        version_text = "—" if name == INSTRUCTIONS else pair_text(old_version, version, compared=compared)
        token_text = pair_text(
            str(old_tokens) if old_tokens is not None else None,
            str(body_tokens) if body_tokens is not None else None,
            compared=compared,
        )
        share_text = pair_text(
            limit_share(old_tokens, body_limit) if old_tokens is not None else None,
            limit_share(body_tokens, body_limit) if body_tokens is not None else None,
            compared=compared,
        )
        if compared and body_tokens is not None and (old_tokens is not None or kind == "new"):
            baseline = old_tokens or 0
            token_delta = signed_number(body_tokens - baseline)
        else:
            token_delta = "—"
        current_share = share_number(body_tokens, body_limit)
        old_share = share_number(old_tokens, body_limit)
        if compared and current_share is not None and (old_share is not None or kind == "new"):
            share_delta = signed_share(current_share - (old_share or 0))
        else:
            share_delta = "—"
        file_url = skill_file_url(name, head)
        version_url = (
            skill_diff_url(name, base, head)
            if compared and base and kind in {"new", "changed"}
            else None
        )
        ranked.append(
            (
                summary_order(kind, body_tokens, name),
                f"| {markdown_link(f'`{name}`', file_url)} | {markdown_link(version_text, version_url)} | {token_text} | {share_text} | {token_delta} | {share_delta} | {label} |",
            )
        )
        if items:
            finding_lines.append(f"- {markdown_link(f'`{name}`', file_url)}")
            for target, finding in items:
                where = f"{target}:{finding.line}" if finding.line else str(target)
                finding_lines.append(f"  - `{where}` {finding.message}")
    if only_changed and not ranked:
        return ""
    lines = [
        "## Skill check",
        "",
        "| Skill | Version | Body tokens | % of limit | Δ tokens | Δ % | Result |",
        "| --- | --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for _order, row in sorted(ranked, key=lambda item: item[0]):
        lines.append(row)
    lines.append("")
    if finding_lines:
        lines.append("### Findings")
        lines.append("")
        lines.extend(finding_lines)
        lines.append("")
    return "\n".join(lines) + "\n"


def frontmatter(text: str, path: Path) -> str:
    if not text.startswith("---\n"):
        raise SystemExit(f"{path}: missing frontmatter")
    end = text.find("\n---", 4)
    if end == -1:
        raise SystemExit(f"{path}: missing frontmatter")
    return text[4:end]


def catalog_fields(block: str, path: Path) -> tuple[str, str]:
    name = description = None
    for raw in block.splitlines():
        if raw.startswith("name:"):
            name = raw.split(":", 1)[1].strip()
        elif raw.startswith("description:"):
            description = raw.split(":", 1)[1].strip()
    if name is None or description is None:
        raise SystemExit(f"{path}: name and description are required")
    return name, description


def metadata_fields(block: str, path: Path) -> tuple[str, str]:
    in_metadata = False
    author = version = None
    for raw in block.splitlines():
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            continue
        if not in_metadata:
            continue
        stripped = raw.strip()
        if stripped.startswith("author:"):
            author = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("version:"):
            version = stripped.split(":", 1)[1].strip()
    if author is None or version is None:
        raise SystemExit(f"{path}: metadata.author and metadata.version are required")
    return author, version


def notion_url_errors(lines: list[str]) -> list[Finding]:
    errors: list[Finding] = []
    for lineno, raw in enumerate(lines, start=1):
        if NOTION_URL.search(raw):
            errors.append(Finding("skill must not embed a Notion URL", lineno))
    return errors


def metadata_list_errors(block: str) -> list[Finding]:
    errors: list[Finding] = []
    in_metadata = False
    list_key: str | None = None
    for index, raw in enumerate(block.splitlines()):
        lineno = index + 2
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            list_key = None
            continue
        if not in_metadata or not raw.strip():
            continue
        if re.match(r"^\s+-\s+", raw):
            item = re.sub(r"^\s+-\s+", "", raw).strip()
            if list_key is None:
                errors.append(Finding("metadata list item has no key", lineno))
            elif not item:
                errors.append(Finding(f"metadata.{list_key} has an empty item", lineno))
            continue
        stripped = raw.strip()
        if ":" not in stripped:
            errors.append(Finding(f"invalid metadata line: {stripped}", lineno))
            list_key = None
            continue
        key, value = stripped.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key in {"aliases", "tags", "related"}:
            if value:
                errors.append(Finding(f"metadata.{key} must be a list", lineno))
                list_key = None
            else:
                list_key = key
            continue
        list_key = None
    return errors


def metadata_list(block: str, wanted: str) -> tuple[list[str], int] | None:
    in_metadata = False
    items: list[str] | None = None
    line = 0
    for index, raw in enumerate(block.splitlines()):
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            if items is not None:
                break
            continue
        if not in_metadata or not raw.strip():
            continue
        if re.match(r"^\s+-\s+", raw):
            if items is not None:
                items.append(re.sub(r"^\s+-\s+", "", raw).strip().strip('"'))
            continue
        if items is not None:
            break
        key = raw.strip().split(":", 1)[0].strip()
        if key == wanted:
            items = []
            line = index + 2
    return None if items is None else (items, line)


def known_skill_names() -> set[str]:
    names: set[str] = set()
    for root in dict.fromkeys([ROOT, CORE]):
        names.update(path.parent.name for path in skill_files(root))
    return names


MERMAID_BLOCK = re.compile(r"^```mermaid[^\n]*\n(.*?)^```", re.M | re.S)
BACKTICKED = re.compile(r"`([a-z0-9][a-z0-9-]*)`")


def cited_names(body: str, candidates: set[str]) -> set[str]:
    """Skill names cited in a body: between backticks in prose, or as a name in a Mermaid diagram."""
    found = set(BACKTICKED.findall(MERMAID_BLOCK.sub("", body))) & candidates
    for block in MERMAID_BLOCK.findall(body):
        found.update(
            name
            for name in candidates
            if re.search(r"(?<![a-z0-9-])" + re.escape(name) + r"(?![a-z0-9-])", block)
        )
    return found


def mentioned_skills(body: str, name: str, known: set[str]) -> set[str]:
    return cited_names(body, known) - {name}


def related_errors(block: str, body: str, name: str, known: set[str]) -> list[Finding]:
    declared = metadata_list(block, "related")
    if declared is None:
        return []
    related, line = declared
    errors: list[Finding] = []
    seen: set[str] = set()
    for item in related:
        if item in seen:
            errors.append(Finding(f"metadata.related repeats {item}", line))
        seen.add(item)
        if item == name:
            errors.append(Finding("metadata.related must not name the skill itself", line))
        elif item not in known:
            errors.append(
                Finding(f"metadata.related names {item}, which is not a skill here or in the core", line)
            )
    for other in sorted(mentioned_skills(body, name, known) - seen):
        errors.append(Finding(f"the body cites {other}; add it to metadata.related", line))
    return errors


def metadata_notion(block: str) -> str | None:
    in_metadata = False
    for raw in block.splitlines():
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            continue
        if not in_metadata:
            continue
        stripped = raw.strip()
        if stripped.startswith("notion:"):
            return stripped.split(":", 1)[1].strip()
    return None


def spec_errors(
    front: list[tuple[int, str]],
    path: Path,
    name: str,
    description: str,
    license_required: bool,
) -> list[Finding]:
    errors: list[Finding] = []
    keys: list[tuple[int, str]] = []
    values: dict[str, str] = {}
    for lineno, raw in front:
        if not raw.strip() or raw.startswith(" ") or raw.startswith("\t"):
            continue
        match = FRONTMATTER_FIELD.match(raw)
        if match is None:
            errors.append(Finding(f"invalid frontmatter line: {raw}", lineno))
            continue
        key, value = match.group(1), match.group(2).strip()
        keys.append((lineno, key))
        values[key] = value

    def line_of(key: str) -> int | None:
        for lineno, found in keys:
            if found == key:
                return lineno
        return None

    unexpected = sorted({key for _, key in keys} - ALLOWED_FIELDS)
    if unexpected:
        errors.append(
            Finding(
                "unexpected frontmatter fields: " + ", ".join(unexpected),
                line_of(unexpected[0]),
            )
        )
    name_line = line_of("name")
    normalized = unicodedata.normalize("NFKC", name.strip())
    if not normalized:
        errors.append(Finding("name must be a non-empty string", name_line))
    else:
        if len(normalized) > 64:
            errors.append(
                Finding(f"name exceeds 64 characters ({len(normalized)})", name_line)
            )
        if normalized != normalized.lower() or ASCII_NAME.fullmatch(normalized) is None:
            errors.append(Finding("name must be ASCII kebab-case", name_line))
        if normalized.startswith("-") or normalized.endswith("-"):
            errors.append(Finding("name cannot start or end with a hyphen", name_line))
        if "--" in normalized:
            errors.append(Finding("name cannot contain consecutive hyphens", name_line))
        directory = unicodedata.normalize("NFKC", path.parent.name)
        if directory != normalized:
            errors.append(
                Finding(
                    f"directory name {directory} must match skill name {normalized}",
                    name_line,
                )
            )
    description_line = line_of("description")
    if not description.strip():
        errors.append(Finding("description must be a non-empty string", description_line))
    elif not description.startswith("Use essa habilidade sempre que"):
        errors.append(
            Finding(
                'description must start with "Use essa habilidade sempre que"',
                description_line,
            )
        )
    elif len(description) > 1024:
        errors.append(
            Finding(
                f"description exceeds 1024 characters ({len(description)})",
                description_line,
            )
        )
    if "compatibility" in values:
        compatibility = values["compatibility"]
        if not 1 <= len(compatibility) <= 500:
            errors.append(
                Finding(
                    f"compatibility must be 1-500 characters ({len(compatibility)})",
                    line_of("compatibility"),
                )
            )
    if "metadata" in values and values["metadata"]:
        errors.append(Finding("metadata must be a mapping", line_of("metadata")))
    if license_required and not values.get("license"):
        errors.append(Finding("license is required", line_of("metadata")))
    if not license_required and "license" in values:
        errors.append(Finding("license is disabled", line_of("license")))
    if "allowed-tools" in values and not values["allowed-tools"]:
        errors.append(
            Finding("allowed-tools must be a non-empty string", line_of("allowed-tools"))
        )
    return errors


def instruction_errors(body: list[tuple[int, str]], name: str) -> list[Finding]:
    in_fence = False
    h2s: list[tuple[int, str]] = []
    steps: list[tuple[int, str]] = []
    issues: list[tuple[str, int, list[tuple[int, str]]]] = []
    issue_title = ""
    issue_line = 0
    issue_lines: list[tuple[int, str]] | None = None
    saw_gotchas = False
    in_gotchas = False
    current_h2 = ""
    for lineno, raw in body:
        if raw.startswith("```"):
            in_fence = not in_fence
            if issue_lines is not None:
                issue_lines.append((lineno, raw))
            continue
        if in_fence:
            if issue_lines is not None:
                issue_lines.append((lineno, raw))
            continue
        match = HEADING.match(raw)
        if match is not None:
            level = len(match.group(1))
            title = match.group(2).strip()
            if level == 2:
                if issue_lines is not None:
                    issues.append((issue_title, issue_line, issue_lines))
                    issue_lines = None
                h2s.append((lineno, title))
                current_h2 = title
                in_gotchas = title == "Pegadinhas"
            elif in_gotchas and level == 3:
                saw_gotchas = True
            elif level == 3 and current_h2 == "Instruções":
                steps.append((lineno, title))
            elif level == 3 and current_h2 == "Problemas comuns":
                if issue_lines is not None:
                    issues.append((issue_title, issue_line, issue_lines))
                issue_title = title
                issue_line = lineno
                issue_lines = []
            continue
        if in_gotchas and raw.strip():
            saw_gotchas = True
        if issue_lines is not None:
            issue_lines.append((lineno, raw))
    if issue_lines is not None:
        issues.append((issue_title, issue_line, issue_lines))
    errors: list[Finding] = []
    expected_h2 = [
        "Parâmetros de configuração",
        "Instruções",
        "Problemas comuns",
        "Exemplos de entrada e saída",
        "Casos-limite",
    ]
    expected_h2.append("Pegadinhas")
    expected_h2.append("Scripts disponíveis")
    for index, title in enumerate(expected_h2):
        if index >= len(h2s) or h2s[index][1] != title:
            line = h2s[index][0] if index < len(h2s) else (h2s[-1][0] if h2s else None)
            errors.append(Finding(f"level-2 heading {index + 1} must be {title}", line))
    expected = 1
    if not steps:
        line = next((line for line, title in h2s if title == "Instruções"), None)
        if line is None and h2s:
            line = h2s[0][0]
        errors.append(Finding("level-3 headings must be Passo 1, Passo 2, ...", line))
    for lineno, title in steps:
        match = STEP.fullmatch(title)
        if match is None or int(match.group(1)) != expected:
            errors.append(Finding(f"level-3 heading must be Passo {expected}", lineno))
            break
        expected += 1
    if not issues:
        line = next((line for line, title in h2s if title == "Problemas comuns"), None)
        if line is None and h2s:
            line = h2s[-1][0]
        errors.append(
            Finding(
                "Problemas comuns must contain a level-3 heading for each issue",
                line,
            )
        )
    for title, heading, lines in issues:
        errors.extend(issue_errors(title, heading, lines))
    gotchas = next((line for line, title in h2s if title == "Pegadinhas"), None)
    if gotchas is not None and not saw_gotchas:
        errors.append(Finding("Pegadinhas must contain a concrete correction", gotchas))
    errors.extend(example_errors(body, name))
    errors.extend(parameter_errors(body))
    return errors


def parameter_errors(body: list[tuple[int, str]]) -> list[Finding]:
    start = next(
        (
            index
            for index, (_, raw) in enumerate(body)
            if raw.strip() == "## Parâmetros de configuração"
        ),
        None,
    )
    if start is None:
        return []
    end = next(
        (
            index
            for index, (_, raw) in enumerate(body[start + 1 :], start + 1)
            if raw.startswith("## ")
        ),
        len(body),
    )
    section = body[start + 1 : end]
    fences: list[tuple[int, str]] = []
    in_fence = False
    buf: list[str] = []
    fence_line = 0
    for lineno, raw in section:
        if not raw.startswith("```"):
            if in_fence:
                buf.append(raw)
            continue
        if not in_fence:
            if raw[3:].strip() != "yaml":
                return [Finding("Parâmetros de configuração must open a yaml block", lineno)]
            in_fence = True
            fence_line = lineno
            buf = []
            continue
        in_fence = False
        fences.append((fence_line, "\n".join(buf)))
    line = section[0][0] if section else body[start][0]
    if in_fence:
        return [Finding("Parâmetros de configuração yaml block is unclosed", fence_line)]
    if len(fences) != 1:
        return [Finding("Parâmetros de configuração must contain one yaml block", line)]
    fence_line, text = fences[0]
    try:
        loaded = yaml.safe_load(text)
    except yaml.YAMLError:
        return [Finding("Parâmetros de configuração yaml block must parse", fence_line)]
    if not isinstance(loaded, dict):
        return [Finding("Parâmetros de configuração yaml block must be a mapping", fence_line)]
    return []


def example_errors(body: list[tuple[int, str]], name: str) -> list[Finding]:
    start = next(
        (index for index, (_, raw) in enumerate(body) if raw.strip() == "## Exemplos de entrada e saída"),
        None,
    )
    if start is None:
        return []
    end = next(
        (
            index
            for index, (_, raw) in enumerate(body[start + 1 :], start + 1)
            if raw.startswith("## ")
        ),
        len(body),
    )
    section = body[start + 1 : end]
    line = body[start][0]
    errors: list[Finding] = []
    for lineno, raw in section:
        if re.search(r"</?(?:dl|dt|dd)\b", raw, flags=re.IGNORECASE):
            errors.append(Finding("examples must not use dl, dt, or dd", lineno))
            return errors
    notice = next(((lineno, raw) for lineno, raw in section if raw.strip()), None)
    if notice is None or notice[1].strip() != EXAMPLE_NOTICE:
        where = notice[0] if notice is not None else line
        errors.append(Finding("Exemplos de entrada e saída must open with the example notice", where))
        return errors
    headings = [index for index, (_, raw) in enumerate(section) if raw.startswith("### ")]
    if not headings and name == "criar-habilidade":
        return errors
    if not headings:
        errors.append(Finding("examples must use a level-3 heading for each input", line))
        return errors
    for position, index in enumerate(headings):
        lineno, raw = section[index]
        if not raw[4:].strip():
            errors.append(Finding("example input heading is empty", lineno))
        next_index = headings[position + 1] if position + 1 < len(headings) else len(section)
        paragraph = any(section[cursor][1].strip() for cursor in range(index + 1, next_index))
        if not paragraph:
            errors.append(Finding("example output must be the paragraph after the heading", lineno))
        if position + 1 < len(headings) and section[next_index - 1][1].strip():
            errors.append(Finding("a blank line must separate example pairs", section[next_index][0]))
    return errors


def flowchart_errors(body: list[tuple[int, str]], direction: str) -> list[Finding]:
    findings: list[Finding] = []
    in_fence = False
    mermaid = False
    for lineno, raw in body:
        stripped = raw.strip()
        if stripped.startswith("```"):
            if not in_fence:
                in_fence = True
                mermaid = stripped[3:].strip().lower() == "mermaid"
            else:
                in_fence = False
                mermaid = False
            continue
        if not in_fence or not mermaid:
            continue
        match = FLOWCHART.match(stripped)
        if match is None:
            continue
        found = (match.group(1) or "").upper()
        if found != direction:
            findings.append(Finding(f"flowchart must use {direction}", lineno))
    return findings


def issue_errors(
    title: str, heading: int, lines: list[tuple[int, str]]
) -> list[Finding]:
    index = 0
    while index < len(lines) and not lines[index][1].strip():
        index += 1
    if index >= len(lines) or not lines[index][1].startswith("Se você"):
        line = lines[index][0] if index < len(lines) else heading
        return [Finding(f"{title}: paragraph must start with Se você", line)]
    while index < len(lines) and lines[index][1].strip():
        index += 1
    while index < len(lines) and not lines[index][1].strip():
        index += 1
    if index >= len(lines) or re.match(r"^\d+\. ", lines[index][1]) is None:
        line = lines[index][0] if index < len(lines) else heading
        return [Finding(f"{title}: ordered list must follow the paragraph", line)]
    return []


def semver_key(quoted: str) -> tuple[int, int, int] | None:
    match = SEMVER.fullmatch(quoted)
    if match is None:
        return None
    return (int(match.group(1)), int(match.group(2)), int(match.group(3)))


def skill_dir_name(path: str) -> str | None:
    match = SKILL_PATH.fullmatch(path)
    return match.group(1) if match else None


def metadata_aliases(text: str) -> list[str]:
    try:
        block = frontmatter(text, Path("SKILL.md"))
    except SystemExit:
        return []
    aliases: list[str] = []
    in_metadata = False
    in_aliases = False
    for raw in block.splitlines():
        if raw and not raw.startswith(" ") and not raw.startswith("\t"):
            in_metadata = raw == "metadata:"
            in_aliases = False
            continue
        if not in_metadata:
            continue
        if in_aliases and re.match(r"^\s+-\s+", raw):
            item = re.sub(r"^\s+-\s+", "", raw).strip().strip("'\"")
            if item:
                aliases.append(item)
            continue
        stripped = raw.strip()
        in_aliases = stripped.startswith("aliases:") and stripped.split(":", 1)[1].strip() == ""
    return aliases


def git_output(args: list[str]) -> str | None:
    result = subprocess.run(
        args,
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return result.stdout


def revision_text(rev: str, path: str) -> str | None:
    if rev == "INDEX":
        return git_output(["git", "show", f":{path}"])
    return git_output(["git", "show", f"{rev}:{path}"])


def name_status_rows(text: str) -> list[tuple[str, str, str]]:
    rows: list[tuple[str, str, str]] = []
    for line in text.splitlines():
        parts = line.split("\t")
        if not parts:
            continue
        status = parts[0]
        if status.startswith("R") and len(parts) == 3:
            rows.append(("R", parts[1], parts[2]))
        elif status == "D" and len(parts) == 2:
            rows.append(("D", parts[1], ""))
        elif status == "A" and len(parts) == 2:
            rows.append(("A", "", parts[1]))
    return rows


def missing_renamed_aliases(
    rows: list[tuple[str, str, str]],
    texts: dict[str, str],
) -> list[tuple[str, str]]:
    missing: list[tuple[str, str]] = []
    renamed_sources = {old for status, old, _new in rows if status == "R"}
    renamed_destinations = {new for status, _old, new in rows if status == "R"}
    for status, old, new in rows:
        if status != "R":
            continue
        old_name = skill_dir_name(old)
        new_name = skill_dir_name(new)
        if old_name is None or new_name is None:
            continue
        required = {old_name, *metadata_aliases(texts.get(old, ""))}
        required.discard(new_name)
        have = set(metadata_aliases(texts.get(new, "")))
        for name in sorted(required - have):
            missing.append((new, name))
    removed: list[tuple[str, set[str]]] = []
    added: list[tuple[str, set[str]]] = []
    for status, old, new in rows:
        if status == "D" and old not in renamed_sources:
            name = skill_dir_name(old)
            if name is None:
                continue
            required = {name, *metadata_aliases(texts.get(old, ""))}
            removed.append((old, required))
        elif status == "A" and new not in renamed_destinations:
            name = skill_dir_name(new)
            if name is None:
                continue
            added.append((new, set(metadata_aliases(texts.get(new, "")))))
    if removed and added:
        have: set[str] = set()
        added_names = {skill_dir_name(path) for path, _aliases in added}
        for _path, aliases in added:
            have.update(aliases)
        seen = {(path, name) for path, name in missing}
        for _path, required in removed:
            for alias in required:
                if alias in have or alias in added_names:
                    continue
                for path, _aliases in added:
                    item = (path, alias)
                    if item not in seen:
                        seen.add(item)
                        missing.append(item)
    return missing


def rename_alias_findings() -> list[tuple[Path, Finding]]:
    base = os.environ.get("CHECK_SKILL_BASE", "")
    head = os.environ.get("CHECK_SKILL_HEAD", "")
    if base and head and not set(base) <= {"0"}:
        raw = git_output(
            ["git", "diff", "--name-status", "-M", base, head, "--", ".agents/skills"]
        )
        old_rev, new_rev = base, head
    else:
        raw = git_output(
            ["git", "diff", "--cached", "--name-status", "-M", "--", ".agents/skills"]
        )
        old_rev, new_rev = "HEAD", "INDEX"
    if not raw:
        return []
    rows = name_status_rows(raw)
    texts: dict[str, str] = {}
    for status, old, new in rows:
        if old and old not in texts:
            texts[old] = revision_text(old_rev, old) or ""
        if new and new not in texts:
            texts[new] = revision_text(new_rev, new) or ""
    return [
        (Path(path), Finding(f"metadata.aliases must include {name}", 1))
        for path, name in missing_renamed_aliases(rows, texts)
    ]


def version_reference() -> str:
    return summary_base() or "HEAD"


def committed_text(relative: Path) -> str | None:
    return revision_text(version_reference(), relative.as_posix())


def instructions_version_errors(text: str) -> list[tuple[str, int | None]]:
    """A business harness publishes its instructions with a description and a version that rises."""
    if not IS_HARNESS or ROOT == CORE:
        return []
    data, end, error = parameters.frontmatter(text)
    if error is not None:
        return []
    errors: list[tuple[str, int | None]] = []
    description = data.get("description")
    if not isinstance(description, str) or not description.strip():
        errors.append(("description is required in the frontmatter of a business harness", end))
    version = parameters.instructions_version(text)
    if version is None:
        errors.append(('metadata.version is required in a business harness, as a quoted version such as "0.1.0"', end))
        return errors
    previous = committed_text(Path(INSTRUCTIONS))
    if previous is not None and previous != text:
        earlier = parameters.instructions_version(previous)
        if earlier is not None and version <= earlier:
            errors.append(("metadata.version must increase when the instructions change", parameters.key_line(text, "version")))
    return errors


GIVEN_PT = re.compile(r"^\s*(Dado|Dada|Dados|Dadas)\b(.*)$")


def gherkin_errors(skill_dir: Path, language: str) -> list[Finding]:
    errors: list[Finding] = []
    for path in sorted((skill_dir / "features").glob("*.feature")):
        file = path.relative_to(ROOT).as_posix()
        lines = path.read_text(encoding="utf-8").splitlines()
        first = next(((index, line.strip()) for index, line in enumerate(lines, 1) if line.strip()), None)
        if first is None or first[1] != f"# language: {language}":
            errors.append(Finding(f"a feature must start with # language: {language}", first[0] if first else 1, file))
        if language != "pt":
            continue
        for index, line in enumerate(lines, 1):
            match = GIVEN_PT.match(line)
            if match and (match.group(1) != "Dado" or not match.group(2).startswith(" que ")):
                errors.append(Finding('a Given starts with "Dado que"', index, file))
    return errors


def eval_file_errors(skill_dir: Path, name: str, version: str) -> list[Finding]:
    path = skill_dir / "evals" / "evals.json"
    file = path.relative_to(ROOT).as_posix()
    if not path.is_file():
        return [Finding("evals/evals.json is missing", file=file)]
    raw = path.read_text(encoding="utf-8")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return [Finding("evals/evals.json is invalid JSON", exc.lineno, file)]
    if not isinstance(data, dict):
        return [Finding("evals/evals.json must be an object", 1, file)]
    lines = raw.splitlines()

    def line_of(token: str) -> int | None:
        for index, line in enumerate(lines, 1):
            if token in line:
                return index
        return 1

    errors: list[Finding] = []
    if data.get("skill_name") != name:
        errors.append(
            Finding(
                "evals.json skill_name must match the skill name",
                line_of("skill_name"),
                file,
            )
        )
    evals = data.get("evals")
    if not isinstance(evals, list):
        errors.append(Finding("evals.json evals must be an array", line_of('"evals"'), file))
        return errors
    key = semver_key(version)
    if key is None or key[0] < 1:
        return errors
    filled = [
        item
        for item in evals
        if isinstance(item, dict)
        and isinstance(item.get("prompt"), str)
        and item["prompt"].strip()
        and isinstance(item.get("expected_output"), str)
        and item["expected_output"].strip()
    ]
    if len(filled) < 3:
        errors.append(
            Finding(
                "version 1.0.0 or newer requires 3 evals",
                line_of('"evals"'),
                file,
            )
        )
    return errors


def skill_files(root: Path) -> list[Path]:
    skills = root / ".agents" / "skills"
    if not skills.is_dir():
        return []
    return sorted(
        path
        for path in skills.glob("*/*")
        if path.name in SKILL_NAMES and path.is_file()
    )


def instructions_errors(text: str, encoding, word_limit: int, line_limit: int, body_limit: int) -> list[Finding]:
    """The project instructions load in every session, so they get the size limits of a skill body."""
    errors: list[Finding] = []
    lines = text.splitlines()
    last_line = len(lines) or 1
    words = len(text.split())
    if words > word_limit:
        errors.append(Finding(f"{words} words (limit {word_limit})", last_line))
    if len(lines) >= line_limit:
        errors.append(Finding(f"{len(lines)} lines (limit {line_limit})", line_limit))
    _, tokens = body_measure(text, encoding)
    if tokens is not None and tokens >= body_limit:
        errors.append(Finding(f"{tokens} body tokens (limit {body_limit})", last_line))
    return errors


def requested_files(root: Path, args: list[str]) -> list[Path]:
    if not args:
        return skill_files(root)
    files: list[Path] = []
    for arg in args:
        raw = Path(arg)
        path = raw.resolve() if raw.is_absolute() else (Path.cwd() / raw).resolve()
        if not path.exists():
            continue
        if path.name not in SKILL_NAMES or not path.is_file():
            raise SystemExit(f"{arg}: expected a SKILL.md file")
        files.append(path)
    return sorted(set(files))


def main() -> int:
    try:
        import tiktoken
    except ImportError:
        raise SystemExit(
            "tiktoken is required. Install .agents/scripts/check-skill/requirements.txt"
        )
    roots = [ROOT, CORE]
    word_limit = int(parameters.setting(roots, "Palavras"))
    line_limit = int(parameters.setting(roots, "Linhas"))
    catalog_limit = int(parameters.setting(roots, "Tokens do catálogo"))
    body_limit = int(parameters.setting(roots, "Tokens do corpo"))
    author = str(parameters.setting(roots, "Organização"))
    license_required = parameters.setting(roots, "Licença obrigatória") == "sim"
    direction = str(parameters.setting(roots, "Direção dos fluxogramas"))
    gherkin = str(parameters.setting(roots, "Idioma do Gherkin"))
    if direction not in FLOWCHART_DIRECTIONS:
        raise SystemExit(
            '"Direção dos fluxogramas" must be LR, RL, TD, TB, or BT'
        )
    encoding = tiktoken.get_encoding("o200k_base")
    failed = False
    results: dict[str, list[tuple[Path, Finding]]] = {}
    measures: dict[str, tuple[str | None, int | None]] = {}
    known = known_skill_names()
    args = sys.argv[1:]
    skill_args = [arg for arg in args if Path(arg).name != INSTRUCTIONS]
    instructions = ROOT / INSTRUCTIONS
    if instructions.is_file() and (not args or len(skill_args) < len(args)):
        results.setdefault(INSTRUCTIONS, [])
        text = instructions.read_text(encoding="utf-8")
        measures[INSTRUCTIONS] = body_measure(text, encoding)
        block_errors = parameters.validate(
            text, parameters.skill_parameter_keys(roots), required=IS_HARNESS or ROOT == CORE
        )
        for message, line in block_errors + instructions_version_errors(text):
            failed = True
            finding = Finding(message, line)
            results[INSTRUCTIONS].append((Path(INSTRUCTIONS), finding))
            report(Path(INSTRUCTIONS), finding)
        for finding in instructions_errors(text, encoding, word_limit, line_limit, body_limit):
            failed = True
            results[INSTRUCTIONS].append((Path(INSTRUCTIONS), finding))
            report(Path(INSTRUCTIONS), finding)
    if (args and not skill_args) or not IS_HARNESS:
        write_summary(results, measures, body_limit, encoding)
        return 1 if failed else 0
    for path in requested_files(ROOT, skill_args):
        relative = path.relative_to(ROOT)
        key = skill_key(relative)
        results.setdefault(key, [])

        def add(finding: Finding, target: Path | None = None) -> None:
            nonlocal failed
            failed = True
            where = target if target is not None else relative
            results[key].append((where, finding))
            report(where, finding)

        text = path.read_text(encoding="utf-8")
        measures[key] = skill_measure(text, encoding)
        file_lines = text.splitlines()
        last_line = len(file_lines) or 1
        words = len(text.split())
        if words > word_limit:
            add(Finding(f"{words} words (limit {word_limit})", last_line))
        lines = len(file_lines)
        if lines >= line_limit:
            add(Finding(f"{lines} lines (limit {line_limit})", line_limit))
        try:
            block = frontmatter(text, relative)
            front, body = skill_sections(text)
            name, description = catalog_fields(block, relative)
            for finding in spec_errors(front, path, name, description, license_required):
                add(finding)
            tokens = len(encoding.encode(f"{name}\n{description}"))
            if tokens > catalog_limit:
                description_line = next(
                    (lineno for lineno, raw in front if raw.startswith("description:")),
                    1,
                )
                add(Finding(f"{tokens} catalog tokens (limit {catalog_limit})", description_line))
            body_text = text[text.find("\n---", 4) + 4 :]
            body_tokens = len(encoding.encode(body_text))
            if body_tokens >= body_limit:
                body_line = body[-1][0] if body else last_line
                add(Finding(f"{body_tokens} body tokens (limit {body_limit})", body_line))
            skill_author, version = metadata_fields(block, relative)
            draft = semver_key(version)
            if draft is None or draft[0] != 0 or draft[1] != 0:
                for finding in instruction_errors(body, name):
                    add(finding)
                for finding in flowchart_errors(body, direction):
                    add(finding)
            for finding in metadata_list_errors(block):
                add(finding)
            for finding in related_errors(block, body_text, name, known):
                add(finding)
            if skill_author != author:
                author_line = next(
                    (lineno for lineno, raw in front if raw.strip().startswith("author:")),
                    None,
                )
                add(Finding(f"metadata.author must be {author}", author_line))
            notion = metadata_notion(block)
            if notion is not None and notion != '"false"':
                notion_line = next(
                    (lineno for lineno, raw in front if raw.strip().startswith("notion:")),
                    None,
                )
                add(Finding('metadata.notion must be "false"', notion_line))
            for finding in notion_url_errors(file_lines):
                add(finding)
            if SEMVER.fullmatch(version) is None:
                version_line = next(
                    (lineno for lineno, raw in front if raw.strip().startswith("version:")),
                    None,
                )
                add(Finding("metadata.version must be a double-quoted semver", version_line))
            for finding in eval_file_errors(path.parent, name, version):
                add(finding, Path(finding.file) if finding.file else relative)
            for finding in gherkin_errors(path.parent, gherkin):
                add(finding, Path(finding.file))
            previous = committed_text(relative)
            new_key = semver_key(version)
            if previous is not None and previous != text and new_key is not None:
                old_key = semver_key(
                    metadata_fields(frontmatter(previous, relative), relative)[1]
                )
                if old_key is not None and new_key <= old_key:
                    version_line = next(
                        (
                            lineno
                            for lineno, raw in front
                            if raw.strip().startswith("version:")
                        ),
                        None,
                    )
                    add(
                        Finding(
                            "metadata.version must increase when the skill changes",
                            version_line,
                        )
                    )
        except SystemExit as exc:
            add(Finding(str(exc)))
    for relative, finding in rename_alias_findings():
        failed = True
        key = skill_key(relative)
        results.setdefault(key, [])
        results[key].append((relative, finding))
        report(relative, finding)
    write_summary(results, measures, body_limit, encoding)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
