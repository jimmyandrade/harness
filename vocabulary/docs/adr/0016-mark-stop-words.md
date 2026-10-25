---
locale: en
---

# Mark stop words

## Status

Accepted.

## Context

Articles and prepositions such as "o", "no", "do", and "pelo" are stop words: function words that carry little meaning alone. Whether one is right or wrong depends on the words around it. "no" is neither allowed nor forbidden by itself, while "no" before a feminine brand name is wrong, so that phrase is its own row with a level. The glossary had no way to say a word is a stop word, and every row needed one of the five levels, so a stop word could only be stored with a level it does not have.

A reader that receives a phrase also needs to tell its stop words apart from the words that carry the message.

## Decision

Any row may keep `stop_word: true`. A stop word may omit `state`; a row without `state` must be a stop word, and any other row still needs a level. A stop word may also keep a level when the brand has a rule for the word alone.

A stop word without a level is stored as `{ "stop_word": true }`. Inside the engine it reads as allowed, so the rules that depend on a level do not change, but it is written and returned without a state. `POST /v1/lookup` and `lookup_term` return `stop_word: true` and no `state`. `POST /v1/classify` and `POST /v1/classify-text` return `to: "stop_word"` for it, and `stop_word: true` for any stop word. `POST /v1/exists` still reports that it exists.

`POST /v1/terms`, `write_terms`, and the `terms` command take `stop_word`, and the `terms` command takes `--stop-word`. An update or an upsert without a state keeps the stored level, or its absence.

## Consequences

A phrase can be split into stop words and meaningful words with one classify-text call. The rule for a stop word inside an expression stays on the expression, such as a forbidden phrase that contains it.
