# 21. Apply context tags to classify-text

Date: 2026-11-04

## Status

Accepted. Amends ADR 0008 and ADR 0010: `allowed_in` and `forbidden_in` change the level of a row for a read that carries their tags, and now `classify-text` reads them too.

## Context

`lookup` already returned the level of a row for the tags of a read, with `base_state` keeping the stored level. `classify-text` took `tags` but only used them to hide rows tagged for other contexts. A term with `forbidden_in: ["review"]` came back with its stored level for a text read with the tag `review`, so a writer that checked a whole draft never saw that a word was forbidden in the format of that draft.

## Decision

The context of a text is passed as `tags`, as for every read. A format or a channel, such as `review` or `chat`, is a tag. There is no second parameter.

`POST /v1/classify-text`, the `classify-text` command, and `classify_text` apply the context to each word, as `lookup` does:

- A tag in `forbidden_in` makes the word `forbidden`, and wins over a tag in `allowed_in`.
- A tag in `allowed_in` makes the word `allowed`.
- `to` is the level for that context, and `base_state` keeps the stored level when it differs.
- A word that the context makes `forbidden` also returns the `reason`, the `when`, and the `alternatives` of the row, and `recommended` as before.
- Without tags, or with tags that the row does not name, the response is the same as before.

## Consequences

The new fields are optional, so a consumer that ignores them reads what it read before. A consumer that tests `to` for an avoided level now sees it for a word that the context forbids, which is the point.

`POST /v1/classify`, which classifies one word without tags, does not change.
