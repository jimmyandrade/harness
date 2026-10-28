# 19. Let rows share a source

Date: 2026-10-28

## Status

Accepted. Replaces the part of ADR 0010 that made an upsert find a renamed term by `source`, and the part of ADR 0012 that made `source` unique per row.

## Context

`source` says where a row came from, such as the URL of a message or a page. One message often gives more than one term, so several rows have the same `source`. A batch with two such rows was refused, and a term that was not stored yet but shared a `source` with a stored row was taken for that row renamed: an insert left it out as already stored, and an upsert overwrote the other row.

## Decision

`source` only records the origin. Rows may share it, in one batch and across calls, and it never decides which row a write changes. A write finds a row by its spelling and its tags, as ADR 0017 says. A term renamed in another tool is a new row.

## Consequences

- Rewriting a migration of a renamed term no longer moves the old row. The old row stays until it is removed.
- The refusal "The source of ... is duplicated." is gone.
- If a stable identity for imports is needed, it gets its own field, not `source`.
