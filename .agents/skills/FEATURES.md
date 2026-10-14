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

### comunicar-novidade-do-produto
- **Stability**: experimental
- **Description**: Decide whether merged work brings anything new for the people who use the product and, when it does, write the announcement without technical terms
- **Properties**:
  - Lives at `.agents/skills/comunicar-novidade-do-produto/SKILL.md`
  - Reads the audience, the channel, and the language of the announcement from the project instructions
  - Reads each pull request of a merge or a period, and decides by the diff, not by the commit type
  - Without anything new for the audience, says so and writes no announcement, even when asked for one
  - Writes what changes in practice, where people notice it, who is affected, what to do, and from when
  - Shows the text and asks before publishing to a channel it can reach; otherwise hands the text over to copy
- **Test Criteria**:
  - [x] A day of 21 maintenance pull requests yields no announcement
  - [ ] A period with a visible change yields an announcement without technical terms

### criar-commit
- **Stability**: experimental
- **Description**: Commit finished work as atomic commits with a message in the project language and pattern
- **Properties**:
  - Skill at `.agents/skills/criar-commit/`
  - Reads the base branch, whether to commit without asking, the message language and pattern, and the test, build, and lint commands from the project instructions
  - Names a new branch `type/short-description` after the Conventional Commits type, and renames a branch a tool created with another prefix, such as `claude/`
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
  - Gives every new skill the `Modo de aprendizado` parameter and a last step that hands over to evoluir-habilidade
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses code edits, a non-skill page, description-only work, and writing the skill in Notion

### criar-oportunidade
- **Stability**: experimental
- **Description**: Register an opportunity that does not exist yet
- **Properties**:
  - Lives at `.agents/skills/criar-oportunidade/SKILL.md`
  - Stops when procurar-oportunidade finds the same edition
  - Reads the opportunity list and its property names from the data mapping of the project, stops before creating when the title, the date, or the required group is missing from it, and lists at the end each value that has no property, with a suggestion to add it
  - Writes the title as edition name, date with the weekday, city, then group, and writes the interval on the edition date
  - Rejects a date before `Data mínima da edição`, which defaults to `Data de fundação do negócio`; both are YYYY-MM-DD in the project instructions, and both empty means no limit
  - With `Considerar grupos de oportunidades` at `sim`, links the edition to one existing group and leaves creating or correcting that group to definir-grupo-de-oportunidades; with `não`, registers the edition without a group
  - Puts edition-specific facts, such as place, hours, price, form, and vacancies, on the edition
  - Relates a profile on the edition only when that account belongs to that edition
  - Does not create an opportunity page for selection, registration, an edital, or a call
  - Keeps an existing notes block on the edition intact, and may copy a supported fact into a property
  - Does not write the poster in the page body
  - Does not treat free entry for a restricted audience as the visitor ticket or the exhibitor fee
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses the group, checking whether the opportunity exists, organizing the participation, registering someone, creating a task, and reading an image

### criar-pull-request
- **Stability**: experimental
- **Description**: Open, update, and merge a pull request without pushing to the base branch
- **Properties**:
  - Skill at `.agents/skills/criar-pull-request/`
  - Reads the repository, base branch, merge method, PR language, test and build commands, and push timing from the project instructions
  - Opens a pull request only from a `type/short-description` branch, and renames a branch a tool created with another prefix before the push. A rename after the pull request opens closes it, so a new pull request replaces it
  - Follows the pull request template of the repository when there is one
  - Before a merge, hands pending review comments from people or bots to resolver-comentarios-de-revisao, and holds the merge while a thread waits for the person
  - `Exigir CI verde`, on by default, holds the merge while a check fails or is pending; off, it merges and reports the checks that did not pass
- **Test Criteria**:
  - [ ] A request to push to the base branch opens a pull request instead
  - [ ] A `claude/…` branch is renamed to `type/…` before its pull request opens
  - [ ] A merge request on a pull request with an unresolved thread runs resolver-comentarios-de-revisao first
  - [ ] A merge request with a failing check stops and names the check while `Exigir CI verde` is on

