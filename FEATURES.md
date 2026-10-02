---
locale: en
---

# Features

## Features

### harness-core
- **Stability**: experimental
- **Description**: Claude Code plugin with the shared skills and the vocabulary MCP
- **Properties**:
  - Manifest at `.claude-plugin/plugin.json`, listed in `.claude-plugin/marketplace.json` with source `.`
  - Skills come from `.agents/skills/`. Each one arrives after its audit
  - Starts the `vocabulary` MCP server through `api/mcp/launch.sh`, with `HARNESS_ROOT` set to the open project
  - A business marketplace lists it with a `github` source pinned to a tag
- **Test Criteria**:
  - [ ] Adding a business marketplace installs that plugin and `harness-core`
  - [ ] `lookup_term` reads the glossary of the open project

### criar-commit
- **Stability**: experimental
- **Description**: Commit finished work as atomic commits with a message in the project language and pattern
- **Properties**:
  - Skill at `.agents/skills/criar-commit/`
  - Reads the base branch, whether to commit without asking, the message language and pattern, and the test, build, and lint commands from the project instructions
- **Test Criteria**:
  - [ ] A project without test or build commands commits and says nothing was verified

### criar-pull-request
- **Stability**: experimental
- **Description**: Open, update, and merge a pull request without pushing to the base branch
- **Properties**:
  - Skill at `.agents/skills/criar-pull-request/`
  - Reads the repository, base branch, merge method, PR language, test and build commands, and push timing from the project instructions
  - Follows the pull request template of the repository when there is one
- **Test Criteria**:
  - [ ] A request to push to the base branch opens a pull request instead

### descrever-habilidade-ou-schema
- **Stability**: experimental
- **Description**: Write or correct a skill or schema description, and test whether a skill description triggers, even when the person does not say description
- **Properties**:
  - Lives at `.agents/skills/descrever-habilidade-ou-schema/SKILL.md`
  - Does not write the skill body, grade output quality, describe a product, or write the skill page in Notion
  - Starts every description with "Use essa habilidade sempre que", which is the objective the Notion router searches
  - Keeps the triggers in the description, because Notion automatic use loads that property and decides from it whether to load the skill
  - Requires a trigger suite with an obvious task and a paraphrased request that should load the skill, and an unrelated topic plus a near miss the skill does not cover that should not
  - On undertriggering, when the skill does not load, the person enables it by hand, or asks when to use it, adds detail and the technical term
  - On overtriggering, when the skill loads for an irrelevant query, the person disables it, or the purpose is confusing, tightens the negative triggers
  - Leaves the skill name and the prompt examples out of the description; the examples stay in the body
  - A request that comes from Notion follows publicar-habilidade
  - Rewrites a schema description and each property description that already has text, and keeps every fact already there
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing the body, grading output, describing a product, and writing the skill page in Notion

### revisar-habilidade
- **Stability**: experimental
- **Description**: Review a written skill, flag description and structure issues, and suggest tests from its purpose
- **Properties**:
  - Lives at `.agents/skills/revisar-habilidade/SKILL.md`
  - Flags a vague description, a missing trigger, and a structural problem
  - Identifies the risk of triggering too often or too rarely
  - Suggests an obvious task and a paraphrased request that should trigger, and an unrelated topic plus a near miss that should not
  - Suggests each acceptance criterion already written as a Portuguese Gherkin example, and a with-skill against without-skill comparison
  - Does not write the feature file, create the first version, run the test, or write the skill page in Notion
  - A request that comes from Notion follows publicar-habilidade
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating the first version, running the test and editing the skill, only measuring size, and writing the skill page in Notion

### renovate-preset
- **Stability**: experimental
- **Description**: Renovate preset that keeps a repository and its pins of the core harness current
- **Properties**:
  - Preset at `default.json`, extended as `github>jimmyandrade/harness`
  - Groups every pin of the core harness, in workflows, `package.json`, and `.claude-plugin/marketplace.json`, into one `harness core` pull request
  - A major update waits for approval on the Dependency Dashboard
