---
locale: en
---

# Split the core from business harnesses

## Status

Accepted

## Context

One harness repository held the skills, the checker, the Notion sync, the vocabulary API and MCP, the data source schemas, the glossary, and the output styles of one business. A second business needs the same tools and some of the same skills. Copying the repository makes every fix land twice, and the copies drift.

Most of the tooling carries no business rule. The skills, the schemas, the glossary, and the output styles do, today. Some skills could serve any business once their business rules move out of the text.

Each business keeps its skills in its own Notion workspace, in a database with its own property names.

## Decision

Keep one public core repository and one private repository per business.

The core holds the checker, the Notion sync, the vocabulary API and MCP, the skill-page schema, the default configuration, and the skills that work for any business. It ships them three ways: a Claude Code plugin named `harness-core`, two composite GitHub Actions, and a Node.js package for the local hook.

A business harness holds its skills, its data source schemas and mappings, its glossary, its output styles, and a `.agents/config.yml` with only the keys that differ from the core. Its marketplace lists its own plugin and `harness-core`, pinned to a tag.

Scripts find the project from `HARNESS_ROOT` or the working directory, and find the core from their own location. A config key missing from the project falls back to the core.

The sync takes the mapping from the business repository, including the data source id, the property names, and the status option names. The sync logic is the same for every business.

A skill moves to the core one at a time, after an audit removes its company names and business rules. What still differs between businesses is read from the project instructions: `AGENTS.md` in a repository, or the page titled `AGENTS.md` in Notion.

The core starts with no skills.

## Consequences

A fix to the checker, the sync, or the vocabulary API lands once and reaches every business when it moves its pinned tag.

The core is public, so nothing in it can name a business, a workspace, a database, or a person. The audit before a move enforces that for skills.

A business that renames a property edits its mapping. It does not edit the core.

Until a skill is audited, it stays in its business harness, even when another business has a similar one.

The plugin was later renamed from `harness-core` to `core`, so its skills read `core:<skill>` next to the business prefixes.
