---
locale: en
---

# Record the day a level was decided

## Status

Accepted.

## Context

A row keeps who decided its level in `decided_by`, but not when. The day ended up in `notes`, often next to the name that `decided_by` already holds, or in `description` and `source`, where it does not belong. `description` says what the term is, and `source` is where the row came from, unique per row. A reader could not sort, filter, or audit decisions by date.

## Decision

Any row may keep `decided_at`: the day its level was decided, as an ISO 8601 calendar date, `YYYY-MM-DD`. A write refuses any other form, such as `23/10/2026`, a date that does not exist, or a date with a time. The file omits it when empty.

`decided_at` follows `decided_by`. `POST /v1/lookup` and `lookup_term` return it. `POST /v1/terms`, `write_terms`, and the `terms` command take it, and the `terms` command takes `--decided-at`. An `update` or an `upsert` without it keeps the stored one, as ADR 0013 decides for every field, and two rows are unchanged only when it matches.

`notes` keeps the history that no field holds. It does not repeat who decided or the date.

## Consequences

A glossary can answer who decided a level and when without parsing free text. A row written before this field has no date until the next write that sends one.
