---
locale: en
---

# Validate the vocabulary API with Zod

## Status

Accepted

## Context

The vocabulary API checks a request body and a glossary row before it classifies or writes a term. Those checks were written by hand: a field is a string, a list is an array, a category is an English word, whitespace collapses. The TypeScript types were written again beside the checks.

[Zod](https://zod.dev/) is a TypeScript-first schema. Parsing a value with the schema also infers the type. Zod 4 runs in Node and in the browser, which is where this API runs. The package has no further dependencies.

Notion data sources stay on JSON Schema, as in `docs/adr/0001-describe-data-sources-with-json-schema.md`. That schema describes a logical record and a mapping binds it to Notion. It is not the runtime check for this API.

## Decision

Zod is the schema for the vocabulary API. A request body and a glossary row are schemas in `api/shared/schema.ts`. The TypeScript type of that value is inferred from the schema. A failed parse becomes the API error for that field.

A new endpoint adds its request schema there and reads the body through that schema. The type of the body is not declared a second time.

JSON Schema remains the description of a Notion data source. Zod does not replace it.

## Consequences

`zod` is a runtime dependency. The API imports it from `zod`.

Request checks and glossary-row checks share one collapsing rule for text. A category is still an English word, stored in lowercase.

The hand-written field checks on the request routes are gone. Rules that compare two terms, such as alphabetical order, a duplicate, or an allowed term that carries an alternative, stay next to the glossary write.
