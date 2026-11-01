---
locale: en
---

# Name and publish models like skills

## Status

Accepted

## Context

A skill that produces a fixed shape points to a file with one sentence, as `criar-habilidade` requires: "Leia .agents/assets/templates/<modelo> quando for gerar a saída." The file lives outside the skill folder, so several skills can share it. The Notion sync publishes the sentence as it is, and the Notion agent cannot open a repository path. It skips the file or tries to read it from GitHub, which costs credits and often fails (issue 202).

The same kind of file serves more than output. A team writes a list of questions to prepare something, instructions to summarize a meeting, a form for data entry, or the format of a report. Teams call them templates, briefings, or models. A business may already keep them in a Notion database of its own, edited by hand, with a name, a description, and a version.

The word needs care in Portuguese. "Modelo" alone also names a Notion page template and an AI model. "Briefing" names only instructions for someone to produce something, so it does not cover a data entry form or an output format. The core skills already say "modelo de saída" and "modelo de entrada".

## Decision

### The concept is a model, always with a complement

Skill text says "modelo" with what it is for: "modelo de saída", "modelo de entrada", "modelo de perguntas", "modelo de resumo". It never says "modelo" alone. "Briefing" and "template" are aliases or tags, not the name of the concept.

### A model is a file in the shared folder

A model lives in `.agents/assets/templates/<name>.md`, outside any skill folder, so more than one skill can cite it. Like a skill, it has frontmatter with `name`, equal to the file name in ASCII kebab-case, `description`, saying when to use it, and `metadata.version` in semantic versioning, `major.minor.patch`, quoted. `metadata.aliases` and `metadata.tags` are optional, one item per line.

Its body has three sections, in this order:

- `Contexto`: what the model is for and when to use it.
- `Formato`: the sections of the result, each with what goes in it.
- `Estilo`: the level of detail, and whether to use lists or paragraphs.

### A model is published to a database the project elects

A project elects a Notion database for its models, the same way it elects the skills database. A separate mapping, `.agents/mappings/template-page.notion.json`, holds its property names for the name, the description, the version, the aliases, the tags, and the status. The status follows the version with the rule of skill pages: below 0.1.0 is the draft option, from 0.1.0 with major 0 is the validation option, and from 1.0.0 on is the production option. A model page has no file attachment and no parent or child relation. The id of its data source comes from a repository variable, as ADR 0023 decides.

The sync creates or updates one page per model a published skill cites, found by its name, and leaves the other pages of that database alone. The published skill page mentions the model page in place of the path. The `SKILL.md` in git keeps the path, so local agents read the file.

A project without that mapping keeps the path in the skill page, and the sync log says the model was not published.

## Consequences

The Notion agent reads the model from the database without opening the repository, and a person finds it by its name, an alias, or a tag.

A model changes like a skill: its version rises on each change, and a change to a model republishes the skills that cite it.

A business database that already holds models edited by hand needs the version property as text in semantic versioning, the aliases, the status, and the tags before the sync writes to it.

Existing files in `.agents/assets/templates/` gain frontmatter and the three sections when the sync starts publishing them. The checker validates that frontmatter.
