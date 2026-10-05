---
locale: en
---

# Keep skill parameter values in AGENTS.md

## Status

Accepted

## Context

A core skill opens with `Parâmetros de configuração`, a YAML block of defaults. ADR 0005 already says that a skill reads what differs between projects from the project instructions: `AGENTS.md` in a repository, or the page titled `AGENTS.md` in Notion. It does not say where a business keeps those values, or how they reach Notion.

The question became concrete when skills that read a business data source were proposed for the core. Such a skill needs the name of a list and of its columns. Those names differ per business, and each business keeps its data source schemas and mappings in its own harness. A fact, such as which group a recurring organizer belongs to, stays in the data, not in the skill.

Two places were considered for the values:

1. **`.agents/config.yml` of each project, filled into the Notion page by the sync.** Scripts already read this file, for limits, languages, and the page icon. But no agent reads it on its own: a skill would need an instruction to open it, and the sync would need to rewrite the parameter block of each core skill page.
2. **A YAML block in `AGENTS.md` of each project.** Every tool reads it without being told. Cursor and Copilot read `AGENTS.md`, and Claude Code reads `CLAUDE.md`, which imports `AGENTS.md`. A consumer project already keeps the values of the core product news skill there.

## Decision

The values of skill parameters live in a `Skill parameters` YAML block in the `AGENTS.md` of each project. `.agents/config.yml` keeps only what scripts read.

- The block lists only the values that differ from the defaults in the skills.
- One block serves every skill, so a key names what it belongs to, such as `"Coluna de status da inscrição"`, not `"Coluna de status"`.
- A core skill never carries a schema, a list name, a column name, or a fact about a business. They become parameters, and the schema stays in the business harness.
- The skill text keeps saying "instruções do projeto", as ADR 0005 and `AGENTS.md` require. It never names the file.
- The `AGENTS.md` of a business harness is the write source of its project instructions in Notion. A sync will publish it to the page titled `AGENTS.md`, as the skill sync does for skill pages.

## Consequences

Claude Code, Cursor, Copilot, and, after the sync, the Notion agent read the same values from one place.

`AGENTS.md` loads in every session, so each value costs context in every task. Keep the block to the values that differ. A skill that would need most columns of a schema as parameters stays in its business harness.

Until the `AGENTS.md` sync exists, a core skill that reads a business data source reaches Notion with defaults only. Move such a skill to the core only after that sync works. Until then, the business keeps its own copy.

When the sync ships, the Notion page titled `AGENTS.md` becomes machine-written, and people change it in git. That pull request also replaces the rule in this repository's `AGENTS.md` that forbids editing that page.
