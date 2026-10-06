---
locale: en
---

# Keep every setting in AGENTS.md

## Status

Accepted. Supersedes the part of ADR 0008 that kept a separate settings file for what scripts read.

## Context

ADR 0008 split settings by reader: skills read `AGENTS.md`, and scripts read a separate settings file. That left two files of settings per harness, and some values in both. The language of commit subjects was set once for no script and once for the commit skill. The limits of a skill were set once for the checker and once for the skill creation skill. One setting was read by no script at all. Another was read only by the script of a business skill, so it becomes a parameter of that skill.

The scripts that read that file are the checker, the skill graph, the folder icon script, the Notion sync, and the measuring script of the skill measuring skill. They can read the same YAML from the parameter block of `AGENTS.md` instead. The block is found under the heading `Parâmetros das habilidades`, as the first `yaml` code block after it.

The risk is that people and agents edit `AGENTS.md` often, so the block can break: invalid YAML, a renamed heading, or a misspelled key.

## Decision

Every setting lives in the parameter block of `AGENTS.md`. No repository keeps a separate settings file.

- A script reads a setting from the project block: first the entry of the skill that shares the setting, if any, then `Global`, then the top level. When the project does not set it, the script reads the core block, which holds the defaults. A value of the wrong type is skipped, and the checker reports it.
- A setting that a skill also reads keeps the skill's key, so one value serves both. The checker reads `Tokens do corpo`, `Linhas`, and `Tokens do catálogo`, the keys of the skill creation skill.
- The settings only scripts read get keys in Portuguese, like every parameter: `Palavras`, `Organização`, `Licença obrigatória`, `Idioma do Gherkin`, `Direção dos fluxogramas`, `Ícone das páginas no Notion`, `Cor do ícone das páginas no Notion`, and `Símbolo da pasta no macOS`.
- Keys that nothing reads are dropped. A setting that only one skill's script reads becomes a parameter of that skill, and the script reads it from the skill's entry, then `Global`, then the skill's own default.
- The project root is the root of its git repository. A project is a harness when its `.agents/skills` is a real folder. A project that links `.agents/skills` to the core only uses the core skills, so the checker checks only its `AGENTS.md`.

The checker validates the block on every commit and pull request:

- the heading and the `yaml` block are present, and the YAML parses to a mapping;
- every key under `Global` or at the top level is a parameter of a skill in the project or the core, or a script setting;
- every other entry is the name of such a skill, and its keys are parameters of that skill;
- a script setting has the expected type, also under a skill entry;
- the block is written in block style, without `{ }` or `[ ]`, because the Notion sync reads it line by line.

## Consequences

Each harness has one file of settings, read the same way by agents and scripts, and synced to Notion with the rest of `AGENTS.md`.

A typo in a key now fails the check instead of falling back to a default without warning.

Script settings appear in Notion too, and cost a few lines of context in every session.

The Notion sync, written in TypeScript, reads the two icon settings from the block without a YAML library, so it stays without new dependencies.