### definir-data-significativa
- **Stability**: experimental
- **Description**: Register, review, or alter a record in the list of significant dates
- **Properties**:
  - Lives at `.agents/skills/definir-data-significativa/SKILL.md`
  - Reads the list of significant dates and its property names from the data mapping of the project
  - Registers, reviews, and alters a commemorative date, holiday, milestone, season, or window in that list
  - Before creating a record, searches the main term and useful variations in the event title, filters by the same month or year when that window separates records, and compares the date, the category, and the source on each possible match
  - When an equivalent record is confirmed as the same event and date, points to it as canonical and fills the source or the notes when the material already has them
  - When similar names are confirmed as different editions, years, cities, or contexts, creates the record with a name that includes the year, edition, city, or country that separates them
  - Puts the year at the end of an annual event title, renames a record that lacks the year, and keeps different years as different records
  - Reads the date-with-weekday format, the annual-title pattern, the calendar URL, and the calendar country from the project instructions, and asks the country when `País do calendário` is empty, its default
  - When a holiday or commemorative date has no source in the material, follows the calendar URL Notion usually uses for that year and country, without restricting the source to that URL, and reads a missing date from the page consulted
  - Writes the weekday beside each date in replies, summaries, tables, and descriptions, after checking it against the event date, time, and time zone, and keeps the structured field valid
  - Leaves a question about when the date falls, or whether it is already listed, to procurar-data-significativa
  - Leaves the day or week lookup and the calendar event to other skills
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses looking up when the date falls, the day or week lookup, creating or changing the calendar event, reverse planning, managing travel, registering the opportunity, organizing the contact point, and creating the task

### definir-instrucoes-do-projeto
- **Stability**: experimental
- **Description**: Write and review a project's instructions file so that it holds only what every session needs, as ADR 0008 decides
- **Properties**:
  - Lives at `.agents/skills/definir-instrucoes-do-projeto/SKILL.md`, with the output template at `.agents/assets/templates/agents-md.md`
  - Measures the instructions with the skill checker before and after, against the skill body limits
  - Classifies each passage by destination: stays, contributing guide, architecture map, design document, a new skill, product documentation, the data, or the parameters in the frontmatter
  - Writes in the language set by "Idioma das instruções do projeto", one rule per line, with separate parts for anywhere, Notion only, and coding tools only
  - Builds `metadata.parameters` in the frontmatter as a tree, a `Global` entry and one entry per skill, copying each key from the skill and listing only values that differ from the defaults
  - Creates each destination before removing the passage, then updates the references to the old location
- **Test Criteria**:
  - [ ] Instructions over the body token limit end under it, with every moved passage reachable from its destination
  - [ ] A parameter added for two skills lands in `Global` under the exact key the skills read

### definir-grupo-de-oportunidades
- **Stability**: experimental
- **Description**: Create, review, or correct the canonical group of an opportunity
- **Properties**:
  - Lives at `.agents/skills/definir-grupo-de-oportunidades/SKILL.md`
  - Reads `Considerar grupos de oportunidades` from the project instructions, and with `não` says the business does not use groups and stops
  - Reads the group list, the opportunity list, and their property names from the data mapping of the project, and stops before creating when the group title or the edition group is missing from it
  - Keeps the group title free of year, edition number, and date
  - Searches title, canonical name, aliases, organizer, venue, profile, and event family before creating a group, and asks when the match is uncertain
  - Puts recurring workshops of one organizer under one group, and leaves a program with its own audience in its own group
  - Relates an official social profile on the group
  - Turns a dateless page in the opportunity list into a group, and archives that page only after the stable facts are copied
  - Links the dated editions that have no group, for a business that starts considering groups
  - After linking an edition, checks for a duplicate group, relinks to the canonical one, merges useful data, and asks before archiving the duplicate
  - Keeps a notes block on the group intact, and lists at the end each value that has no property to go to
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering the edition, checking whether the edition exists, organizing the participation, registering someone, creating a task, and reading an image

