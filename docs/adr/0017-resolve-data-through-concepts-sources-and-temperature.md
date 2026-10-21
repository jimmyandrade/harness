---
locale: en
---

# Resolve data through concepts, sources, and temperature

## Status

Proposed. Extends ADR 0002 from tasks to every concept a skill reads or writes, and builds on ADR 0001 and ADR 0008.

## Context

The core skills that read data, such as the ones for people, calendar events, and spelling, were written against Notion. Their text says "the list of people, in the connected workspace", and they stop when that list is not there. That fits a business whose data lives in Notion. It does not fit the businesses this harness is also used in:

- One keeps its meeting minutes in Confluence. Another keeps them in Notion, and a third reads transcripts that a meeting tool writes to Google Drive. A person may also keep a collection of local files.
- Information about people is spread over Notion, Confluence, Slack, and files. A person works around that by keeping a local JSON file for each person. A command line tool searches it, so the agent does not load the files and spends fewer tokens.
- Some data changes slowly and some changes all the time. Who a person is, their role, their Slack ID, and how their name is spelled by speech recognition change rarely, and a hire, a departure, or a leave is an event, not a daily change. An event of the calendar or the status of a task changes all day. Reading both from the source of record on every run wastes tokens on the first kind.
- Some values must not be in a repository: a business may not allow it, or the values may be sensitive. A project cannot be the only place a skill reads its parameters from.
- Skill names were chosen while each skill was written for one business. Several of them no longer describe what they do.

ADR 0001 says each data source has a logical schema and a mapping to its store. ADR 0002 keeps task storage behind a port, with the store as an adapter. ADR 0008 keeps the values of skill parameters in the project instructions. ADR 0007 keeps skills that are partly shared in business harnesses, and prefers a generic core skill with parameters when the difference is only a value. None of them says how a skill chooses among several stores for one concept, or how it treats data that changes slowly.

## Decision

### A skill speaks in concepts

A core skill reads and writes concepts: person, meeting record, calendar event, task, issue. It never names a store, a database, a space, a folder, or a path. It follows the logical schema of the concept, as ADR 0001 decides. Notion stays fully supported, as one adapter among others.

### A project binds each concept to an ordered list of sources

The project instructions bind each concept to an ordered list of sources. Each source has:

- a type, which names its adapter, such as `cache local`, `Notion`, `Confluence`, `Google Drive`, or `Slack`;
- an address, such as a folder, a database, a space, or a page;
- a temperature, `fria` or `quente`, which the project sets for the concept and not for the source;
- for a cache, a freshness limit, after which its records count as stale.

The skill reads the list from its own entry in the project instructions, then from `Global`, as ADR 0008 decides, and then from the user-level instructions described below. It asks once and stops when a concept has no source.

### The port and the adapters

ADR 0002 keeps task storage behind a port that speaks the logical schema. The same decision applies to every concept: an operation to find, to get, and to write a record, shaped by the concept, and an adapter for each store. An adapter loads its own mapping, as the Notion adapter loads the Notion property mapping. The skill sees one port.

### A source is usable only where the agent can reach it

The agent runs in different places. In Claude Code, Codex, or Cursor it reads the local file system, so it reaches a local cache and the user-level instructions. The Notion agent does not: it can only query Notion, with a structured query or a semantic search. A source the runtime cannot reach is skipped, and the skill uses the next reachable source in the list. A cache is one source among the others, never a requirement.

- A Notion business that uses Notion as its database lists Notion alone. The skill reads and writes Notion directly, whether the agent runs in Notion or elsewhere, and no cache is involved.
- A business that lists a local cache and Notion gets the cache first from an agent that can read files, and Notion directly from the Notion agent. It is the same skill and the same instructions.
- The skill asks the port for an operation: find, get, or write. The adapter chooses the mechanism, a structured query or a semantic search for Notion, and the skill does not.

### Temperature decides the read, when there is a cache

Temperature only matters when a reachable cache is in the list. Without one, the skill reads the source of record every time, as above.

