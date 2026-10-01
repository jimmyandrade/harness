---
locale: en
---

# Store the brand glossary as JSON

## Status

Accepted

## Context

The vocabulary endpoint classifies a word or an expression for the language of the text. Each language has its own file. A term keeps one state in that file: allowed, forbidden, or situationally allowed. The same spelling can have a different state in another language.

The endpoint is TypeScript, so a person can read it and the same module can run in Node and in the browser. The first file format was TSV. Reading it meant splitting lines, accepting either newline, checking a header, and splitting columns. JSON.parse and JSON.stringify are part of the language. They remove that parser.

Crowdin and Transifex glossaries are a different file. Crowdin accepts TBX, CSV, and XLSX. Transifex accepts CSV. Those rows pair a source term with a translation. This glossary stores a state for the language of the text, so one row is not a translation of another language's row.

## Decision

Store each language as one UTF-8 JSON file under `api/glossary/`. The file name is the BCP 47 tag: `pt-BR.json`, `en.json`, `de.json`, `ja.json`, and `fr.json`. Another language is another file. A lookup opens only the file for the language of the text.

The file is a JSON object. Each key is the term, so a search opens that property. Each value is an object with `state`, and, when the row has one, `alternative`. The key is not repeated inside the value. `state` is `allowed`, `forbidden`, or `situationally_allowed`. `alternative` is the recommended term for `forbidden`, and the always-allowed term for `situationally_allowed`. An `allowed` row omits `alternative`. An absent alternative is omitted, not `null`.

A forbidden row registered with a category also has `category`, `description`, `substitution`, `rejected`, and `alternatives`. `category` is an English word, such as `punctuation`. `description` is the short name. `substitution` says what to use instead. `rejected` and `alternatives` are arrays of terms in the same file. A missing rejected example is created as `forbidden`. A missing alternative is created as `allowed`. An example that already exists keeps its row and is linked by its stored term.

An allowed row registered with a category also has `category`, `description`, `reason`, and `examples`. `description` explains the word. `reason` says why to use it. The two stay apart. `examples` is an array of allowed terms in the same file. A missing example is created as `allowed`. An example that already exists keeps its row and is linked by its stored term. An allowed row still omits `alternative`.

A situationally allowed row registered with a category also has `category`, `description`, `when`, and `examples`. `when` says when to use the term. `examples` is an array of terms in the same file. A missing example is created as `situationally_allowed`. An example that already exists keeps its row and is linked by its stored term. The row still omits `alternative` when it has none.

`POST /v1/terms` writes many of these rows for one language in one pass. The body has `language`, `mode`, and `terms`. `mode` is `insert`, `update`, or `upsert`. Each term has `state` and the fields of that state. `insert` writes a term that is absent and leaves a term that is already in the file. `update` rewrites a term that is present and leaves a term that is absent. `upsert` writes every term. The write searches first. Case, accents, and a plural or singular form are the same term, so they do not create a second row. A row whose fields already match is `unchanged`. A different field updates that row. A term sent in full stays in full when another term in the same request links it. A missing example that is not itself in the request is created as it is for a single registration. One failure rejects the request and leaves the file unchanged. The stored spelling stays when the match differs by case, accent, or plural.

The keys stay in alphabetical order. The sort key folds case, maps German ß to ss, and compares the base letters before the accents. `register` rewrites the file in that order. A file that is not JSON, is not an object, repeats a term, or breaks that order is rejected.

The runtime file stays JSON. A Crowdin or Transifex upload is an export to the format that platform accepts. That export is a separate step. It does not replace this file.

## Consequences

`load` reads the file with `JSON.parse`. `register` writes it with `JSON.stringify`. The line parser is gone.

A person edits JSON. The key is the term, so a search opens that property. The keys stay in alphabetical order.

Adding a language adds a file. It does not change the shape of the other files.

Sending the glossary to Crowdin or Transifex needs an export. Uploading these JSON files as if each term were a translation would collapse two states of the same spelling into one row.

The `terms` command and the vocabulary MCP tool `write_terms` call this same write. They do not keep a second glossary.

`POST /v1/lookup` reads one term and returns whether that spelling exists and the stored row. Case and an accent that does not change the letter return that row. A plural, a gender, and another word do not. When the same word is already stored twice, the read names those rows and suggests which one stays. `POST /v1/exists` reads a text and returns only a record of each token to whether that spelling exists. The MCP tools `lookup_term` and `exists_in_text` call those same reads.

A write that meets two stored spellings of the same word refuses the batch, names the rows, suggests which one stays, and leaves the file unchanged. The `terms` command and `write_terms` return that same refusal. They do not delete or merge those spellings. A plural, a gender, and another word are written as their own rows. A term that is not already in the file is stored in lowercase. The stored spelling of an existing row stays. On a new forbidden row, the terms the person chooses as replacements are `alternatives`. The person is asked before those terms are written. An empty list is valid. Every state may also keep `related`, a list of other registered terms. A pointer to a term that is not registered is refused. The file stays unchanged.

An emoji, a joined emoji, and a symbolic use are terms in that same file. The state is the permission. The description and the examples hold when to use the emoji or avoid it. Classification and the text existence read treat that emoji as one token. They do not skip it as decoration. A forbidden row keeps a bad example in `rejected`. A request that puts that example in `examples` is refused.

`allowed` and `forbidden` are general rules. A request that also carries `when` is refused, on the single routes and on the batch. A term that only fits one situation is `situationally_allowed`. The command and `write_terms` return that same refusal.

`description` explains the word. On an allowed row, `reason` says why to use it, and the two stay apart. A context example stays in `examples`. A prohibition reason on a forbidden row stays in `description`. A voice note stays on the field that already holds it. A longer example the person asked to document stays in `examples`. The vocabulary is this JSON file. A gender, a number, and another spelling are separate rows. Reading one of them does not invent the others. A missing form stays unregistered until the person chooses whether it is forbidden, situational, or allowed. Category `cliche` is forbidden. The description says to replace the literal word with an image, a scene, an action, an effect, or a situation that carries the same feeling. A phrase to avoid stays in `rejected`. A recurring variation is its own forbidden row, linked in `related`. An allowed or situational cliché is refused. A phrase discarded for an undesired reading is its own forbidden row. The rejection reason stays in `description`. An alternative keeps desire, urgency, and natural conversation, and does not say the chance is already gone.