### definir-inscricao
- **Stability**: experimental
- **Description**: Define an inscription, including one that is not in the list yet
- **Properties**:
  - Lives at `.agents/skills/definir-inscricao/SKILL.md`
  - Reads the inscription list, its property names, and its status options from the data mapping of the project, stops before creating when the edition, the status, who made it, or the person or company is missing from it, and lists at the end each value that has no property
  - Updates one inscription, and creates the row when the person sends an inscription that is not there and the message or photo already names who made it and for which person or company
  - When a message or a completed-order photo confirms that participation, or the person states that the inscription was made or confirmed, sets the status to the confirmed option
  - Celebrates after the status is saved, and does not stop at the celebration
  - When more than one inscription matches and no page was named, names each and asks which to change before celebrating that confirmation
  - Leaves the other inscriptions of the event unchanged
  - On an existing row, changes only the named property, attaches the confirmation photo to the receipts in that same write, and does not fill the confirmation date unless the person states it
  - When the person states the day they sent the inscription, writes that day and does not ask for the hour
  - Spells names through the skill that `Habilidade de grafia` names in the project instructions, when there is one
  - Does not store the order number, does not put the photo in the page body, and does not decide whether a task exists
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses only celebrating without saving, only looking up who registered, and deciding whether a task exists

### definir-tarefa
- **Stability**: experimental
- **Description**: Register, review, edit, or judge a merge of tasks with one set of criteria
- **Properties**:
  - Lives at `.agents/skills/definir-tarefa/SKILL.md`
  - Reads the property names and the status options of the task list from the data mapping of the project
  - Rewrites the title so it says what will be accomplished and keeps the deadline out
  - Does not accept a title that only says to go somewhere, such as going to print shops
  - Records a target date in the deadline, not in the title or in the notes, and states that date with the weekday in the reply
  - Writes the definition of done as a short checklist of verifiable evidence
  - Leaves the physical contact point to the skill that `Habilidade do ponto de contato` names, when there is one, and keeps a reference link and a note in their properties, not in the page body
  - Alerts the owner when the deadline has passed and the task is not complete
  - Puts a blocking note in the notes, not in the title
  - Starts the title with an infinitive verb
  - Checks the title, the deadline, the owner, and the definition of done against specific, measurable, achievable, relevant, and time-bound
  - Reports a verdict and what is missing for each task, and closes with the actions to take
  - Suggests merging tasks the person named when they are the same work, and does not keep a vague title or copy a creation date
  - Opens the task the person named, and opens the links the person passed without searching the list for other tasks
  - When the person states the benefit, writes it into the notes in that reply, in the present, and keeps the note already there
  - When a spelling is uncertain, follows the skill that `Habilidade de grafia` names, when there is one, and writes the correct form
  - Writes the request date as the day the request arose in this conversation, leaves it empty when that day is only in a chat the agent cannot read, and does not copy the start or the deadline into that field
  - On a recurring schedule trigger, scans the list and signals problems without writing
  - On a page-added or property-updated trigger, reviews that page only
  - Comments when the correction is not safe and mentions the accountable person of the RACI matrix, or the owners when the list has no such role
  - With `Considerar pessoas consultadas` set to `sim`, also mentions the consulted people and asks their view; with `Considerar pessoas informadas` set to `sim`, comments what changed and mentions the informed people after applying a correction. Both default to `não`, and a role the list lacks is reported, not created
  - Does not change the title, status, deadline, definition of done, or owner until the person asks to apply that correction
  - Does not only check existence, mark a task complete, or turn a rule without a deliverable into a task
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses only checking existence, marking a task complete, and turning a rule without a deliverable into a task

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
  - Writes the description of the project instructions too, in their frontmatter: it fires on any task of the workspace, and `NÃO use para` covers changing the instructions themselves
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
  - Runs at the end of every core skill, following the `Modo de aprendizado` parameter (`sim`, `não`, `perguntar`, default `perguntar`): with yes, one commit per lesson on an English-named branch, pushed, with a draft pull request from the first commit, marked ready when the person ends the sequence
  - Takes the project instructions as a target too: feedback on the agent's behavior edits them in the format of `definir-instrucoes-do-projeto` and raises `metadata.version`, without evals or features of their own
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description says the test edits the validated skill, and refuses creating the first version, only checking whether the description triggers, only reviewing without running, and writing the skill page in Notion

