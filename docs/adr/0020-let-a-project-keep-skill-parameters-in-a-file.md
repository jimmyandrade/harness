---
locale: en
---

# Let a project keep skill parameters in a file

## Status

Accepted. It replaces the part of `docs/adr/0009-keep-every-setting-in-agents-md.md` that forbids a separate settings file for the parameters of a skill.

## Context

ADR 0009 keeps every setting in the frontmatter of `AGENTS.md`, so that agents, scripts, and the Notion sync read one source. That works where the project uses Notion: the Notion agent cannot read a local file.

A project that only runs in a tool with a file system and a command line, such as Claude Code or Cursor, pays a cost for it. The `AGENTS.md` loads whole in every session, and the parameters of every skill load with it, although a session uses a few skills. A project with many skills spends thousands of tokens on parameters that most sessions do not need.

## Decision

A project can keep the parameters of a skill in a file, instead of in `AGENTS.md`.

- The project sets `Pasta dos arquivos de configuração` under `Global` to a folder relative to the project root. It is a script setting, and it has no default: without it, nothing changes.
- The file of a skill is `<folder>/<skill>/config.yaml`. Its `parametros` key is a mapping with the parameters of that skill, the same keys and values that would sit under the skill's entry in `metadata.parameters`. Other keys of the file belong to the data of the skill, and the checker ignores them.
- The file counts as the project instructions: the skill reads the same keys and the skill text does not change. Scripts read it first, before the skill entry, `Global`, and the default of the skill.
- A skill has one source. When its file has `parametros`, the skill has no entry in `metadata.parameters`, and the checker fails when it has both.
- The checker validates every file in the folder that has `parametros`: it parses, the folder name is a skill of the project, the core, or an installed plugin, and every key is a parameter of that skill, with the type of a script setting where it applies.
- The Notion sync does not read these files. A project that uses Notion keeps its parameters in `AGENTS.md`, as ADR 0009 decides.
- The rule applies where the tool has direct access to a file system and a command line. In any other tool, the skill reads `AGENTS.md` only.

## Consequences

A session loads the parameters of the skills it runs, not of all skills.

A project that mixes the two has to choose a source for each skill, and the checker reports the skill that has both.

The folder of a skill in the project data now holds its parameters, which makes the data and the parameters of a skill live together.
