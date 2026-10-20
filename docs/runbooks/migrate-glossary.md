---
locale: en
---

# Migrate a glossary

Two migrations use the same write: a glossary of this engine that still uses the three states, and a glossary kept in another tool. `docs/adr/0010-rate-terms-on-five-levels.md` holds the decisions.

Run the commands from the project that holds the glossary. With the MCP server instead of a terminal, `migrate_glossary` and `write_terms` take the same fields.

## A glossary with three states

1. See which rows still use `situationally_allowed` or `category`:

   ```bash
   node node_modules/vocabulary/dist/cli.js migrate --language pt-BR
   ```

   Check: `written` is `false`. `states` lists each row and its new level, and `categories` lists each row with `category`.

2. Rewrite them:

   ```bash
   node node_modules/vocabulary/dist/cli.js migrate --language pt-BR --write
   ```

   Check: `written` is `true`, and running the first command again lists nothing.

3. Repeat for each language file in `.agents/glossary/`.

4. Read the rows that became `allowed_with_care`. A row that only fits one context and is closer to avoiding can move to `discouraged` or `strongly_discouraged` in a later `upsert`.

## A glossary from another tool

1. Export the rows. Keep, for each row, the term, the level, the note, the classifications, the formats or channels where the term is allowed or vetoed, the replacement terms, who decided, and the address of the row.

2. Map the levels of that tool to the five levels: `forbidden`, `strongly_discouraged`, `discouraged`, `allowed_with_care`, and `allowed`.

3. Map each classification to an English word. Keep the map in the project instructions, as a parameter of the skill that registers terms, so the next import reads the same map.

4. Write one JSON batch with the body of `POST /v1/terms`:

   ```json
   {
     "language": "pt-BR",
     "mode": "upsert",
     "terms": [
       {
         "state": "strongly_discouraged",
         "term": "example",
         "categories": ["slang"],
         "description": "Why the term is avoided.",
         "alternatives": ["another term"],
         "forbidden_in": ["feed"],
         "decided_by": { "name": "Person name", "email": "person@example.com" },
         "source": "https://example.com/row/1"
       }
     ]
   }
   ```

   - The note of an avoided level goes in `description`. The note of an allowed level says why to use the term, so it goes in `reason`.
   - Replacement terms go in `alternatives`. A missing one is created `allowed`.
   - Formats and channels are lowercase kebab-case, as in `tags`.
   - Leave out a field the row does not have. Do not write an empty string.
   - `decided_by` is the people object of `package.json`: `name`, and optionally `email` and `url`. Use the individual e-mail of the person, never a shared role account.

5. Import it:

   ```bash
   node node_modules/vocabulary/dist/cli.js terms --file batch.json
   ```

   Check: the response lists `inserted`, `updated`, `unchanged`, `skipped`, and `incomplete`. A refusal names the term and leaves the file unchanged. Fix the batch and run it again.

6. Run the same import again. Check: every term is `unchanged`. A term renamed in the other tool keeps its row, found by `source`.

7. Fill what `incomplete` lists. When it is empty, run the write with `--validation enforce` so a new term without an expected field is refused.