### identificar-duplicata
- **Stability**: experimental
- **Description**: Check for an equivalent record before creating one, and point at the existing record
- **Properties**:
  - Lives at `.agents/skills/identificar-duplicata/SKILL.md`
  - When the data mapping of the project describes the list, reads the property names from it
  - Runs when the person searches or tries to register a new record, including when another skill asks for the check
  - Searches the name as written, plus alternative names and different spellings: acronyms, nicknames, former names, and the name with and without an edition or year
  - When one equivalent exists, points at that page as the existing canonical record
  - Includes alias, name variation, and spelling fields the source already stores, and treats do-not-confuse-with as a different record
  - Opens each possible match and compares official site, locality, dates, organizer, and social profiles when the page has them
  - When two records of the same item already exist, the reply is a diff of what each page brings, including a field filled on one side and empty on the other, and it does not name a canonical record
  - When similar names are confirmed as different entities, keeps each entity on its own canonical record and writes Não confundir com immediately when the list already has that property or an equivalent
  - Follows a fixed order for a new item or a conflict: search the main name and the variations, compare the official link when it applies plus dates, place, and profiles, hand a duplicate to mesclar-registro, link a lookalike in Não confundir com, update Variações de nome in the standard format, and record a permanent difference in the disambiguation text with a time-bound fact in a dated comment
  - Asks before saving when the pages to link are uncertain, and when a minimum disambiguation property is missing warns, proposes creating it, and does not treat the disambiguation as ready
  - On every comparison of similar records, says whether Não confundir com exists, relates confirmed different records before finishing when that relation exists, and after authorization creates the relation and only then records the link
  - Keeps a name variation for forms of the same canonical record, puts a permanent difference in the disambiguation text, links distinct records in Não confundir com, and puts a time-bound fact in a dated comment
  - Keeps that permanent context out of name variations and out of spelling
  - Leaves a social profile link to definir-perfil-social, and leaves the canonical choice of duplicates to mesclar-registro
  - When one social profile exists, still searches the list of people for another record of the same person, reports the diff, and does not treat Não confundir com as the separator of that duplicate
  - Does not ask the person to name the skill
  - Does not create, merge, delete, lock spelling, or pick among similar records
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses consolidating names, deleting, creating the record, locking spelling, and choosing among similar records

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

### procurar-data-significativa
- **Stability**: experimental
- **Description**: Say when a significant date falls, or whether it is already in the list of significant dates
- **Properties**:
  - Lives at `.agents/skills/procurar-data-significativa/SKILL.md`
  - Reads the list of significant dates and its property names from the data mapping of the project
  - Searches the event title by a direct query and by a semantic search
  - Treats another year of an annual event as another record and does not pick one when the question omits the year
  - Answers with the event, the date, and the link, and writes the weekday beside each date
  - Includes the planning the notes already have, signals when the notes contradict the date, and does not narrate the search or name the skill
  - When no record matches, says so and searches in the same reply, following the calendar URL Notion usually uses, with the named year or the current year and the calendar country, without restricting the search to that URL, and does not treat the web date as a list record
  - Asks the country when `País do calendário` is empty, its default
  - Does not create or alter the record
  - Leaves registering, reviewing, and altering the record to definir-data-significativa
  - Leaves the day or week lookup and the calendar event to other skills
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering, reviewing, or altering the record, the day or week lookup, creating or changing the calendar event, and managing travel

