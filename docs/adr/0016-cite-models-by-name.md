---
locale: en
---

# Cite models by name

## Status

Accepted. Supersedes the part of ADR 0012 where the sync replaces the path of a model in a skill page with a mention of the model page, and the matching bullet of ADR 0015.

## Context

A skill points at its output model with a path: "Leia .agents/assets/templates/<modelo> quando for gerar a saída." The path works for an agent with the repository open. In Notion the agent cannot open it, so ADR 0012 planned to rewrite the sentence on each sync into a mention of the model page.

That rewrite ties the skill page to the page id of the model, needs the model published before the skills that cite it, and makes the published body differ from the body in git. The name of a model already identifies it: it equals the file name, and the sync keeps one page per title in the models database (ADR 0015).

## Decision

- A skill cites an output model by its name, in one sentence: "Leia o modelo de saída `<nome>` quando for gerar a saída." The sync publishes that sentence as it is.
- In a repository, the agent reads `.agents/assets/templates/<nome>.md` of the project, or else of the core. Elsewhere, it opens the page titled `<nome>` in the models database that the `Banco de modelos no Notion` parameter of the project instructions names. Without that parameter, it looks for a page with that exact title in the workspace.
- The project instructions template carries that rule once, in the part that applies everywhere, so the Notion agent reads it in every session.
- A skill lists the models it cites in `metadata.models`, one name per line. When a skill declares it, the checker fails on a name that is not a file in `.agents/assets/templates/` of the project or of the core, on a model the body cites between backticks that the list lacks, and on a path to `.agents/assets/templates/` in the body. A skill without `metadata.models` is not checked, so a business harness adopts it one skill at a time, as with `metadata.related`.
- `Banco de modelos no Notion` is a link to a Notion database, or its `collection://` data source. Only a business sets it, since the core names no database.
- An input model keeps its path, since it travels with the skill as a file of its page.

## Consequences

The body of a skill page in Notion equals the body in git, and the sync needs no order between models and skills.

The Notion agent spends one query to find the model page, instead of following a mention.

A model that is not yet published, such as a file without frontmatter, is found only in the repository. In Notion, the agent says that the model is missing instead of guessing its shape.