- **Test Criteria**:
  - [x] The marketplace regex reads the repository and the tag of a `github` plugin source
  - [ ] A release of the core opens one `harness core` pull request in a business harness

### skill-graph
- **Stability**: experimental
- **Description**: Show how the skills of a repository relate, as a Mermaid graph and a table
- **Properties**:
  - Script `.agents/scripts/skill-graph/run-graph.sh` writes `.agents/skills/README.md`, which GitHub renders when the folder is opened
  - In a business harness, the project skills and the core skills are separate groups
  - A solid arrow comes from `metadata.related`. A dotted arrow is a skill cited in the body of a skill that does not declare `metadata.related` yet
  - The table lists, for each skill, its layer, its version, what it depends on, and what uses it
  - `run-check.sh` fails when the README is out of date
- **Test Criteria**:
  - [x] Declared related skills draw solid arrows, and cited skills draw dotted arrows
  - [x] The project and the core are separate groups
  - [x] A stale README fails the check

### check-skill
- **Stability**: experimental
- **Description**: Check the skills of a repository against the harness rules
- **Properties**:
  - Composite action at `.github/actions/check-skill/` and script `.agents/scripts/check-skill/run-check.sh`
  - Reads the project from `HARNESS_ROOT` or the working directory, and its `.agents/config.yml` with the core fallback
  - `base` and `head` limit the check to the skills that changed
  - When a skill declares `metadata.related`, each name must be a skill in the project or in the core, and every skill the body cites must be listed
- **Test Criteria**:
  - [x] A project with a partial `.agents/config.yml` uses the core limits
  - [x] A related name that is not a skill fails, and a cited skill missing from `metadata.related` fails
  - [ ] A business workflow that calls the action fails on a skill that breaks a rule

### sync-skill-pages
- **Stability**: experimental
- **Description**: Publish each changed skill of a repository as a page in its Notion Habilidades database
- **Properties**:
  - Composite action at `.github/actions/sync-skill-pages/` and script `.agents/scripts/sync-skill-pages/sync-skill-pages.ts`
  - The mapping lives in the calling repository: data source id, property names, and status option names
  - `mapping` points at another mapping file. A change to that file republishes every skill
  - The page icon comes from `notion.page_icon_name` and `notion.page_icon_color`, with the core fallback
  - `include-core` also publishes the skills of the core harness into the caller's Notion
- **Test Criteria**:
  - [x] A mapping can rename every status option
  - [x] Core skills publish when the project moves the core version or its mapping, and a name in both stops the sync
  - [x] The project root is `HARNESS_ROOT`, or the working directory
  - [ ] A business workflow that calls the action creates one page per new skill

### classify-term
- **Stability**: experimental
- **Description**: Classify a word or expression in the brand glossary
- **Properties**:
  - Lives at `api/routes/classify/index.ts`
  - Reads one UTF-8 JSON file per language from the glossary directory of the project, `.agents/glossary/` or `HARNESS_GLOSSARY_DIR`, named with a BCP 47 tag such as `pt-BR`, `en`, `de`, `ja`, or `fr`
  - Opens only the file for the language of the text. The file is an object keyed by the term. Each value has `state` and, when present, `alternative`. The keys stay in alphabetical order
  - `POST /v1/classify` with `{"language": "pt-BR", "term": "..."}` starts at `query` and returns one transition
  - An English term used in Portuguese is a row in the Portuguese file, and its state there can differ from the English file
  - `allowed` has no alternative
  - `forbidden` includes `recommended` when the row has one
  - `situationally_allowed` includes `always_allowed` when the row has one
  - A term missing from that language file returns `not_registered`
  - A language with no file is rejected
  - `register` in `api/shared/glossary.ts` inserts a row in that language and rewrites the file in alphabetical order
- **Test Criteria**:
  - [x] An allowed term, a forbidden term, and a situational term each return that state
  - [x] An unsorted glossary is rejected
  - [x] The same term can return a different state in another language

