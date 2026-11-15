# 22. Fill rows that hold no decision

Date: 2026-11-15

## Status

Accepted. Adds a fourth mode to `write_terms`, the `terms` command, and `POST /v1/terms`. It does not change `insert`, `update`, or `upsert`.

## Context

Importing a batch from another source, such as a Notion database, with `upsert` rewrote every row it named. A row that a person had decided, with `decided_by` and `decided_at`, took the fields of the source, and the decision was gone with no warning. In one import of about 500 terms, three rows held a decision that the source contradicted, and the only protection was a lookup of every term before the write, written again for each batch.

The glossary also makes a row on its own for each example, alternative, and related term that a write names and that is not stored yet. Such a row has a level and no decision, and the import is the first chance to give it a description. `insert` leaves it empty, because the term is already there, and `upsert` cannot tell it from a decided row.

## Decision

`fill` is an `upsert` that never touches a row that holds a decision. A row holds a decision when it has `decided_by` or `decided_at`.

- A term that is absent is written, as in `upsert`.
- A row without a decision is filled, as in `upsert`: it keeps every field the call does not send, and the fields the call sends replace the stored ones.
- A row that holds a decision is left as it is and listed in `skipped`, with the reason "The row holds a decision." It is also left out of the checks of the batch, so a level the source gives it cannot refuse the write, and it is not listed in `incomplete`.
- The row is chosen by its spelling and its set of tags, as ADR 0017 decides. A call whose tags match no row writes a new row, so a tagged row of a source never collides with a decided row that has other tags.

## Consequences

An import can run over a glossary that people have edited and cannot undo their decisions. `skipped` becomes the list of conflicts that a person has to settle, and a writer settles one with an `update`, after asking.

A caller that wants the source to win still uses `upsert`. `fill` does not report what differs between the source and the decided row. A later `diff` command can.
