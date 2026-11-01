---
locale: en
---

# Keep the Notion data source id of the sync in a secret

## Status

Accepted

## Context

The sync publishes skills and models to a Notion database of each business. [ADR 0005](0005-split-the-core-from-business-harnesses.md) and [ADR 0012](0012-name-and-publish-models-like-skills.md) put the id of that data source in the mapping file of the business repository, next to the property and status option names, and the `sync-notion-pages` action read it only from there.

Setting up the sync for a new business, the person did not want the id of a workspace database committed to the repository. The id alone grants nothing: the Notion API answers only to a token with access to the database, and that token is the `NOTION_TOKEN` secret. Still, the id names a database of the workspace, the history keeps every committed value, and the token already lives in the repository secrets. Both values of the connection belong in the same place, where a change needs no commit.

## Decision

The sync reads the data source id of the skills database from the `NOTION_SKILLS_DATA_SOURCE_ID` secret, and the one of the models database from the `NOTION_TEMPLATES_DATA_SOURCE_ID` secret. The action receives them as the `skills-data-source-id` and `templates-data-source-id` inputs, and the example workflow passes the secrets of the same names.

The mapping keeps the property and status option names, which follow the database and change with it.

A repository that still keeps `data_source_id` in its mapping must migrate: store the id as the secret and delete it from the mapping. Until it does, the sync uses the id of the mapping and prints a warning that says how to migrate. With the id in both places, the sync fails and says which one to delete. With neither, the sync fails when it has a page to publish, and says which secret to store.

The example mappings drop `data_source_id`, and the Notion runbook stores the id with `gh secret set`.

## Consequences

A new business stores one more secret and commits no workspace id. Moving the sync to another database changes the secret and, when the names differ, the mapping.

The checker does not see the secret. A wrong id shows on the first sync, as a wrong token does.

[ADR 0001](0001-describe-data-sources-with-json-schema.md) still has data sources read by skills identified in their mappings. Only the mappings of the sync change.
