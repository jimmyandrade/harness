---
locale: en
---

# Describe each data source with JSON Schema and a Notion mapping

## Status

Accepted

## Context

This harness exists to cut the tokens spent on Notion's own AI. Many rules for inserting or updating a record are deterministic. Those rules do not belong in a skill, because a skill is loaded as prose and the model has to interpret them again.

Some guidance stays generative. Suggesting that a task title start with a verb is one case. A skill can hold that. It does not hold the field list, the types, or the allowed values.

Each business points the same logical data at its own database by changing property names. The logical schema stays. The connected Notion workspace may be a different company from the one the mapping names. This repository does not embed a workspace, a database, or a page in a skill.

JSON Schema is the usual way to describe a data contract. Tools already validate it. A second schema language would add a format to learn for the same job. No market standard defines a directory, or a file format, for binding those fields to Notion property names.

## Decision

Describe each data source, including tasks, as JSON Schema, draft 2020-12. The schema uses logical field names. It states the type, which fields are required, and which values are closed. `title` is the logical list name. `description` states what the data source is. A description does not name a database or a property. A former name of the data source or of a property never stays in the schema.

When a property name needs a fixed reading, the logical name and that property's `description` carry it. Each term is its own list item. A business keeps that reading in its own schema, because the same word can mean different things in different businesses.

Keep a mapping file separate from the schema. The mapping is a plain JSON object. It binds each logical field to the current Notion property name in the target database, and it identifies the data source for that run. `aliases` lists former names of that data source. `property_aliases` lists former names of a property, keyed by the logical field, when that former name differs from the current property name. Schemas live under `.agents/schemas/`. Mappings live under `.agents/mappings/`. Those two directories are a convention of this repository, not a market standard. One mapping file covers one data source for one deployment.

Another business replaces the mapping. The schema stays.

The MCP does not call Notion. It calls a task port, and that port is what writes. See `docs/adr/0002-keep-task-storage-behind-a-port.md`. Deterministic constraints are checked against the schema before an insert or an update. When the check fails, the write does not happen. A skill holds the generative guidance only. It does not repeat the property list.

Do not add a schema for a database the connected workspace cannot read. Do not invent its fields.

## Consequences

Deterministic checks run in the MCP, outside the model. Notion's AI does not reload those rules as skill text.

Another business edits the mapping. It does not edit the logical schema or the skill to rename properties.

The schema and the mapping can drift. A field in one file and missing from the other is a mistake the MCP must reject.

Schemas and mappings of a data source live in the business harness that reads that data source, not in the core harness.
