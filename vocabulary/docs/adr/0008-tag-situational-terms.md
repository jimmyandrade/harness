---
locale: en
---

# Tag situational terms

## Status

Accepted. Amended by `docs/adr/0010-rate-terms-on-five-levels.md`: what this record says of `situationally_allowed` holds for `allowed_with_care`, `discouraged`, and `strongly_discouraged`, and `allowed_in` and `forbidden_in` change the level of a row for a read that carries their tags.

## Context

Some terms of a project only fit one context. A glossary may hold expressions that only apply when one person speaks in the first person, such as a stage introduction, and a chant that only applies at one event. Until now the only place for that context was `when`, the free text of a `situationally_allowed` row, such as "When Maria Silva speaks in the first person, in any channel."

`when` is the rule a person reads. An agent that writes a text for another speaker cannot filter on it. It reads every row, and a sentence that belongs to one speaker can end up in another speaker's text.

Two designs were weighed.

- One glossary per speaker or event, such as `pt-BR.maria-silva.json`. Every shared term would be repeated in each file, or a read would merge several files. The same spelling could hold one state in the main file and another in the speaker's file, and nothing would say which one wins. The glossary is one file per language because one spelling keeps one state in that language, as ADR 0003 decides.
- Tags on the row. One file per language stays the source of truth. A row says which contexts it belongs to, and a read filters by them. A tag is reused by every row of that speaker, event, or channel.

## Decision

A `situationally_allowed` row may keep `tags`, a list of short names of the speaker, the event, or the channel the term belongs to, such as `maria-silva`, `festival-de-verao`, or `palco`. A tag is lowercase ASCII, one word or kebab-case words. The write lowercases it and refuses a tag outside that form and a tag repeated in the same row. The file omits `tags` when the list is empty.

`when` stays required and stays the human rule. Tags do not replace it. They make the same rule filterable. A context that tags cannot say, such as "only with the audience", stays in `when`.

`allowed` and `forbidden` stay general rules. A request that gives either one tags is refused, as a request that gives either one `when` is refused. A term that belongs to one context is `situationally_allowed`.

A missing example of a tagged row is created as `situationally_allowed` with the same tags. An example that already exists keeps its own row.

`POST /v1/lookup` and `POST /v1/exists` take an optional `tags` list. Without it, a read sees every row, as before. With it, a read keeps the rows without tags and the rows that share at least one tag with the list. A row tagged only for other contexts reads as absent. The text names its speaker, its event, and its channel, so a writer passes all of them, and a row of any one of them applies.

The `terms` command takes `--tags`, repeated once per value. `lookup` and `exists` take `--tags` the same way. The MCP tools `write_terms`, `lookup_term`, and `exists_in_text` take the same `tags` field.

## Consequences

One file per language stays the only glossary. A shared term is written once.

A writer reads only the rows that fit the text. A sentence of one speaker does not reach the text of another.

A row matches when it shares any tag with the read. A term that needs two contexts at once, such as one speaker on one stage, keeps both tags for the read and says in `when` that both must hold.

Untagged situational rows still apply everywhere, so existing glossaries read as before. Adding tags to the existing rows is a separate change in each project.

A tag is a free name. The glossary does not keep a list of allowed tags, so the skill that registers terms reuses the tags already in the file for the same speaker, event, or channel.
