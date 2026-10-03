---
locale: en
---

# Skills

How these skills relate is in `README.md`, in this folder.

## Features

### avaliar-atualizacoes-de-dependencia
- **Stability**: experimental
- **Description**: Work through the open dependency update pull requests from Dependabot and Renovate, oldest first, one at a time
- **Properties**:
  - Lives at `.agents/skills/avaliar-atualizacoes-de-dependencia/SKILL.md`
  - Reads the bot authors, the install, test, and build commands, and the reviewers from the project instructions
  - Walks a transitive package up to the direct one before looking for call sites and tests
  - Reads the release notes of the range and stops for the person on a breaking change without a clear migration
  - Checks how far the bot's branch is behind the base and asks the bot to rebase when needed
  - Adds missing integration tests, which exercise the project's code using the package, never the package itself, on the bot's branch instead of a separate pull request
  - Fixes project code that the update breaks on the same branch, and runs the build even when the tests pass
  - Stops and proposes a Renovate or Dependabot group when a package arrives without the types, peer dependency, or monorepo packages that move with it
  - Evaluates a stale branch without conflict on a local merge with the base, and a subproject with its own commands
  - Reads every release in the range from the package repository, or compares the public types when there are no notes, and finds direct imports of transitive packages
  - Measures the degraded path when notes change retries or timeouts, checks project content a package parses, and compares linter diagnostics per rule on tracked files
  - Commits files a package regenerates on install, and says when a merge needs a new deploy or new binaries on every machine
  - Hands comments to resolver-comentarios-de-revisao and the merge to criar-pull-request, and starts the next pull request only after the checks of the merge commit on the base branch, from any service, are green
- **Test Criteria**:
  - [ ] Three open bot pull requests are handled oldest first, each merged only after the previous one turned the base branch green
  - [ ] An update to a transitive package finds the call sites of the direct package

### criar-commit
- **Stability**: experimental
- **Description**: Commit finished work as atomic commits with a message in the project language and pattern
- **Properties**:
  - Skill at `.agents/skills/criar-commit/`
  - Reads the base branch, whether to commit without asking, the message language and pattern, and the test, build, and lint commands from the project instructions
- **Test Criteria**:
  - [ ] A project without test or build commands commits and says nothing was verified

### criar-habilidade
- **Stability**: production
- **Description**: Write the smallest skill that still triggers
- **Properties**:
  - Lives at `.agents/skills/criar-habilidade/SKILL.md`
  - Treats the skill as a living document and repeats while feedback asks for it
  - Sends undertriggering and overtriggering to descrever-habilidade-ou-schema, and inconsistent results, failed calls, and corrections to evoluir-habilidade
  - Keeps the skill test as Portuguese Gherkin in features/
  - When creating, reviewing, and editing an entity share the same criteria, names one skill `definir-` plus the entity
  - The entity may be more than one word, up to 64 characters
  - Does not create a skill whose job is to delete a resource
  - When a step routes to another skill, or routes more than one outcome, that step contains a Mermaid flowchart in the direction from mermaid.flowchart_direction
  - An empty placeholder stays on 0.0.x and its body may be only the title
  - Does not store a person, a date, or an alias in SKILL.md except inside Exemplos de entrada e saída, which opens with "Estes exemplos ilustram fatos. Eles podem não estar no data source."; the checker requires that sentence in every skill; the fact stays in the data source, and a test in features/ or evals.json may use it
  - When a skill is renamed, keeps every previous name in metadata.aliases
  - Keeps the folder and the frontmatter name in ASCII kebab-case, and writes the level-1 title and the body in natural language with correct spelling and every diacritic. The title is in sentence case: a capital letter only at the start and in proper nouns, as in "Procurar e-mail" or "Publicar no Notion"
  - Writes each input example as a level-3 heading and its output as the next paragraph, with a blank line between pairs. The checker rejects `dl`, `dt`, and `dd`, which Notion does not show
  - Ends every skill with Scripts disponíveis, naming each script and the command that runs it
  - Does not edit code, write a non-skill page, only tune a description, or write the skill page in Notion
  - A request that comes from Notion follows publicar-habilidade
  - Cites another skill by its name between backticks, or in a Mermaid diagram node, so the checker and the skill graph recognize the citation
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses code edits, a non-skill page, description-only work, and writing the skill in Notion

### criar-pull-request
- **Stability**: experimental
- **Description**: Open, update, and merge a pull request without pushing to the base branch
- **Properties**:
  - Skill at `.agents/skills/criar-pull-request/`
  - Reads the repository, base branch, merge method, PR language, test and build commands, and push timing from the project instructions
  - Follows the pull request template of the repository when there is one
  - Before a merge, hands pending review comments from people or bots to resolver-comentarios-de-revisao, and holds the merge while a thread waits for the person
  - `Exigir CI verde`, on by default, holds the merge while a check fails or is pending; off, it merges and reports the checks that did not pass
- **Test Criteria**:
  - [ ] A request to push to the base branch opens a pull request instead
  - [ ] A merge request on a pull request with an unresolved thread runs resolver-comentarios-de-revisao first
  - [ ] A merge request with a failing check stops and names the check while `Exigir CI verde` is on

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