- **Cold data** is read from the cache first. The source of record is read only when the cache has no such record, when the record is older than the freshness limit, or when the person asks for a refresh. A refresh updates the cache.
- **Hot data** is read from the source of record on every run. A cache may hold it only for the length of one run.
- The same concept can be cold in one business and hot in another. The project decides.

### Writes go through to the cache and the source

A confirmed write updates the reachable sources of the list: the cache, when there is one, and then the source of record that the project names. A write from an agent that cannot reach the cache, such as the Notion agent, lands only in the source of record. The cache then lags, and its freshness limit or a refresh brings it back. A record that a person confirmed does not lose that value when a refresh reads something different: the refresh reports the difference and keeps the confirmed value until the person decides. The rule for a partial failure lives in the adapter, as ADR 0002 decides, and not in the skill.

### The cache

- It is local, outside any repository, and its location is a parameter. The core never holds its data.
- It is one JSON record per entity, validated by the logical schema, with a stable key. A person is keyed by email.
- A command line tool of the core searches the cache and refreshes it from a source, so an agent finds a record without loading the files. The tool is generic: it knows the schema and the adapter contract, and nothing about a business.
- A record carries where each value came from and when it was last confirmed. A value that the person confirmed is marked, and it outranks a value read from a source.

### One person record

Information about a person lives in one record, not in one store per skill. The record has the identity fields, which every skill shares, and optional extension blocks named after the skill or module that owns them, such as the voice that a skill writes in when it talks to that person, or the order in which that person's pull requests are reviewed. An extension never changes the identity fields. A skill that reads identity ignores extensions it does not know. Pronouns are written only with the source that declared them.

The existing local files, which keep identity, voice profiles, review priorities, and Slack groups in separate files, migrate into that record and into collections of the same shape.

### User-level instructions

A skill reads its parameters in this order: the project instructions, then the user-level instructions, then the default written in the skill. The user-level instructions are a file in the home folder of the person, with the same structure as the project instructions. They hold what a person keeps local, such as the values of a business that does not allow them in a repository, and the location of the cache. The Notion agent cannot read that file, so a Notion business keeps its values in the project instructions.

### Names before 1.0.0

While a skill is below 1.0.0, it may be renamed to describe its real scope. The former name goes in `metadata.aliases`, as `AGENTS.md` already requires for a rename, and the commit marks the breaking change. A skill does not keep a copy under the old name. A name that covers more than one scope, such as one skill for the guests of an in-person event and of an online meeting, is split.

## Consequences

A business that stores minutes in Confluence, Notion, Drive, or local files uses the same skill with a different list of sources, as ADR 0007 prefers when a difference is only a value. A business whose database is Notion keeps working exactly as today, with no cache, and the Notion agent keeps reading and writing Notion directly.

With a cache, cold data costs one local read in most runs, and the source of record is read in a refresh, not in each conversation. Without one, every read goes to the source, and the skill must still work.

The core gains an adapter contract and a cache tool to maintain. A new store is a new adapter, not a change to a skill.

Two stores can disagree. A confirmed value in the cache wins until a person decides, and the refresh says what differs.

The user-level file is a new place to look for a value. A person who reads a parameter from a project and from their home folder can be confused about which one applied, so the skill states where each value came from when it asks for a confirmation.

Several core skills need an audit against this decision: the ones for people, spelling, calendar, and guests read Notion directly. Each moves in its own pull request, with its schema and the Notion adapter first, so Notion businesses keep working.

## Open questions

- Which language and runtime the cache tool uses. The scripts of this repository are TypeScript on Node.js 24 and Python, and this decision does not choose.
- How a Notion business, whose agent cannot read the user-level file, shares values between projects.
- How a skill tells which source the runtime reaches: by a declared capability of the runtime, or by trying the source and falling back.
- Whether a collection that is neither cold nor hot, such as the review priority of a person, needs a third temperature or only a shorter freshness limit.
