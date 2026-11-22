# 22. Match expressions in classify-text

Date: 2026-11-22

## Status

Accepted. Amends ADR 0016 and ADR 0021: `classify-text` also reads the glossary rows of more than one word, and applies the context tags to them as it does to a word.

## Context

`classify-text` split a text into tokens and classified each one on its own. A glossary row of more than one word, such as a forbidden phrase, never matched: each word came back `not_registered`, and a draft that used the phrase passed the check of the whole text. The tools told the writer to read an expression with `lookup_terms`, but that depends on the writer listing every expression before drafting. A forbidden phrase the writer did not think to list went through, and the person found it when reading the message.

## Decision

`POST /v1/classify-text`, the `classify-text` command, and `classify_text` return a second list, `expressions`, next to `words`.

- `words` does not change. It has one item per token, in order.
- An item of `expressions` is a glossary row of more than one word that the text uses. It has the fields of a word, with the matched text in `submitted`, and `start` and `end`: the index of its first token in `words` and the index after its last.
- A row is found as a run of tokens. Casing and spacing do not matter, as in `lookup`, and an accent still tells two spellings apart. Punctuation is a token, so a row that has a comma matches a text that has it.
- Two expressions that overlap are both listed, in the order of the text and the longer one first when they start at the same token.
- The level follows the rules of a word: the tags of the read hide a row of another speaker, event, or channel, `forbidden_in` and `allowed_in` change the level with `base_state` keeping the stored one, and a `case_sensitive` row says whether the casing matches.
- A text without an expression returns an empty list.

## Consequences

The new field is always present and `words` is as before, so a consumer that reads only `words` keeps working, but it does not see an expression. A consumer that checks a draft reads both lists.

`lookup_terms` stays for what it does: read the whole row of an expression the writer plans to use, before drafting. `classify-text` is the check after drafting, which no longer depends on the writer listing the expressions.

The search tries every window of tokens, up to the number of tokens of the longest row of the glossary, so the cost grows with the length of the text and of that row.
