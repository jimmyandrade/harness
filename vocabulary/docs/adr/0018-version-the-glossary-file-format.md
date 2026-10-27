---
locale: en
---

# Version the glossary file format

## Status

Accepted.

## Context

A glossary file did not say which format it was written in. `migrate` found an old row by its content, such as a deprecated state or the deprecated category, so a breaking change to the format had no version to migrate from. An engine behind the version a project pins, such as an outdated plugin, also read and wrote back a file of a newer format without noticing, and could drop fields it did not know.

The engine version is not the format version. It changes on every release, and writing it would change every language file on every write without a change to the format.

## Decision

A glossary file may keep `$schema` as its first key, with the address of the JSON Schema of its format: `https://raw.githubusercontent.com/jimmyandrade/harness/main/vocabulary/schemas/glossary-vN.schema.json`, where `N` is the format version. `$schema` is not a term. A file without `$schema` is format 1, which is every file written before this decision.

The format version goes up only on a breaking change to the file, and each version keeps its own schema file, which does not change after release. `vocabulary/schemas/glossary-v1.schema.json` describes format 1, and a test keeps its row fields equal to the fields the engine reads.

The engine reads a file up to the format it knows. A file of a newer format, or with a `$schema` that is not a glossary format, is refused on read and on write, and the refusal says to update the plugin or the dependency. Every write keeps the `$schema` the file had.

Adoption has two releases, so an engine that does not know `$schema` never meets it:

1. This release reads and keeps `$schema`, and refuses a newer format. No write adds it.
2. A later release makes `init` write `$schema` on a new file and `migrate --write` add it to an existing one. A project adopts it once every installation that reads its glossary, plugin and pinned dependency, is at least the first release.

A breaking change to the format then raises the version, adds its schema file, and teaches `migrate` to rewrite the previous version.

## Consequences

`migrate` can tell the format of a file from its first key instead of guessing from its rows. An outdated engine stops at a newer file instead of rewriting it. An editor or a CI job can validate a file against its schema without running the engine. An engine older than the first release fails to read a file that has `$schema`, which is why the second release waits for every installation to update.
