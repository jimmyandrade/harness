---
locale: en
---

# Keep one row per set of tags

## Status

Accepted. It replaces the sentence of ADR 0003 that a term keeps one state in its file, and the reason ADR 0008 gave from it.

## Context

The glossary kept one row per spelling. A write looked a term up by its spelling alone, so a spelling that already had a row tagged for one context answered `Already in the glossary` to every other write of it. A writer could not store a general rule for a word that already had a row for one speaker, channel, or event. A word that is discouraged in one context and allowed elsewhere did not fit one row either.

The read already filtered rows by tags, as ADR 0008 decides. Only the write and the file ignored them.

## Decision

A row is its spelling and its set of tags. The same spelling may keep more than one row, one per set of tags. Two rows with the same set, in any order, or both without tags, are the same row. Case folds and an accent does not, as ADR 0011 decides.

### File

A spelling with one row keeps an object, as before. A spelling with more than one row keeps a list of objects, the row without tags first and the tagged rows in the order of their tags. A file written before this decision reads and writes back unchanged, and a value becomes a list only when a second row appears. A list with two rows of the same set, or an empty list, is refused.

```json
{
  "good morning": [
    { "state": "allowed", "description": "greeting", "reason": "warm" },
    { "state": "discouraged", "description": "greeting", "when": "only after noon", "tags": ["channel-a"] }
  ]
}
```

### Write

`write_terms`, the `terms` command, and `POST /v1/terms` find the row by the spelling and the tags of the call:

- A call that sends `tags` writes the row with that same set. `tags: []` is the row without tags.
- `insert` without `tags` is the row without tags. `Already in the glossary` holds only when the spelling and the set both match.
- `update` and `upsert` that omit `tags` keep the stored fields, as ADR 0013 decides. When the spelling has one row, they write that row and keep its tags. When it has more than one, they write the row without tags.
- `update` never adds a row. With tags that no row has, it changes the tags of the only row of the spelling, and skips a spelling with more than one row as `Not in the glossary with these tags.`
- `insert` and `upsert` with tags that no row has add a row.

A batch may hold several rows of one spelling with different sets, and refuses two with the same set.

### Read

`lookup`, `lookup_terms`, and `exists_in_text` keep the filter of ADR 0008, and then resolve the rows of one spelling:

1. With tags, the rows whose tags meet the read win over the row without tags. When more than one wins, all of them come back, in the order of the file.
2. Without such a row, the row without tags comes back.
3. A read without tags of a spelling that has only tagged rows sees every one of them, as before.

`lookup` returns the fields of the first winning row, and `rows`, with every winning row, when more than one wins. `exists_in_text` answers for the spelling, so it does not change. A read without tags and the classify routes prefer the row without tags.

### Links

`examples`, `rejected`, `alternatives`, and `related` name a spelling, not a row. A reader resolves a link with the tags of its own read, by the same precedence. A link that names a spelling with only rows for other contexts still points at it, so the write does not refuse it. A rename moves the links only when no other row keeps the old spelling.

## Consequences

A general rule and a rule for one context can share a spelling. The same word can hold a different level in each context.

A correction of a tagged row on a spelling with more than one row sends the tags of that row. Without them, it writes the row without tags. `definir-vocabulario` and `gravar-termos-no-vocabulario` read the row first, so they have its tags.

`update` can no longer change the tags of a row when its spelling has more than one row. Changing them means writing the row with the new set and leaving the old one for a person to remove by hand.

A caller that reads only the top-level fields of `lookup` sees one row, as before. A caller that needs every row of one context reads `rows`.
