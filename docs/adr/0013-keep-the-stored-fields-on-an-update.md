---
locale: en
---

# Keep the stored fields on an update

## Status

Accepted. It supersedes the sentence in ADR 0012 that an `upsert` without `notes` clears them.

## Context

`update` and `upsert` replaced the whole row with the fields of the call. A call that sent only a `reason` erased the `description`, the `notes`, the `categories`, and `decided_by` of the row, with no warning. Five rows lost their history this way when an agent filled the missing `reason` of each one.

The loss was easy to cause and hard to see: the response listed the term as updated, and the row that came back had only what the call sent. The `terms` command made it worse, because it started every term with an empty list for each list field, so a call that named no list still cleared them all.

## Decision

An `update` or an `upsert` of a term that is in the glossary keeps every field the call does not send. The call names `state` and `term` and only the fields that change. A field sent empty, as `""` or `[]`, is cleared, and `case_sensitive: false` clears that flag. `insert` still leaves a term that is already there.

The merged row is checked as a whole. A call that moves a row to a level that refuses a stored field, such as `when` on `allowed`, is refused and writes nothing, until the same call clears that field. A missing expected field is reported in `incomplete` for the merged row, so a stored `description` is not reported as missing when the call sends only a `reason`. A row whose merged fields already match is `unchanged`, and the file is not written.

The schema records which fields a call sent in `given`, because a default of `[]` cannot tell an omitted list from an empty one. The `terms` command builds a list only when a flag names it, and a flag with an empty value, such as `--notes ""`, clears that field. The `write_terms` description says all of this to an agent, and each updated row in the response is the whole stored row, so a caller can see what is stored after the write.

## Consequences

A correction that names one field is safe, and a person can read the response to confirm what the row holds. A caller that relied on an omitted field to clear it must send the field empty. `definir-vocabulario` reads the row before a correction and again after it, so an older server that still replaces the row is caught and the stored row is written back.

A call that changes the level of a row can now be refused for a field the call never sent. The message names the term and the rule, and the fix is to clear the field in the same call.