### classify-text
- **Stability**: experimental
- **Description**: Classify each word, emoji, and punctuation mark of a phrase or a text in the brand glossary
- **Properties**:
  - Lives at `api/routes/classify-text/index.ts`
  - `POST /v1/classify-text` with `{"language": "pt-BR", "text": "..."}` starts at `query` and returns one transition per word, emoji, and punctuation mark
  - A word is a run of letters. A hyphen or an apostrophe stays in the word when it joins letters. Each emoji and each punctuation mark is classified on its own. An emoji keeps its variation selector, skin tone, and ZWJ sequence together
  - Each token uses the same states as classify-term: `allowed`, `forbidden`, `situationally_allowed`, or `not_registered`. An emoji is a vocabulary term, not decoration. A joined sequence is one term
  - `forbidden` includes `recommended` when the row has one, and `situationally_allowed` includes `always_allowed` when the row has one
  - A glossary row of more than one word is not matched across separate words
  - A language with no file is rejected
- **Test Criteria**:
  - [x] Each word in a phrase returns its own state, including a word that is not in the glossary
  - [x] Punctuation around a word does not change its state, and the mark is classified on its own
  - [x] An emoji is classified on its own
  - [x] A glossary expression is not matched as one word

### lookup-term
- **Stability**: experimental
- **Description**: Read whether one term or expression exists and return its stored row
- **Properties**:
  - Lives at `api/routes/lookup/index.ts`
  - `POST /v1/lookup` with `language` and `term` returns `exists` and, when the concept is present, the stored row
  - Case and an accent that does not change the letter return that stored row. A plural, a gender, and another word do not
  - A missing concept returns `exists` false
  - When the same word is stored twice, by case or accent, the response names those rows in `duplicates` and suggests one `canonical` row: the row that already has a description and examples, or the one that comes first when those tie
  - The vocabulary MCP tool `lookup_term` reads the same way
- **Test Criteria**:
  - [x] A stored term returns its row, and another case returns that same row
  - [x] A plural does not return the singular row
  - [x] A missing term returns exists false
  - [x] Two stored rows of the same concept return the duplicates and the suggested canonical row

### exists-in-text
- **Stability**: experimental
- **Description**: Report which tokens in a snippet, phrase, or text exist in the vocabulary
- **Properties**:
  - Lives at `api/routes/exists/index.ts`
  - `POST /v1/exists` with `language` and `text` returns only a record of token to boolean
  - Each word, emoji, and punctuation mark is one key. A repeated token stays one key
  - The vocabulary MCP tool `exists_in_text` reads the same way
- **Test Criteria**:
  - [x] A phrase returns true for a token that exists and false for one that does not
  - [x] A plural token is false when only the singular is stored

### register-allowed
- **Stability**: experimental
- **Description**: Register an always-allowed term with its category, reason, and example links
- **Properties**:
  - Lives at `api/routes/allowed/index.ts`
  - `POST /v1/allowed` with `language`, `term`, `category`, `description`, `reason`, and `examples` writes one allowed row in that language file
  - `category` is an English word, such as `punctuation`
  - `description` explains the word. `reason` says why to use it. The two stay apart
  - `examples` links positive uses. A missing example is created as `allowed`. An example that already exists is linked and left as it is
  - The row keeps alphabetical order with the rest of that language file, and an allowed row omits `alternative`
  - A language with no file is rejected, and a term already in that file is rejected
- **Test Criteria**:
  - [x] An allowed term stores its category, description, reason, and the linked examples
  - [x] A missing example is created as allowed, and an existing example is not duplicated
  - [x] A category that is not an English word is rejected

### register-forbidden
- **Stability**: experimental
- **Description**: Register a forbidden term with its category, substitution note, and example links
- **Properties**:
  - Lives at `api/routes/forbidden/index.ts`
  - `POST /v1/forbidden` with `language`, `term`, `category`, `description`, `substitution`, `rejected`, and `alternatives` writes one forbidden row in that language file
  - `category` is an English word, such as `punctuation`
  - `rejected` links examples of what not to do, and `alternatives` links better examples. A missing rejected example is created as `forbidden`. A missing alternative is created as `allowed`. An example that already exists is linked and left as it is
  - The row keeps alphabetical order with the rest of that language file
  - A language with no file is rejected, and a term already in that file is rejected
