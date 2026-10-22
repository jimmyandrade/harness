---
locale: en
---

# Keep notes on a term

## Status

Accepted. The sentence that an `upsert` without `notes` clears them is superseded by ADR 0013.

## Context

A voice profile written before the glossary kept, for each term, an explanation that mixed three things: what the term is, when it applies, and where the decision came from, such as a date, a link, or what happened in a pull request. The glossary has a field for the first two, `description` and `when`. It has none for the third. Moving the profiles over put the history inside `description`, so the field stopped describing the term.

`source` names where a row came from, but it must be unique per row and an upsert uses it to find a renamed term, so it cannot hold free text. `reason` and `when` exist only on some levels, and `when` is refused on `allowed` and `forbidden`, which are general rules.

## Decision

Any row may keep `notes`: free text for the history of the term, who or what decided it, a date, a link, or a limit that `description` and `when` do not say. The file omits it when empty. `description` still says what the term is.

`notes` does not change the level and a read never uses it to decide a state. `POST /v1/lookup` and `lookup_term` return it. `POST /v1/terms`, `write_terms`, and the `terms` command take it, and the `terms` command takes `--notes`. It belongs to the row, so an `upsert` without it clears it, and two equal rows are unchanged only when `notes` match.

A formal or informal register is a category, not a field. What one person or channel says about a term goes in the record of that person or channel, or in `notes` while that record has no place for it.

## Consequences

A migrated profile keeps its history without turning `description` into a log, and an audit can compare the source with the glossary field by field.

`notes` is free text. A reader that needs a rule the engine can check keeps using the level, `tags`, `allowed_in`, and `forbidden_in`.
