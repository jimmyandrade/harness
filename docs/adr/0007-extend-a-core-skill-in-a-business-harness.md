---
locale: en
---

# Extend a core skill in a business harness

## Status

Accepted

## Context

Some skills are mostly shared, but each business decides a few parts differently. A calendar skill, for example, can search before it creates an event and write the weekday next to each date in any business, while the event types, the canonical source, and the title rules change from one business to another. Copying the core skill into a business harness drifts on every core release. Keeping it only in a business harness leaves the shared part out of the core.

Claude Code has no inheritance between skills: a skill is one text. The Notion skills database cannot read the core repository either, and a page must stay under the body token limit of `.agents/config.yml`.

## Decision

A core skill marks each part a business can change as a named extension point, with its default text:

```markdown
<!-- extension-point: event-type -->
Ask the person which type the event has.
<!-- /extension-point -->
```

A core skill with extension points says that an extension, when the project has one, comes first.

A business harness extends it with a skill of the same name that declares `metadata.extends: core:<name>`. Its body opens with a fixed sentence that sends the agent to the core skill, lists one H3 per extension point it fills under `## Pontos de extensão`, and may add items to `Problemas comuns`, `Exemplos de entrada e saída`, `Casos-limite`, and `Pegadinhas`. It does not repeat the steps of the core.

`.agents/scripts/compose-skill/compose-skill.py` composes the two into one `SKILL.md`: it replaces each point with the extension text, or keeps the default, drops the markers, takes the frontmatter of the extension, and appends the other sections to the core sections with the same title. The checker and, later, the Notion sync use it, so there is one implementation.

The checker fails when:

- a project skill has the name of a core skill and does not declare `metadata.extends`;
- `metadata.extends` names another skill, or a skill the core does not have;
- an extension fills a point the core does not declare, or has another section;
- the composed body reaches the body token limit.

The skill graph draws an arrow labeled extends from the project skill to a separate node for the core skill.

## Consequences

In Claude Code the extension calls the core skill while it runs, so both texts enter the context. The limit applies to the composed text, which is what a person reads in Notion.

A core release that grows a skill can push an extension over the limit. The checker catches it in the pull request that moves the core pin, before anything reaches Notion.

Points have names, not step numbers, so the core can reorder its steps. Renaming or removing a point breaks the extensions that fill it, and is a breaking change of the core skill.

Cursor and Copilot read only the core skills link, so there the core default applies.

Until the Notion sync composes extensions, it still stops when a name exists in the project and in the core.
