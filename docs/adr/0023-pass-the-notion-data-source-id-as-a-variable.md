---
locale: en
---

# Pass the Notion data source id of the sync as a variable

## Status

Accepted

## Context

The sync publishes skills and models to a Notion database of each business. ADR 0005 and ADR 0012 put the id of that data source in the mapping file of the business repository, next to the property and status option names, and the `sync-notion-pages` action read it only from there.

Setting up the sync for a new business, the person did not want the id of a workspace database committed to the repository. The id is not a credential: the Notion API answers only to a token with access to the database, and that token is the `NOTION_TOKEN` secret. Still, the id names a database of the workspace, and the token already lives outside the repository. The person preferred both values of the connection to live in the repository settings, where a change needs no commit.

## Decision

The sync reads the data source id of the skills database from `NOTION_SKILLS_DATA_SOURCE_ID`, and the one of the models database from `NOTION_TEMPLATES_DATA_SOURCE_ID`. The action receives them as the `skills-data-source-id` and `templates-data-source-id` inputs. The example workflow passes repository variables of the same names; a repository that prefers secrets passes secrets instead.

The mapping keeps the property and status option names, which follow the database and change with it. Its `data_source_id` becomes optional, so a repository that already keeps the id there syncs without change.

Each repository keeps the id in one place. With the id in the variable and in the mapping, the sync fails and names both. With neither, the sync fails when it has a page to publish.

The example mappings drop `data_source_id`, and the Notion runbook stores the id with `gh variable set`.

## Consequences

A new business sets one more repository variable and commits no workspace id. Moving the sync to another database changes the variable and, when the names differ, the mapping.

The checker does not see the variable. A wrong id shows on the first sync, as a wrong token does.

ADR 0001 still has data sources read by skills identified in their mappings. Only the mappings of the sync change.
