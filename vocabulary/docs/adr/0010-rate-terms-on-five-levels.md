---
locale: en
---

# Rate terms on five levels

## Status

Accepted. Amends `docs/adr/0003-store-the-brand-glossary-as-json.md` and `docs/adr/0008-tag-situational-terms.md`. The deprecated state `situationally_allowed` and the deprecated field `category` are still read and accepted until a later release removes them.

## Context

A project wants to move a glossary it keeps in another tool, such as a Notion database, into its JSON glossary without losing a row. The engine stopped that move in three places.

- **States.** A row had one of three states: `allowed`, `situationally_allowed`, or `forbidden`. Such glossaries often rate a term on five levels, from "never" to "always", with two levels of avoiding and one of allowing with care in between. Three states collapse two of those levels into the others.
- **Required fields.** The write refused a term without `description` in every state, an allowed term without `reason`, and a forbidden term without `substitution`. A legacy glossary often has one free-text note instead of a description and a reason, some rows without it, and most avoided rows without a substitution. The project decides to move every row anyway, and to fill the gaps later. The skills infer what is missing when they write.
- **Fields with no place.** A legacy row may say in which formats or channels the term is allowed or vetoed, who decided, where the row came from, and several classifications. None of them fit a field. `category` held one English word.

## Decision

### Five levels

`state` is one of five levels, ordered as a rating from 1 to 5:

| Level | Rating | `when` | `examples` | `substitution` | `rejected` | `alternatives` | `tags` | Use in a text |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `forbidden` | 1 | refused | refused | expected | accepted | accepted | refused | Never |
| `strongly_discouraged` | 2 | optional, the exception | refused | expected | accepted | accepted | accepted | Replaced, unless the person asks for the term or the exception in `when` holds |
| `discouraged` | 3 | expected | accepted, the scene | optional | accepted | accepted | accepted | Only with the scene and context that `when` describes |
| `allowed_with_care` | 4 | expected | accepted | refused | accepted, the misuse | optional | accepted | As `when` says |
| `allowed` | 5 | refused | accepted | refused | refused | refused | refused | Always |

`forbidden` and `allowed` stay general rules, as ADR 0003 and ADR 0008 decide: they take no `when` and no `tags`. `forbidden` and `strongly_discouraged` take no positive `examples`. A bad example stays in `rejected`. `reason` says why to use a term, so only `allowed_with_care` and `allowed` take it. Why to avoid a term stays in `description`. `description` and `reason` may not say the same thing. A cliché is still `forbidden`.

A missing example is created at the level of the row that names it. A missing rejected example is created `forbidden`. A missing alternative is created `allowed`. `alternative`, the single recommended term of ADR 0003, is still read. It is the recommended term of an avoided level, and the always-allowed term of `allowed_with_care`.

### The three states that came before

| Before | Now |
| --- | --- |
| `allowed` | `allowed` |
| `forbidden` | `forbidden` |
| `situationally_allowed` | `allowed_with_care` |

`situationally_allowed` was a term that is allowed in one situation and keeps the rule of that situation in `when`. `allowed_with_care` is that same rule. A read of a stored `situationally_allowed` row returns `allowed_with_care` and `legacy_state`. A write that sends `situationally_allowed` stores `allowed_with_care` and returns a warning. A write of one term does not rewrite the other rows of the file. Every write that leaves a deprecated row in the file says so in `warnings` and suggests `migrate`.

`migrate`, in the command line, the MCP tool `migrate_glossary`, and `POST /v1/migrate`, lists the rows that use a deprecated state or `category`. With `write`, it rewrites them. Without it, the file stays as it is.

### Optional fields, then required again

`description`, `reason`, `substitution`, and `when` are optional while a project migrates. Each level expects some of them:

| Level | Expected |
| --- | --- |
| `forbidden`, `strongly_discouraged` | `description`, `substitution` |
| `discouraged`, `allowed_with_care` | `description`, `when` |
| `allowed` | `description`, `reason` |

The batch write takes `validation`:

- `optional` writes the term and does not report it;
- `warn`, the default in this release, writes the term and lists it in `incomplete`, with the missing fields;
- `enforce` refuses the batch and leaves the file unchanged.

A project moves to `enforce` once it fills what is missing. A later release makes `enforce` the default, as a breaking change.

### New fields

- `categories` is a list of English words, such as `slang` or `spirituality`. It replaces `category`. A row with `category` reads it as a list of one, and a request with `category` adds it to `categories`.
- `allowed_in` and `forbidden_in` are lists of formats or channels, written like tags, such as `whatsapp` or `feed`. A read that carries one of them changes the level: a tag in `forbidden_in` makes the row `forbidden`, and wins over a tag in `allowed_in`, which makes it `allowed`. `lookup` returns the changed level in `state` and the level of the row in `base_state`. They fit any level, including `forbidden` and `allowed`.
- `decided_by` names who decided the level.
- `source` says where the row came from, such as the URL of a page. An upsert that does not find the term by its spelling finds it by `source`, renames the row, and moves the links of other rows to the new spelling. The URL may stop working after the migration. Two terms of one batch may not share a source.

The relation to other terms that a substitution often is stays in `alternatives`. The text of the substitution stays in `substitution`.

### Categories are not tags

`tags` say where a row exists, as ADR 0008 decides. A read with tags hides a row tagged only for other contexts. A classification such as `slang` in `tags` would hide that term from every text read with a channel tag. Categories stay in `categories`, which no read filters on.

A legacy glossary names its categories in its own language. The engine keeps English words, as ADR 0004 decides. The skill that registers terms translates them with a parameter of the project instructions, as ADR 0008 and ADR 0009 of the core harness decide. The parameter maps each name of the project to an English word.

### Batch import

`terms --file` reads a whole batch from a JSON file with the body of `POST /v1/terms`. `write_terms` already takes the whole list. With `upsert`, the response lists `inserted`, `updated`, `unchanged`, `skipped`, `incomplete`, and `warnings`. One failure still rejects the batch and leaves the file unchanged. Running the same import again leaves every row `unchanged`.

## Consequences

A legacy glossary rated on five levels moves without collapsing a level, and every row moves even when a field is missing. The response lists what to fill.

`classify` and `lookup` return one of five levels. A reader that compares `to` or `state` with `situationally_allowed` reads `allowed_with_care` instead, and `legacy_state` for a row still stored with the old name. The registration responses and the file carry `categories`, not `category`. These are breaking changes.

Existing glossaries keep reading as before until a person runs `migrate`. The steps are in `docs/runbooks/migrate-glossary.md`.

The single routes `POST /v1/allowed`, `/v1/forbidden`, and `/v1/situational` keep their required fields. `/v1/situational` writes `allowed_with_care`. A migration uses the batch write.
