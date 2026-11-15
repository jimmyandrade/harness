# 23. Review the glossary with audit and diff

Date: 2026-11-15

## Status

Accepted.

## Context

After a large import, the only way to review the glossary was a script written for the occasion. One checked whether an example held a term that another row forbids. Another listed the rows that lacked a description or a reason. A third compared two versions of the file, because the file is sorted and a text diff of a rewritten glossary shows hundreds of lines for a few changed rows. Each was written again for every review, and each found things that no write had refused: a row validates alone, and a contradiction between two rows is not a problem of either.

## Decision

Two read-only operations review a glossary.

- `audit`, for one language, lists findings in the order of the rows. A row that is not forbidden is flagged when an example, an alternative, or its substitution holds, as a whole word, a term that a row without tags forbids. A row that records a decision is also flagged for each field its level expects and lacks. A row without a decision is not listed for that, because the rows the glossary makes for an example or an alternative are incomplete by design; they are counted instead. A forbidden row's examples are bad examples, so they are not checked. The response also counts the rows, the rows that record no decision, and the findings.
- `diff`, for one language, compares the glossary with the one in another directory. Rows are matched by spelling and set of tags, as a write matches them, and each changed row lists the fields that differ. It answers the rows added, removed, and changed, and how many stayed.

`audit` is the command `audit`, the MCP tool `audit_glossary`, and `POST /v1/audit`. `diff` is only the command `diff`, with `--against` naming the other directory. A tool or an endpoint that read a path from its caller would let a caller read any directory the server can, so `diff` stays where the person who runs it names the path.

## Consequences

A review after an import is one command, and the findings are a list a person can settle one by one. `audit` does not say which side is wrong: a finding names the row and the forbidden term, and a person decides whether the example or the ban changes.

`audit` flags a term that a row without tags forbids even where a tagged row allows it, so a context rule can show up as a finding. A later change can pass the tags of a context to `audit`, as `lookup` does.
