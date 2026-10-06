---
locale: en
---

# Keep skill parameter values in AGENTS.md

## Status

Accepted. ADR 0009 supersedes the part that keeps a separate settings file for what scripts read.

## Context

A core skill opens with `Parâmetros de configuração`, a YAML block of defaults. ADR 0005 already says that a skill reads what differs between projects from the project instructions: `AGENTS.md` in a repository, or the page titled `AGENTS.md` in Notion. It does not say where a business keeps those values, how they are organized, or how they reach Notion.

The question became concrete when skills that read a business data source were proposed for the core. Such a skill needs the name of a list and of its columns. Those names differ per business, and each business keeps its data source schemas and mappings in its own harness. A fact, such as which group a recurring organizer belongs to, stays in the data, not in the skill.

Two places were considered for the values:

1. **A separate settings file in each project, filled into the Notion page by the sync.** Scripts already read such a file, for limits, languages, and the page icon. But no agent reads it on its own: a skill would need an instruction to open it, and the sync would need to rewrite the parameter block of each core skill page.
2. **A YAML block in `AGENTS.md` of each project.** Every tool reads it without being told. Cursor and Copilot read `AGENTS.md`, and Claude Code reads `CLAUDE.md`, which imports `AGENTS.md`. A consumer project already keeps the values of the core product news skill there.

Three problems showed up once a project wrote those values:

- The `AGENTS.md` of one project had grown to about 7,000 tokens, loaded in every session, over the body limit that the checker applies to a skill.
- Some keys of core skills did not say what they belong to. `Idioma da mensagem` and `Padrão da mensagem` are about commit messages, and `Idioma da resposta` is about review replies, but nothing in the key says so.
- The same file serves a coding tool and the Notion agent. In Notion, a page full of commands, branches, and build steps does not tell the reader which part applies there.

## Decision

The values of skill parameters live in `AGENTS.md`. A separate settings file keeps only what scripts read.

### AGENTS.md is written like a skill

- It is written and changed with the core skill creation skill, in Portuguese, like the skills. A parameter in the file states its language. Other project documents, such as `CONTRIBUTING.md`, keep their own language.
- The checker measures it with the same limits as a skill body: words, lines, and body tokens. The structure rules of a skill, such as steps and examples, do not apply to it.
- It has one section for Notion and one for coding tools, so each reader finds the part that applies to it. Anything both need stays outside those two sections.
- In Notion, it is a page of the skills database, synced from git like a skill page.

### Parameters form a tree

The parameter block of `AGENTS.md` has one entry named `Global` and one entry per skill name:

```yaml
"Global":
  "Branch base": "main"
  "Idioma da mensagem de commit": "inglês"
"criar-pull-request":
  "Duração do hook de pre-push (min)": 1
```

- A skill reads each value from its own entry, then from `Global`, then uses the default written in the skill.
- A value that more than one skill uses goes in `Global`, under a key that names what it belongs to.
- A value that only one skill uses goes under that skill's name.
- The block lists only values that differ from the defaults.
- Core skills rename every ambiguous key, such as `Idioma da mensagem` to `Idioma da mensagem de commit`. The rename is announced in the release notes, because a project that keeps the old key silently falls back to the default.

### What a core skill never carries

A core skill never carries a schema, a list name, a column name, or a fact about a business. They become parameters, and the schema stays in the business harness. The skill text keeps saying "instruções do projeto", as ADR 0005 and `AGENTS.md` require, and never names the file.

## Consequences

Claude Code, Cursor, Copilot, and, after the sync, the Notion agent read the same values from one place.

`AGENTS.md` loads in every session, so each value costs context in every task. The checker now reports that cost the same way it reports a skill. A skill that would need most columns of a schema as parameters stays in its business harness.

A project whose `AGENTS.md` is over the limit moves the rest to other documents: rules for people to `CONTRIBUTING.md`, the file map to `ARCHITECTURE.md`, design rules to their own document, and procedures to skills.

Until the `AGENTS.md` sync exists, a core skill that reads a business data source reaches Notion with defaults only. Move such a skill to the core only after that sync works. Until then, the business keeps its own copy.

When the sync ships, the Notion page titled `AGENTS.md` becomes machine-written, and people change it in git. That pull request also replaces the rule in this repository's `AGENTS.md` that forbids editing that page.