- **Test Criteria**:
  - [x] A forbidden term stores its category, description, substitution, and the linked examples
  - [x] A missing example is created, and an existing example is not duplicated
  - [x] A category that is not an English word is rejected

### register-situational
- **Stability**: experimental
- **Description**: Register a situationally allowed term with its category, when to use it, and example links
- **Properties**:
  - Lives at `api/routes/situational/index.ts`
  - `POST /v1/situational` with `language`, `term`, `category`, `description`, `when`, and `examples` writes one situationally allowed row in that language file
  - `category` is an English word, such as `punctuation`
  - `when` says when to use the term
  - `examples` links uses of the term. A missing example is created as `situationally_allowed`. An example that already exists is linked and left as it is
  - The row keeps alphabetical order with the rest of that language file, and omits `alternative` when it has none
  - A language with no file is rejected, and a term already in that file is rejected
- **Test Criteria**:
  - [x] A situational term stores its category, description, when, and the linked examples
  - [x] A missing example is created as situationally allowed, and an existing example is not duplicated
  - [x] A category that is not an English word is rejected

### write-terms
- **Stability**: experimental
- **Description**: Insert and update allowed, forbidden, and situational terms in one write
- **Properties**:
  - Lives at `api/routes/terms/index.ts`
  - `POST /v1/terms` with `language`, `mode`, and `terms` writes those rows in that language file
  - `mode` is `insert`, `update`, or `upsert`
  - Each term has `state` (`allowed`, `forbidden`, or `situationally_allowed`) and the fields of that state
  - `insert` writes a term that is absent and leaves a term that is already in the file
  - `update` rewrites a term that is present and leaves a term that is absent
  - `upsert` writes every term
  - A term sent in full stays in full when another term in the same request links it
  - A missing example that is not itself in the request is created as it is for a single registration
  - One failure leaves the file unchanged, and the rows stay in alphabetical order
  - The response lists `inserted`, `updated`, `unchanged`, and `skipped`
  - A search before the write treats case and an accent that does not change the letter as the existing term. The same fields stay `unchanged`. A different field updates that row and keeps the stored spelling. A second row is not created. A new term is stored in lowercase. A plural, a gender, and another word each keep their own row and state. related points at terms already registered or in the same batch. A missing pointer is refused and the file stays unchanged
  - When the same word is already stored twice, by case or accent, the write refuses, names both, suggests the canonical row, and leaves the file unchanged. The command and the MCP tool return that same refusal
  - An allowed or forbidden term that also carries when is refused. The command, the allowed route, the forbidden route, and the MCP tool return that same refusal
  - A forbidden term that also carries examples is refused. The bad example belongs in rejected. The command, the forbidden route, and the MCP tool return that same refusal
  - Category cliche is forbidden. An allowed or situational cliché is refused and the file stays unchanged. A forbidden cliché stores the phrase to avoid in rejected
  - Description explains the word. On an allowed row, reason says why to use it, and the two stay apart. A longer example the person asked to document stays in examples
  - `node api/cli.ts terms` writes that same body with flags: `--language`, `--mode`, and one `--term` per row. `--examples`, `--rejected`, and `--alternatives` repeat once per value
  - The `vocabulary` MCP tool `write_terms` writes that same body
- **Test Criteria**:
  - [x] Upsert stores mixed states, and a linked example sent in full keeps its own row
  - [x] Insert leaves an existing term, and update leaves a missing term
  - [x] A failed batch leaves the file unchanged
  - [x] The terms command and the MCP tool write that same body
  - [x] A plural is stored on its own row. A case change or an unaccented form updates the existing term or leaves it unchanged
  - [x] A new term is stored in lowercase
  - [x] related points at a term in the same batch, and a missing pointer leaves the file unchanged
  - [x] A plural stored beside the singular keeps its own fields
  - [x] An allowed or forbidden term with a situation is refused and the file stays unchanged
  - [x] A forbidden term with a positive example is refused and the file stays unchanged
  - [x] An allowed cliché is refused, and a forbidden cliché stores the phrase to avoid in rejected
