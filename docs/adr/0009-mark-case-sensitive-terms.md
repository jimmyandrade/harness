---
locale: en
---

# Mark case-sensitive terms

## Status

Accepted.

## Context

Every read folds case, as ADR 0003 decides: `Casa` at the start of a sentence finds the row `casa`. Every write stores a new term in lowercase. That is right for ordinary words, and it is wrong for a name whose casing is part of the spelling, such as `iPhone` or `eBay`.

For those names the only place to say the casing was the free text of `description`. A read of `Iphone` returned the row with `exists: true` and nothing that said the casing was off, so an agent could keep the wrong form. A new brand name written through `write_terms` landed as `iphone`, and the key had to be fixed in the file by hand.

Two designs were weighed.

- A case-sensitive read: `Iphone` would read as absent. A writer would no longer see the brand row at all, and could register a second row for the same name. Case would stop being one term, against ADR 0003.
- A flag on the row. The read still finds the row in any casing, and the row says that its casing counts. The write keeps the casing of a flagged term.

## Decision

Any row may keep `case_sensitive: true`. The file omits it when it is false, and a row without it behaves as before.

A read still folds case to find the row. When the row is case-sensitive, `POST /v1/lookup` and `lookup_term` also return `case_sensitive: true` and `case_matches`, false when the submitted casing differs from the stored term. `term` already holds the stored spelling. An accent that does not change the letter is not a casing difference.

`POST /v1/exists` and `exists_in_text` keep `true` and `false` for every token. A token that only matches a case-sensitive row in another casing maps to `{ "exists": true, "term": "iPhone", "case_matches": false }` instead. The object is truthy, so a reader that only checks existence reads it as before.

A term in `POST /v1/terms`, `write_terms`, and the `terms` command may carry `case_sensitive`, false by default. A new term written with it keeps its casing as the key instead of being lowercased. An existing row of the same spelling, apart from case, takes the new casing as its key, and the links of other rows follow it. The flag is a field of the row, so `upsert` without it clears it, as it clears an empty `tags` list. The `terms` command takes `--case-sensitive` after the term it marks, alone or with `true` or `false`.

The single routes `POST /v1/allowed`, `/v1/forbidden`, and `/v1/situational` take the same `case_sensitive` field and keep the casing of a flagged term. They still refuse a term that is already in the file.

`POST /v1/classify` and `POST /v1/classify-text` return `case_sensitive` and `case_matches` for a word that matches a flagged row, as `lookup` does.

## Consequences

An agent that reads `Iphone` learns the stored spelling and that the casing is wrong, without the description.

A brand name is written once, with its casing, through the same write. Hand edits of the key are no longer needed.

Ordinary words keep matching in any casing. A glossary marks only the names whose casing counts, as a separate change in each project.

The value of `exists` is no longer always a boolean. A reader that compares it with `=== true` treats a casing mismatch as absent, and needs to read the object.
