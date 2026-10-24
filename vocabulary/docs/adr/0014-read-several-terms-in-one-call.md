---
locale: en
---

# Read several terms in one call

## Status

Accepted.

## Context

`lookup` reads one term. Checking a plan of 13 terms before a write took 15 calls, one per term, because no call answered for the whole plan. `exists` takes a text, but it checks word by word, so it cannot tell whether an expression of more than one word, such as `quando puderem, dão uma olhada, por favor?`, is stored. The only call that read a whole expression was `lookup`, one expression at a time.

## Decision

A new read, `lookup-terms`, takes a language, a list of one to 100 terms, and optional tags. It returns the language and a `results` list, one per submitted term and in that order. Each result is exactly what `lookup` returns for that term, so a term of more than one word is read as a whole, a stored row comes back whole, a case-sensitive row says whether the casing matches, and a term tagged only for another context reads as absent. A repeated term gets its own result. The glossary is read once.

It is the same read in three places: `POST /v1/lookup-terms`, the `lookup-terms` command, which repeats `--term`, and the `lookup_terms` MCP tool. `lookup` and `lookup_term` do not change, so a caller that reads one term keeps its response shape. A separate route and tool keep each response shape fixed, instead of one that returns a row for `term` and a list for `terms`.

An empty list, a blank term, more than 100 terms, or an unknown language is refused, and nothing is read partly.

## Consequences

A caller that checks a plan, or the forms of a term, makes one call instead of one per term, and gets the stored rows in the same answer. `gravar-termos-no-vocabulario` and `procurar-variacao-de-termo` use it. The dry run of a batch in `insert` mode still tells which terms of a write already exist, and it also validates the batch; `lookup-terms` is the cheaper read when nothing is going to be written.

The limit of 100 terms keeps a request inside the 64 KiB body of the route. A list longer than that is read in more than one call.
