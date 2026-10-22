---
locale: en
---

# Tell terms apart by accents

## Status

Accepted. Amends `docs/adr/0003-store-the-brand-glossary-as-json.md` and `docs/adr/0009-mark-case-sensitive-terms.md`.

## Context

ADR 0003 made case and an accent that does not change the letter the same term. A write folded the accent and kept the stored row, and a read of the unaccented form returned the accented row. Only a mark that makes another letter, such as the cedilla of caça, kept two rows.

In Portuguese an accent often makes another word. `roles` is an English word that a brand avoids, and `rolês` is the slang for going out that the same brand uses. `pais` and `país`, `e` and `é`, and `avó` and `avô` are other pairs. A glossary migrated from another tool had both `roles` and `rolês`, at opposite levels, and the write refused the batch because it read them as one term.

## Decision

The spelling of a term keeps its accents. Only case folds.

- A write that sends a form that differs from a stored row only by case keeps that row, as before.
- A form that differs only by an accent is another term. It gets its own row and its own level. One batch may carry both.
- `POST /v1/lookup`, `lookup_term`, `POST /v1/exists`, and `exists_in_text` return a row only for the same spelling, apart from case. The unaccented form of a stored term reads as absent.
- Links in `examples`, `rejected`, `alternatives`, and `related` follow the same rule.
- Two stored rows can no longer be the same word, so the duplicate signal of the read and the refusal of the write that named two spellings and suggested one are gone. `lookup` no longer returns `duplicates` or `canonical`.
- `case_matches` of ADR 0009 compares the casing of the same spelling.

The sort key of the file still compares the base letters before the accents, so `roles` and `rolês` stay next to each other.

## Consequences

A brand can rate a word and its accented neighbour apart. A form typed without its accent, such as `voce`, is not found as `você`, and a write of it creates a new row. The skills say so, and they read the exact spelling before they write.

A glossary written before this change keeps its rows. A file that kept only the accented row of a pair now needs the other form written as its own term when the brand rates it.

This changes what a read returns and what a write creates, so it is a breaking change.
