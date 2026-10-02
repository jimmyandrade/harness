---
locale: en
---

# Skills

How these skills relate is in `README.md`, in this folder.

## Features

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
  - Writes each input example as a level-3 heading and its output as the next paragraph, with a blank line between pairs. The checker rejects `dl`, `dt`, and `dd`, which Notion does not show
  - Ends every skill with Scripts disponíveis, naming each script and the command that runs it
  - Does not edit code, write a non-skill page, only tune a description, or write the skill page in Notion
  - A request that comes from Notion follows publicar-habilidade
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