### evoluir-habilidade
- **Stability**: experimental
- **Description**: Test a skill and edit that skill from the run
- **Properties**:
  - Lives at `.agents/skills/evoluir-habilidade/SKILL.md`
  - A request to test a skill uses this skill
  - Treats the skill as a living document and iterates from feedback
  - On inconsistent results, a failed call, or a correction from the person, improves the instructions and adds error handling
  - Sends undertriggering and overtriggering to descrever-habilidade-ou-schema
  - Compares the current skill, the previous version when it exists, and a run without the skill
  - Records each acceptance criterion the person sent as a Portuguese Gherkin feature in features/, one feature per functionality the person uses, starting with # language: pt, and counts it as validated only after that run. A step, the text format, and a diff are not a feature
  - Compares the run without the skill and with the skill on back-and-forth, failed calls, and tokens, from the run record
  - Edits the skill that was validated in that same conversation
  - Does not create the first version of a skill, only check whether the description triggers, only review without running, or write the skill page in Notion
  - A request that comes from Notion follows publicar-habilidade
  - Size and run profile follow medir-habilidade
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description says the test edits the validated skill, and refuses creating the first version, only checking whether the description triggers, only reviewing without running, and writing the skill page in Notion

### medir-habilidade
- **Stability**: experimental
- **Description**: Measure a skill's size and the profile of a run
- **Properties**:
  - Lives at `.agents/skills/medir-habilidade/SKILL.md`
  - Reports body tokens and their share of the body limit, plus lines, words, body characters, and catalog tokens
  - Uses the same body slice and token encoding as the skill check
  - Reads the limits from the project of the measured skill, with the core configuration as fallback
  - Treats a body or a line count at the limit as failing, and a word or catalog count at the limit as passing
  - Profiles a run that already happened: duration and the step that spent the time
  - Does not decide whether the skill met the case, and does not write the eval JSON
  - Runs in Claude, Cursor, or another harness
  - A Notion session stops before looking for the script, does not open the repository to run it, and does not estimate numbers
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses Notion, opening the repository from Notion, testing whether the skill met the case, evolving the skill, and writing the eval
  - [x] A limit missing from the project comes from the harness that ships the skill, and a limit in the project wins

### publicar-habilidade
- **Stability**: experimental
- **Description**: Publish a skill change from Notion through GitHub, and follow the project's commit flow from Cursor, Claude, or the repository
- **Properties**:
  - Lives at `.agents/skills/publicar-habilidade/SKILL.md`
  - Treats the Habilidades database as read-only and the repository as the write source
  - From Notion, uses its own branch, an English Conventional Commits subject, and a pull request, then stops
  - Waits for another person's review; a green check does not replace that review
  - Merges only in a later request, after that review and an explicit merge authorization
  - Does not edit a Habilidades page, including when the person calls the edit an emergency
  - A Notion chat that asks to create or activate a skill does not create or activate the page, including when the database text explains how to fill the description
  - A page that exists only in that database stays there; sync covers a page it already writes and does not remove the extra page
  - If that chat cannot reach GitHub, it stops and says so
  - From Cursor, Claude, or the repository, reads `Commit direto na base` from the project instructions: `sim` commits on the main branch without a pull request, and `não`, the default, follows criar-commit and criar-pull-request
  - After an approved and authorized merge, lets GitHub Actions sync and then checks the Notion page
  - A synced version below 0.1.0 gets the draft option of the mapping, a version from 0.1.0 whose major number is 0 gets the validation option, and 1.x onward gets the production option
  - A rename keeps the same Notion page and writes the new name on it. Sync stops when the new name and the previous name are already both pages
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses editing the Habilidades page and merging in the same request

### resolver-comentarios-de-revisao
- **Stability**: experimental
- **Description**: When a pull request has comments from people or bots, handle each one: fix, decline, or ask, then reply and resolve
- **Properties**:
  - Lives at `.agents/skills/resolver-comentarios-de-revisao/SKILL.md`
  - Runs only when the pull request has comments to handle. A pull request without comments does not load it
  - Reads review threads, review bodies such as a bot's summary, and pull request conversation comments
  - Checks each comment against the current head of the pull request, and marks it valid, already fixed, outdated, or duplicate
  - Fixes bugs, missing error handling, security issues, and project convention violations; declines style and low-impact details with a reason; takes intent, product, and architecture questions to the person
  - Records a lesson that outlives the pull request in the project instructions
  - Pushes the branch after each fix and before replying, so a reply never cites a commit missing from the pull request
  - Replies on each thread before resolving it, and leaves open a thread that waits for the person's decision
  - Ends with a tally of accepted, declined, outdated, and open comments by author, and hands back to the caller. The merge, and whether failing checks block it, stay with criar-pull-request
- **Test Criteria**:
  - [ ] A comment that still applies is fixed, answered, and resolved
  - [ ] A comment that no longer applies is answered with why, and resolved
  - [ ] A thread without an answer stays open and shows in the tally

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
