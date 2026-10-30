# 20. Delete rows by spelling and tags

Date: 2026-10-30

## Status

Accepted. Replaces the last sentence of the Consequences of ADR 0017, which left a row for a person to remove by hand.

## Context

The glossary could be read and written but never shrunk. A wrong row, or a tagged row that a general row replaced, stayed in the file until a person edited it by hand, and every writer had to ask for that. The only way to move a row between sets of tags was to write the row with the new set, which ADR 0017 leaves as a second row when the spelling already has one.

## Decision

A new operation deletes rows. The MCP tool `delete_terms`, the `delete` command, and `POST /v1/delete` take a language, `terms`, and an optional `dry_run`. Each term is a spelling and, optionally, a set of tags:

- A row is chosen as in a write, by its spelling and its set of tags, as ADR 0017 decides. `tags: []` is the row without tags.
- A term without `tags` takes the only row of the spelling. A spelling with more than one row is refused, and the refusal lists the tags of each row, so the caller chooses.
- A spelling or a set of tags that no row has is skipped, with the same reasons as an `update`.
- The last row of a spelling is refused while another row still names it as an alternative, a rejected example, an example, or a related term, and the refusal lists the rows that name it. A link names a spelling, as ADR 0017 says, so the delete also passes when another row of that spelling stays, or when the rows that name it go in the same batch. This keeps a link from pointing at a term that is gone, which a write already refuses.
- A batch with a problem deletes nothing, and the refusal lists every problem with its term. With `dry_run` true nothing is written, and the response lists what would be deleted, skipped, and refused.
- The response returns each deleted row whole, as a write returns an updated row, so a wrong delete can be written back with `insert`.

Taking the tags off a row is not a new operation. An `update` with `tags: []` already does it when the row is the only row of its spelling, as ADR 0017 decides. When the spelling already has a row without tags, the tagged row is deleted instead, because the two would be the same row.

## Consequences

A caller can now remove a row it wrote by mistake, or a tagged row that a general row replaced, without editing the file.

The delete never clears a link on its own. A caller that wants to remove a term that other rows name first clears those links with an `update`, then deletes. This is more steps, and it is the only way a delete cannot leave a broken link or silently change a row the caller did not name.

A delete of the last row leaves an empty glossary, `{}`, as `init` creates it.

`delete_terms` is a write tool, so `BLOCK_WRITE_OPERATIONS` blocks it with the others.