### procurar-email
- **Stability**: experimental
- **Description**: Find one or more emails about a subject and say what each message says
- **Properties**:
  - Lives at `.agents/skills/procurar-email/SKILL.md`
  - Searches the mailbox connected to the workspace, not a Notion list
  - Lists each matching message with subject, sender, and date
  - Does not treat a ticket-available message as approval of another registration
  - Does not reply, forward, or delete the message, and does not decide a registration or a task
  - Spells names through the skill that `Habilidade de grafia` names in the project instructions, when there is one, and searches the correct first name plus the surname as plain text, even when the email property is empty, without the from: operator
  - Treats a nickname and the correct first name of one record as the same person, and does not report a first-name search as a miss for the nickname
  - When the person has already said the email exists, uses that account, including an event email that does not ask to register or withdraw a ticket again
  - When the person opens a mailbox link the connected search missed, reports that message, and does not say she sent nothing
  - Does not ask the person to name the skill
  - After the name search, lists subject messages that are not from her, and does not say the mailbox is empty when the connected search returns no email from her
  - Does not treat another person who shares the first name as her
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses replying, forwarding, or deleting, and deciding a registration or a task

### procurar-inscricao
- **Stability**: experimental
- **Description**: Answer who registered, whether the registration is confirmed, or whether a ticket was withdrawn
- **Properties**:
  - Lives at `.agents/skills/procurar-inscricao/SKILL.md`
  - Reads the inscription list, its property names, and its status options from the data mapping of the project, and searches it in the title and in the notes
  - Names each person in the note and does not answer yes for the whole event
  - When several registrations match one event, says the answer depends on which withdrawal is meant, with status, date, and page link for each
  - Treats a pre-registration as neither approval nor withdrawal, suggests procurar-email, and points to the other contact channels with the organizer
  - Treats the participant and the person who recorded the row as different people
  - Searches every form of a name through the skill that `Habilidade de grafia` names, when there is one, and uses the correct spelling only in the reply
  - When the person states that the inscription was made or confirmed, follows definir-inscricao so the celebration comes with the saved status
  - Does not decide whether a task exists, and does not create, edit, or complete the registration
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses deciding whether a task exists, and creating, editing, or completing the registration

### procurar-oportunidade
- **Stability**: experimental
- **Description**: Check whether an opportunity already exists before another skill creates it
- **Properties**:
  - Lives at `.agents/skills/procurar-oportunidade/SKILL.md`
  - Reads the opportunity list and its property names from the data mapping of the project
  - Searches a fragment of the edition name in the title and in the name variations, with a direct query and a semantic search
  - Treats the same name on another date as another edition
  - When one edition matches, shows the title, the date, and the link, and a confirmed order continues to definir-inscricao in that same reply
  - When several might match, lists them and does not pick
  - When none match, says it does not exist, links the list, repeats the name, the date with the weekday, and the place, and does not create it
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating the opportunity, organizing the participation, creating a task, and reading an image

### procurar-tarefa
- **Stability**: experimental
- **Description**: Check whether a task about a subject already exists before opening another
- **Properties**:
  - Lives at `.agents/skills/procurar-tarefa/SKILL.md`
  - Searches a fragment of the subject in the task list the person supplies, with a direct query and a semantic search
  - When the person does not name a list, reads the task list and its property names from the data mapping of the project, in the connected workspace
  - When the task is absent, says so for that list, mentions a close note, and asks before a workspace-wide search
  - When the subject is a ticket or a registration, follows procurar-inscricao and does not say whether the withdrawal happened
  - Says which fragment it used and does not mention a task that only shares a word
  - Does not create, edit, or complete the task, and does not search notes, meetings, or pages outside that list
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating, editing, or completing the task, and searching outside the task list

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
