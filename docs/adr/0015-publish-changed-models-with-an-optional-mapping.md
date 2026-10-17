---
locale: en
---

# Publish changed models with an optional mapping

## Status

Accepted. Refines the publishing part of ADR 0012.

## Context

ADR 0012 decides that a model, a file in `.agents/assets/templates/`, is published to a Notion database the project elects, through `.agents/mappings/template-page.notion.json`. It names six properties for that mapping, publishes only the models that a published skill cites, and replaces the path in the skill page with a mention of the model page.

A business that already keeps its models in a Notion database, edited by hand, rarely has all six properties. Its database often has a title, a version as text, and properties that git does not hold, such as the person who reviews the model, a goal verb picked from a list, or a review date. Asking it to add the missing properties before the first sync delays the move to git, while the hand-edited pages go stale.

The skills that cite a model cite it with a sentence the sync must rewrite into a mention. Doing that in the same change ties two risks together: the model pages and the rewritten skill pages.

## Decision

- The model mapping is optional. Without the file, the sync publishes no model and logs that the mapping is missing. Nothing changes for a project that does not opt in.
- The mapping binds `name` and `version`, which are required. `description`, `aliases`, `tags`, and `status` are written only when the mapping binds them. A property the mapping does not bind, such as a reviewer, keeps the value a person set in Notion.
- The sync publishes each model whose file changed between `base` and `head`, and every model when the model mapping or the publisher changes. With `include-core`, it publishes the models of the core when the project moves the core version or its model mapping. A model name in both repositories stops the sync.
- A file without frontmatter, or whose frontmatter has no `name`, is not yet a model and is logged as skipped. A file with a `name` needs `description` and `metadata.version`, and `name` equals the file name. The checker validates that frontmatter and the three sections of ADR 0012 for every model, with the same rule for what is a model, and the version must rise when the file changes.
- The sync finds the page by the model name, or else by one of its `metadata.aliases`, so a model can take over a page that a person created with another title. It replaces the page body with the file body and never deletes a page, also when the file is removed.
- A new page gets the icon of skill pages. An update leaves the icon as it is.
- Rewriting the template sentence of a skill page into a mention of the model page stays as ADR 0012 describes, for a later change.

## Consequences

A business points the mapping at its existing database and publishes its models on the next release, without changing the database first.

Until the mention lands, a skill page in Notion still shows the path of its model, and the Notion agent finds the model by its name in the models database.

The files in `.agents/assets/templates/` that have no frontmatter keep working in git and stay out of Notion until they gain it.
