---
locale: en
---

# Skills

How these skills relate is in `README.md`, in this folder.

## Features

### acompanhar-veiculo
- **Stability**: experimental
- **Description**: See or organize what a car or motorcycle owes or costs, such as tax, insurance, fines, points, tolls, toll tag, installments, or repairs
- **Properties**:
  - Lives at `.agents/skills/acompanhar-veiculo/SKILL.md` and stays internal while it is validated
  - Records contracts and debts through definir-obrigacao-financeira and each bill or payment through lancar-despesa-pessoal or lancar-despesa-da-empresa, linked to the vehicle
  - Turns a regularization plan into one obligation per line and one expense per due date, and checks that installments add up to each total
  - Tells a received notice from a status checked at the traffic authority of the state of registration
  - Reads from a parameter where each kind of pending item arrives or is checked (email, app, or website), schedules a check for items that never arrive by email, and never takes a missing email as a clean status
  - Sets the context of each cost by purpose, and records who paid when someone else pays
  - Requires the vehicle protection extension by the contract's criterion, a coverage radius in a distance unit or a covered locality, asked a set number of calendar days ahead with a reminder and a trip timeline milestone; a refusal needs a reason, and a lack of cash on a work trip flags the cash projection and the participation for review
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### atender-revisao-de-pull-request
- **Stability**: experimental
- **Description**: Handle the review a pull request received: classify each suggestion, apply the safe ones, reply on each thread, and resolve the ones that were met
- **Properties**:
  - Lives at `.agents/skills/atender-revisao-de-pull-request/SKILL.md`
  - Takes the pull request from the caller. Without one, lists the pull requests of the person that have requested changes, open comments, or failing checks, and asks which to handle
  - Reads the context sheet from levantar-contexto-do-pull-request: review threads, review bodies such as a bot's summary, and conversation comments
  - Checks each comment against the current head of the pull request, and marks it valid, already fixed, outdated, or duplicate
  - Classifies each suggestion, from a person or a bot, as structural, a behavior change, a disagreement, or out of scope. A behavior change waits for the approval of the person, and a disagreement becomes a question
  - Works in a separate copy of the repository, validates before committing, and never pushes a change that breaks the validation or rewrites commits already in the pull request
  - Records a lesson that outlives the pull request in the project instructions
  - Pushes the branch after each fix and before replying, so a reply never cites a commit missing from the pull request
  - Replies on each thread before resolving it, closes the loop with a last message from the person acting, and leaves open a thread that waits for a decision
  - Asks the reviewer who requested changes for a new review once everything is applied or answered
  - In a scheduled run, applies only the structural changes and leaves the rest in the summary
  - Ends with a tally of accepted, declined, outdated, and open comments by author, and hands back to the caller. The merge, and whether failing checks block it, stay with criar-pull-request
- **Test Criteria**:
  - [ ] A comment that still applies is fixed, answered, and resolved
  - [ ] A comment that no longer applies is answered with why, and resolved
  - [ ] A suggestion that changes behavior is shown to the person and not applied without approval
  - [ ] A thread without an answer stays open and shows in the tally

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
  - Hands comments to atender-revisao-de-pull-request and the merge to criar-pull-request, and starts the next pull request only after the checks of the merge commit on the base branch, from any service, are green
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
  - Picks the channel by what the environment has: a terminal uses git, the GitHub integration alone creates the branch and the commit through it, and neither stops and says so. Without a terminal, the CI checks of the pull request do the verifying
  - `Commit direto na base` is `nunca`, the default, `só no terminal`, or `sempre`. Only `sempre` commits on the base without a terminal
  - Treats the repository as the only write source: a copy synced from it, such as the Notion page of a skill, is read-only, including when the person calls the edit an emergency
  - A request to create or activate a skill in a synced copy does not create it there, including when that copy explains how to fill the description
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
  - A request that arrives through a synced copy, such as the Notion page, writes through criar-commit and criar-pull-request
  - Cites another skill by its name between backticks, or in a Mermaid diagram node, so the checker and the skill graph recognize the citation
  - Gives every new skill the `Modo de aprendizado` parameter and a last step that hands over to evoluir-habilidade
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses code edits, a non-skill page, description-only work, and writing the skill in Notion

### criar-ideia-de-conteudo
- **Stability**: experimental
- **Description**: Register a social content idea before it becomes a scheduled post
- **Properties**:
  - Lives at `.agents/skills/criar-ideia-de-conteudo/SKILL.md`
  - Reads the list of content ideas, its property names, and its status options from the data mapping of the project
  - Writes the idea with the draft status, the scene in the description, and the reference link in the original content URL
  - Sets the capture date to the registration instant, including the time, so ideas captured on the same day stay distinct, and leaves the planned date empty unless the person gave a date
  - Shows a similar idea that uses another URL, and still creates this one
  - Writes dates in the reply with `Formato da data com dia da semana`
  - Does not create a page in the list of posts, write a caption, schedule the post, register a profile, or create a task
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses publishing the post, writing the caption, scheduling the post, registering the profile, and creating the task

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
  - Before creating the branch, checks that the demand has a task in the tracker of the project, and suggests creating it first when it has none. The task key goes in the branch name and the pull request title as the repository convention says
  - Skill at `.agents/skills/criar-pull-request/`
  - Reads the repository, base branch, merge method, PR language, test and build commands, and push timing from the project instructions
  - Opens a pull request only from a `type/short-description` branch, and renames a branch a tool created with another prefix before the push. A rename after the pull request opens closes it, so a new pull request replaces it
  - Follows the pull request template of the repository when there is one
  - Before a merge, hands pending review comments from people or bots to whoever handles the review, in a terminal, and holds the merge while a thread waits for the person
  - `Exigir CI verde`, on by default, holds the merge while a check fails or is pending; off, it merges and reports the checks that did not pass
  - Without a terminal, opens the pull request through the GitHub integration, gives the link, and stops; the CI checks of the pull request do the testing
  - `Exigir aprovação de outra pessoa` is `nunca`, `só sem terminal`, the default, or `sempre`. It holds the merge until another person approves; a green check or owning the repository does not replace that approval. Without a terminal, a merge never happens in the request that opened the pull request
  - After a merge, checks the sync when the project syncs the repository with another tool, such as the skill pages in Notion
- **Test Criteria**:
  - [ ] A request to push to the base branch opens a pull request instead
  - [ ] A `claude/…` branch is renamed to `type/…` before its pull request opens
  - [ ] A merge request on a pull request with an unresolved thread handles the review comments first
  - [ ] A merge request with a failing check stops and names the check while `Exigir CI verde` is on

### definir-agenda
- **Stability**: experimental
- **Description**: Create, review, alter, reserve, create demand, or sync a Google Calendar event
- **Properties**:
  - Lives at `.agents/skills/definir-agenda/SKILL.md`
  - Reads `Agendas` from the project instructions: each calendar by name and optional ID, with its use (`padrão`, `em uso`, `só leitura`, `aposentada`, or `ignorada`) and an optional purpose. Without a `padrão` calendar, the default is the account's main calendar
  - Reads the list and property names from the data mapping of the project
  - Creates, reviews, or alters a commitment, opportunity, meeting, delivery, or commercial event on Google Calendar, the operational agenda, which is probably connected through Notion Calendar, copying the name and time from the Notion source the person indicated
  - Before changing the title, time, date, place, or context of an event tied to an opportunity, a deal, or a contact point, reads the canonical Notion page and prefers the structured property it already has
  - When the agenda and Notion disagree, uses the most reliable and most recent canonical source, keeps the opportunity's structured date and time as the base, lets an explicit correction prevail, and says what the agenda updated and what it refused
  - Delegates the real event type to definir-tipo-do-evento before creating, reviewing, or altering, and writes only a commercial meeting, an internal commitment, a deadline, or a delivery
  - Searches the agenda by name variations before creating, updates a probable existing event, and asks before creating another when the match is uncertain
  - Before creating or altering, reads the calendars whose use is `aposentada` in `Agendas`, warns when one still has an event, suggests moving it to the default calendar, and moves it there when the person asks to move. It does not write the new event on the retired calendar
  - Checks that Calendar Tools, Google Calendar, Notion Calendar, or an equivalent agenda tool is connected, active, and ready before concluding it cannot act, starts the connection when the tool is available but not ready, continues the original task once it is ready, and explains a failed connection before offering a manual alternative
  - Leaves the route for an opportunity, a contact point, a course, a call, a recurring edition, a task, travel, and cost or payment to definir-tipo-do-evento
  - Writes, recreates, migrates, or reviews a contact-point event on the editable calendar named by organizar-ponto-de-contato, and does not use the removed dedicated calendar
  - Does not classify opportunity, deal, and contact point on its own; that distinction lives in definir-tipo-do-evento
  - Leaves a reservation, a provisional block, a pending event, or a reminder to definir-reserva
  - Leaves a career reservation made before demand exists to definir-agenda-de-popstar
  - Copies an annual Google Calendar title from the record in the list of significant dates and leaves that record to definir-data-significativa
  - Reads the date-with-weekday format from the YAML mapping under Parâmetros de configuração, the first level-2 heading, outside the frontmatter
  - Writes the weekday beside each date in replies, summaries, tables, and descriptions, after checking it against the event date, time, and time zone, and keeps the structured calendar field valid
  - Leaves the production day, the reduced journey, and Saturday alternation to definir-jornada-de-producao, and records the reduced day and the reason in the event description when that skill says so
  - Leaves a trip itinerary to definir-viagem
  - Leaves a trip, mission, opportunity, or Cronograma item that has a date and no confirmed start and end to sincronizar-cronograma, unless the person states it as the plan for a named day
  - Leaves the guest list to definir-convidado
  - Does not invent a date, a time, or a duration
  - When the person states what happens on a named day, records those blocks without asking permission, as all-day blocks when no hour was stated
  - Asks for the departure hour of a confirmed trip and does not record it without one; for a trip not yet confirmed, offers a reservation at an approximate hour or for the whole day
  - Does not write health guidance, and sends a block that would erase one of the `Compromissos de vida` to definir-agenda-de-popstar
  - Leaves the opportunity, the fair, the course, the call for entries, the recurring edition, and the task with their own skills, and offers to create a missing opportunity without creating it
  - Leaves a question about what is already on a day or a week to procurar-agenda
  - Leaves the popstar agenda, reverse planning, and life protection to definir-agenda-de-popstar
  - Leaves time audit to revisar-uso-do-tempo
  - Leaves the learning-resource page, its transcription, and its notes to definir-recurso-de-aprendizado
  - Checks spelling with definir-grafia before the title, sends an external event title to the skill that `Habilidade de tom de voz` names, when there is one, with the canonical name, and puts the canonical page link, one sentence, and only useful search variants in the description
  - Writes a title that a person or an AI can search, with the most searchable canonical name, and with edition, date, city, and a short context when those help
  - Does not save a title that is only Reservado, Evento, Reunião, or Feira, and a provisional title may start with Reservado para or A confirmar when it also carries the canonical name
  - Asks whether a meeting is in person or remote before creating it, and creates a Google Meet link when it is remote
  - Does not ask the person to name the skill
  - Closes with a short summary, lists each event as created, altered, kept, removed, or provisional, and names the time zone used
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses the production day, the day or week lookup, the popstar agenda, reverse planning, life protection, time audit, the body of work, a significant date, a trip itinerary, registering the opportunity, organizing the contact point, and creating a task
  - [x] Before saving, the skill delegates the event type to definir-tipo-do-evento

### definir-agenda-de-popstar
- **Stability**: experimental
- **Description**: Turn a named intention into career structure, plan backward from a milestone, confirm each commitment's sense, and protect life
- **Properties**:
  - Lives at `.agents/skills/definir-agenda-de-popstar/SKILL.md`
  - Weighs each commitment with `Critério de sentido` from the project instructions
  - Turns a stated dream or objective into a milestone, commitments, responsible people, a duration, and completion evidence, and does not invent the person, the duration, or the evidence
  - Follows the popstar agenda, which turns intention into structure by combining the named segment, business, communication, money, health, affection, and rest so a career can last
  - Uses `Segmento` from the project instructions as the career segment, such as fashion or music, or the segment the person names
  - Turns a dream into a business through dates, commitments, processes, costs, and expected results, and keeps rigor distinct from perfection
  - Includes the `Atividades do segmento` of the project, and only what was named
  - Uses "Não faça uma peça de sucesso, faça história" as the sense criterion, confirms how each commitment supports history, positioning, revenue, learning, health, or important relationships, and does not invent that support
  - Records an investment of the person's own resources only with a hypothesis, a limit, a cost, a payback period, and a review criterion
  - Reschedules a commitment instead of dropping it, and after more than six months asks for a review of the block and a care action without writing health guidance
  - Organizes the next move for the career stage and prioritizes revenue and financial breath for authorial projects
  - Reads the block-review threshold from the YAML mapping under Parâmetros de configuração
  - Plans dependencies backward from the final date the person chose, includes the margin for review and unforeseen events only when the person or the source named it, and does not invent the slack
  - Answers a reverse plan with the milestone date, stages, dependencies, margin, expected cost, and completion criterion, plus a short summary and the time zone, and does not invent the cost or the criterion
  - Closes every reply with a short summary and the time zone when a date or time is present, and leaves each written event's status to definir-agenda
  - Protects the `Compromissos de vida` that the person, the source, or Google Calendar already named, and does not let a career block erase them
  - Does not write health guidance
  - Sends each defined block to definir-agenda and does not write the Google Calendar event
  - Reserves time for cultural activity, relationships, prospecting, communication, event participation, backstage, the activities of the segment, and lifestyle before spontaneous demand exists, only when the action coheres with the business, and does not register that block as an opportunity
  - Leaves the provisional or confirmed nature of that block to definir-reserva, time audit and the body of work to revisar-uso-do-tempo, a question about what is already on a day or a week to procurar-agenda, and managing a trip to definir-viagem
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing, reviewing, or altering the Google Calendar event, auditing time use, the day or week lookup, a significant date, travel, and replacing health guidance

### definir-arquivos-da-habilidade
- **Stability**: experimental
- **Description**: Place the scripts, references, templates, and tests of a skill, and write Scripts disponíveis
- **Properties**:
  - Lives at `.agents/skills/definir-arquivos-da-habilidade/SKILL.md`, split from criar-habilidade, which points to it
  - Keeps a script used by one skill in its `scripts/`, and a script used by several in `.agents/scripts/<nome>/`
  - Names scripts and shared script folders in `Idioma do nome dos scripts`, English by default and overridable in the project instructions
  - Keeps input and output templates out of the body, with one sentence that says when to read them
  - Keeps commands out of the steps and lists them only in Scripts disponíveis, with a path for Notion, where the script may be missing
- **Test Criteria**:
  - [x] The skill is present at that path

### definir-artista
- **Stability**: experimental
- **Description**: Register or review an artist or band in the artists database from loose material
- **Properties**:
  - Lives at `.agents/skills/definir-artista/SKILL.md`, moved from a business harness
  - Reads the artists data source name, the field names, the entry curation status, the page and Spotify profile templates, and the sensitive and automatic fields from the project instructions
  - Runs procurar-artista first, and stops when it finds several pages
  - Shows a plan with the current value, the proposed value, and the source of each field, and writes only after confirmation
  - Keeps dated facts in chronological comments on the artist page, never in the internal notes
  - Writes sensitive fields only with the artist's consent, and keeps member documents on each person's page
- **Test Criteria**:
  - [x] The skill is present at that path

### definir-ativo-imobilizado
- **Stability**: experimental
- **Description**: Register, review, and govern a durable fixed asset
- **Properties**:
  - Lives at `.agents/skills/definir-ativo-imobilizado/SKILL.md`
  - Reads the fixed asset list and its property names from the data mapping of the project, when the person does not name another list
  - Keeps durable, identifiable, non-fungible assets in the fixed asset list
  - States whether the item goes to the fixed asset list or the stock list before creating or linking a page
  - Keeps a durable good subject to depreciation, such as a machine, tool, rack, mannequin, display, computer, or structure, in the fixed asset list
  - Sends fabric, trim, thread, buttons, labels, packaging, production inputs, and consumable office material to the stock list through gerenciar-estoque, including when the purchase was an investment
  - Asks before creating or linking when the destination is unclear, including a hybrid item that wears and can be repaired, and when the choice is among fixed assets, stock, parts, production, or financial context alone
  - On create or update, links the matching entry from the expense list through the cost and investment entries when that property exists, and keeps the amount paid, the purchase date, the supplier, and the evidence used
  - Leaves the financial entry that originated the purchase to lancar-despesa-da-empresa, and does not treat the origin as resolved when no reliable entry exists
  - Starts a purchase of a durable good from that entry, and records the amount paid, the purchase date, and the buyer as the responsible person
  - Relates an existing cost category and an existing owner company, and does not treat the closed brand list as the company
  - Sends a supplier, manufacturer, brand company, or owning company to definir-empresa for lookup, registration, or reconciliation
  - Stores the SKU without a hyphen
  - Leaves state, maintenance, repair, loan, partnership, write-off, disposal, sale, loss, exchange, and depreciation of an existing asset to registrar-ciclo-do-ativo
  - Reads "do we have this asset today" as whether that fixed-asset record exists now, leaves that search to identificar-duplicata, and asks when the sentence does not separate the day from the asset
  - Searches similar assets in Notion through identificar-duplicata before creating or updating one, using the name, category, kind, brand, model, SKU, open and closed dimensions, supplier, purchase date, price, photo, product link, and financial entry when they exist
  - Shows what matches and what differs on a compatible asset, asks before merging, updating, linking, or creating, and does not create a duplicate from a slightly different title or description
  - Reads a receipt, invoice, item photo, product link, or context when it brings useful data, fills the matching structured property, keeps the financial receipt on the expense entry, and uses the page body for context, a decision, a pending item, or a note without a property
  - Leaves that search to identificar-duplicata and merging the same asset to mesclar-registro
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses stock, recording the payment, the asset life cycle, what is on today, an existence-only check, merging the same asset, creating the company, and creating the cost category

### definir-campanha-de-conteudo
- **Stability**: experimental
- **Description**: Create, review, follow, or close a content campaign, including promoting a topic to a campaign
- **Properties**:
  - Lives at `.agents/skills/definir-campanha-de-conteudo/SKILL.md`
  - Reads the list of content campaigns and its property names from the data mapping of the project, with the list of posts and the list of significant dates when the mapping has them
  - Anchors the window on a significant date, moves a past reference date to its next occurrence, and avoids overlapping another campaign or another dated narrative
  - Writes the strategy in the page body, with weekly stages that each carry an editorial role, suggested content, and metrics, and sends the promise and the call to action to `Habilidade de tom de voz`
  - Keeps the status in line with the window, and records the origin when a post topic becomes a campaign without deleting that post
  - Starts the editorial goal from `Referências da estratégia de conteúdo`, and any reference the person gives
  - Leaves the posts of the campaign to planejar-calendario-de-conteudo
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating the campaign posts, checking the calendar mix, writing the script or the caption, and registering the significant date

### definir-conta-bancaria
- **Stability**: experimental
- **Description**: Register, review, or update a bank or payment account, personal or business, and record what happened to it
- **Properties**:
  - Lives at `.agents/skills/definir-conta-bancaria/SKILL.md`
  - Leaves the existence-only check to identificar-duplicata, expenses to lancar-despesa-da-empresa, a received sale to the skill the project names, a missing company to definir-empresa, and a missing person to definir-pessoa
  - Treats a page whose title starts with a template title from the project instructions as a template and creates a new page instead of filling it
  - Links a business account to the holding company and a personal account to the holding person, and keeps both accounts of the same person apart
  - Fills branch, account, check digit, and holder only from the source
  - Keeps the account history in dated comments, never in the page body, and mentions other pages by ID
  - Reads the main Pix key from the account record and includes it, even a random one, when it gives payment details to someone who will pay; asks only when the project makes the key mandatory and the field is empty, then saves it in that field, and suggests the field when the list lacks it
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording the sale or the expense, registering the company or the holder, and an existence-only check

### definir-convidado
- **Stability**: experimental
- **Description**: Check each person's participation and locality before inviting them
- **Properties**:
  - Lives at `.agents/skills/definir-convidado/SKILL.md`
  - Verifies one by one who will actually attend, using inscriptions, opportunities, the schedule, trips, responsibility, confirmed descriptions, and localities as evidence
  - Does not invite every partner only because the commitment belongs to the company, sits on a shared calendar, or is a formative opportunity
  - Invites each person only for the commitment that matches their physical presence, confirmed participation, or operational responsibility when they are in different cities or squares in the same period
  - Treats a simultaneous geographic conflict as an agenda split
  - Removes a wrong guest only after authorization and names that correction in the operation summary
  - Asks before sending or removing an invite when individual participation stays ambiguous
  - Leaves the event time to definir-agenda, an untimed schedule item to sincronizar-cronograma, the inscription status to definir-inscricao, and time audit to revisar-uso-do-tempo
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording the event time, syncing an untimed item, updating an inscription, and auditing time use

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
  - Reads the date-with-weekday format, the annual-title pattern, and the calendar sources from the project instructions. Each source in `Fontes de calendário` has its URL and the country code that site uses, and the skill asks the code when a URL needs it and it is empty, the default
  - When a holiday or commemorative date has no source in the material, follows the calendar sources Notion usually uses, with that year and the country code of each source, without restricting the source to them, and reads a missing date from the page consulted
  - Writes the weekday beside each date in replies, summaries, tables, and descriptions, after checking it against the event date, time, and time zone, and keeps the structured field valid
  - Leaves a question about when the date falls, or whether it is already listed, to procurar-data-significativa
  - Leaves the day or week lookup and the calendar event to other skills
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses looking up when the date falls, the day or week lookup, creating or changing the calendar event, reverse planning, managing travel, registering the opportunity, organizing the contact point, and creating the task

### definir-empresa
- **Stability**: experimental
- **Description**: Register, update, validate, or consolidate a company, including a supplier
- **Properties**:
  - Lives at `.agents/skills/definir-empresa/SKILL.md`
  - Reads the company list, its property names, and its options from the data mapping of the project, when the person does not name another list
  - Leaves the existence check to identificar-duplicata, spelling to definir-grafia, the social profile to definir-perfil-social, and merging the same item to mesclar-registro
  - Requires a responsible person when validating an active, potential, or relevant supplier for a quote, purchase, partnership, or commercial relationship
  - Supports a minimal payment-recipient record from evidenced identity after deduplication, returns its page to the caller, and keeps a missing site and legal name pending, and a missing contact only for a continuing relationship, without declaring commercial validation complete
  - Prefers a manager, commercial representative, seller, owner, or the contact who handles service
  - Adds the supplier option to the audience type when that fits, without removing the values already there
  - Checks the related companies on the person and relates the company when that inverse link is missing
  - Uses notes only to qualify the role, context, pending item, or certainty, and does not treat the owners or the reviewer as that person
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses an existence-only check, spelling, social-profile normalization, merging the same item, and deleting without an order
  - [ ] A payment recipient identified by name and company identifier is registered without inventing a responsible contact and returned for linking to the payment

### definir-grafia
- **Stability**: experimental
- **Description**: Settle the spelling of a person or a company and keep a newly seen wrong form
- **Properties**:
  - Lives at `.agents/skills/definir-grafia/SKILL.md`
  - Reads the list of people and the company list, with their property names, from the data mapping of the project, in the connected workspace
  - Writes the full name or the company name in the reply, and searches with every variation plus the correct first name and surname as plain text, without the from: operator
  - Treats a nickname and the correct first name of one record as the same person, and does not report a first-name search as a miss for the nickname
  - Appends a previous or wrong form in the same bullet style, without replacing the record name or the existing items, and leaves a rename or a canonical-name consolidation to mesclar-registro
  - Does not write when more than one record matches, and does not create the company
  - When a screenshot shows a missing person or profile, follows definir-pessoa and definir-perfil-social for what is missing, and uses the record that already exists
  - Resolves names in dictated commands accompanying images, including expense requests, before the caller writes them
  - Returns the canonical name, record link, and search variants to the caller without altering the original evidence or executing the operation
  - Treats phonetic similarity as a candidate, not identity confirmation; an explicit correction pointing at a record confirms the match
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating the company, renaming the record, and executing the destination operation
  - [ ] The dictated-command correction returns the confirmed record and preserves existing variants

### definir-historia-de-usuario
- **Stability**: draft
- **Description**: Write, review, or refine the user story of a demand
- **Properties**:
  - Lives at `.agents/skills/definir-historia-de-usuario/SKILL.md`
  - Holds only the title until its procedure is written from a real task
- **Test Criteria**:
  - [x] The skill is present at that path

### definir-instrucoes-do-projeto
- **Stability**: experimental
- **Description**: Write and review a project's instructions file so that it holds only what every session needs, as ADR 0008 decides
- **Properties**:
  - Lives at `.agents/skills/definir-instrucoes-do-projeto/SKILL.md`, with the output model `agents-md` at `.agents/assets/templates/agents-md.md`, cited by name
  - Measures the instructions with the skill checker before and after, against the skill body limits
  - Classifies each passage by destination: stays, contributing guide, architecture map, design document, a new skill, product documentation, the data, or the parameters in the frontmatter
  - Writes in the language set by "Idioma das instruções do projeto", Brazilian Portuguese by default, which a project changes in its own `AGENTS.md`, one rule per line, with separate parts for anywhere, Notion only, and coding tools only
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
  - Spells names through definir-grafia
  - Does not store the order number, does not put the photo in the page body, and does not decide whether a task exists
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses only celebrating without saving, only looking up who registered, and deciding whether a task exists

### definir-issue-do-github
- **Stability**: experimental
- **Description**: Open, review, edit, or translate a GitHub issue for a technical demand
- **Properties**:
  - Lives at `.agents/skills/definir-issue-do-github/SKILL.md`, with the output template at `.agents/assets/templates/issue-do-github.md`
  - Reads `Repositório` from the project instructions or the `origin` remote, and `Idioma da issue`, declared in `Global` and overridden per project
  - Searches open and closed issues before opening one, and stops when one already covers the demand
  - Writes a Conventional Commits title whose type comes from the effect of the delivery, with the description and the body in `Idioma da issue`
  - Writes the problem with the real case, the proposal, and a verifiable done criterion
  - Translates an issue in another language without losing links or references
- **Test Criteria**:
  - [x] The skill is present at that path

### definir-jornada-de-producao
- **Stability**: experimental
- **Description**: Decide whether a day is a production day and how long that block lasts
- **Properties**:
  - Lives at `.agents/skills/definir-jornada-de-producao/SKILL.md`
  - Reads weekday production duration, reduced production duration, and reduced end time from the YAML mapping under Parâmetros de configuração
  - Uses the weekday production duration inside the agreed window, and the reduced duration ending at the reduced end time on a holiday, Saturday, or Sunday only after an explicit request
  - Leaves Saturdays committed to a fair, a pop-up, or a commercial event free of production, and follows the Saturday alternation interval the person defined
  - Leaves recording the event, including the reduced-day note in the description, to definir-agenda
  - Leaves the contact point to organizar-ponto-de-contato
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording the event, the day lookup, the popstar agenda, and organizing the contact point

### definir-lancamento
- **Stability**: experimental
- **Description**: Interpret a simple sale or expense and route what is not that entry
- **Properties**:
  - Lives at `.agents/skills/definir-lancamento/SKILL.md`
  - Reads `Moeda`, `Moedas estrangeiras`, `Habilidade de venda`, and `Habilidade de projeção de caixa` from the project instructions
  - Records an expense in a foreign currency with the original amount, the exchange rate, and the amount in `Moeda`, and asks when the rate is missing
  - Asks before recording when company or personal, sale or expense, or the payment form is missing
  - Keeps a personal entry out of the company source and sends a company expense to lancar-despesa-da-empresa
  - Sends a sale to the skill that `Habilidade de venda` names, when there is one, and does not store it in the expense list
  - Classifies a company expense with the configured classes and does not create a missing category
  - Adds the entry to what the source already has and does not rebuild or delete prior entries
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses the DRE, the cash-flow statement, the price, the monthly plan, the durable good, and the fair cash projection

### definir-link-rastreavel
- **Stability**: experimental
- **Description**: Build, review, or fix the UTM parameters of a link by the standard meaning of each parameter, with no internal id or personal data
- **Properties**:
  - Lives at `.agents/skills/definir-link-rastreavel/SKILL.md`
  - Answers to the earlier names `definir-link-utm`, `definir-parametros-utm`, `definir-rastreio-de-link`, and `gerar-link-com-parametros-utm` through `metadata.aliases`
  - Reads the allowed sources and mediums from a field of a data source in the connected workspace when the project names one, or else from the parameter lists, and asks instead of inventing a value
  - Reads the own domains from parameters
  - Puts the internal role of a team member who promotes with their own profile in `utm_marketing_tactic`, from the `Táticas` list, with their public handle in the campaign name and never their name
  - Builds `utm_campaign` from the `Modelo do nome da campanha` template when the project sets one, dropping a bracketed part with its separator when its value is empty, and treats a generator, API, MCP or command line that builds the name another way as a failed check
  - Keeps `utm_term` empty except for a paid keyword or an automation keyword
  - Separates words in every value with one `Separador`, underscore by default, in every place that builds links (site, on-screen generator, API, MCP, command line), and converts slugs to it
  - Never puts an internal id (page, database, record, user, or CRM) or personal data in any parameter, and uses the public name, such as the event slug, in `utm_campaign`
  - Allows `utm_id` only for a public campaign id: one from an external platform, or one the project generates, which may combine the event with who promotes it (the brand, an artist, or an influencer); never a UUID or an id the site API returns
  - Keeps `utm_id` optional in a link generator, whether a screen, an API, an MCP, or a command line, and never fills it with the event id
  - Puts UTM on a link to the same site only when the `UTM em link no mesmo site` parameter says so, for sites whose next page forwards the UTMs to another site
  - Says "link to the same site" and "link to another site" instead of "internal link", which also names the internal area of a site
  - Reviews a link, a generator, or code and names each failed check, where it is, and the right value
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### definir-obrigacao-financeira
- **Stability**: experimental
- **Description**: Register or review a contract or debt that generates charges, such as a plan, a consortium, a card, or a loan
- **Properties**:
  - Lives at `.agents/skills/definir-obrigacao-financeira/SKILL.md` and stays internal while it is validated
  - Keeps the obligation apart from each bill or payment, which goes to lancar-despesa-pessoal or lancar-despesa-da-empresa
  - Sets the context from the original purpose and the status from evidence, with a review date or a review condition for a postponed debt
  - Treats a collection agency, a negotiation offer, or a "CPF notified" subject as unconfirmed, and points to the creditor's official channel
  - Always states the due date with the amount, or says the amount is missing and where to find it
  - Moves a due date that falls on a weekend or holiday to the next business day when the contract says so, checking holidays through procurar-data-significativa and the legal source
  - Sends due-date reminders to the calendar of the obligation's context
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### definir-perfil-social
- **Stability**: experimental
- **Description**: Normalize a social profile when registering or consolidating it
- **Properties**:
  - Lives at `.agents/skills/definir-perfil-social/SKILL.md`
  - Reads the social profile list and its property names from the data mapping of the project, when the person does not name another list
  - Runs when a social profile is registered or consolidated, and leaves the existence check to identificar-duplicata and the page merge to mesclar-registro
  - Does not treat a single profile as proof the person is unique; the related person check stays with identificar-duplicata, and two records of the same person go to mesclar-registro
  - Writes the title as the normalized canonical identifier: a handle without @, in lowercase, and without spaces
  - Stores a website's full URL on the profile URL property, and keeps that URL out of the title
  - Records useful search forms in Variações de nome as a bullet list, one name per item, each item ending with a semicolon, including an @ form, letter case, a nickname, an alternate URL of the same origin, and forms with and without an acronym or a year
  - Links a similar but different profile in Não confundir com immediately, adds a clarifying search form, asks before saving when the pages are uncertain, and proposes the property when it is missing
  - Keeps each profile on its own canonical record
  - Does not only check existence, merge a record from another list, lock a person's or company's spelling, or delete without an order
  - When a spelling screenshot shows a missing profile, creates that profile, writes the fields the screenshot shows, stores the screenshot in the screenshots property, and relates the person
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses an existence-only check, merging a record from another list, locking a person's or company's spelling, and deleting without an order

### definir-pessoa
- **Stability**: experimental
- **Description**: Register or update a person
- **Properties**:
  - Lives at `.agents/skills/definir-pessoa/SKILL.md`
  - Reads the list of people and its property names from the data mapping of the project
  - Creates a missing person in the list of people when a spelling screenshot shows that person
  - Writes the full name as the person's name and keeps the handle out of that name
  - Relates the social profile after the profile exists, and leaves the profile to definir-perfil-social
  - Uses an existing person instead of creating another, and lists several matches without creating
  - Does not invent email, phone, pronouns, audience, or a company
  - Does not only check existence, lock the spelling of someone already listed, register the profile, register the company, or delete without an order
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses an existence-only check, locking the spelling of someone already listed, registering the profile, registering the company, and deleting without an order

### definir-planejamento-financeiro
- **Stability**: experimental
- **Description**: Build or revise one month of financial planning
- **Properties**:
  - Lives at `.agents/skills/definir-planejamento-financeiro/SKILL.md`
  - Reads `Moeda` and `Habilidade de projeção de caixa` from the project instructions
  - Plans sales, expenses, a profit goal, cash, and practical actions for the month
  - Asks for a forecast or a goal the person did not state, and does not invent them
  - Leaves recording to definir-lancamento, the statements of what already happened to revisar-financas, and the cash projection to the skill that `Habilidade de projeção de caixa` names, when there is one
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording a sale or expense, building the income statement, moving stock, and projecting fair cash

### definir-recurso-de-aprendizado
- **Stability**: experimental
- **Description**: Keep a class in the list of learning resources and on Google Calendar, linked to the opportunity
- **Properties**:
  - Lives at `.agents/skills/definir-recurso-de-aprendizado/SKILL.md`
  - Stores the class as a page in the list of learning resources, linked to the opportunity, for the transcription and the notes
  - Keeps that page in sync with the event on Google Calendar, which is probably connected through Notion Calendar
  - Searches the calendar by title variations before saying the resource is not registered
  - Creates or updates the page from the event's date, times, title, location, meeting link, and description
  - Links the page to the canonical opportunity or group when the relation is clear
  - A class may be online or in person, and the difference waits for what the person teaches
  - Leaves the day or week lookup to procurar-agenda, and the calendar event to definir-agenda
  - Writes the weekday beside each class date in replies and descriptions, after checking it against the event date, time, and time zone, and keeps Data e hora as a valid start and end
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses the day or week lookup, creating or changing the Google Calendar event, registering the opportunity, organizing the contact point, and creating the task

### definir-reel-do-instagram
- **Stability**: experimental
- **Description**: Create, review, complete, or register an Instagram Reel in the list of posts
- **Properties**:
  - Lives at `.agents/skills/definir-reel-do-instagram/SKILL.md`
  - Reads the list of posts, the list of content formats, and their property names from the data mapping of the project
  - Finds the Reel format record by `Formato do Reel`, or, when it is empty, searches the list of formats for the Instagram Reel and asks when it finds more than one
  - Gets the script from definir-roteiro-de-video and sends the caption wording to `Habilidade de tom de voz`
  - Links the Reel to one or more narrative axes from the list of narrative axes, and takes the name, date, time, and address of an event from the event page
  - In an event Reel, makes the lines and the caption each say on their own what happens, the date, the time, the address, why it is worth going, and the action, without relying on comments or outside context
  - Writes a caption that complements the video, fits the caption limit of the format, and ends with one main call to action tied to the goal, naming the action and where to do it, on the same path as the call to action of the video and with a destination that exists when the post goes out
  - Puts hashtags in their own property, at the ideal count of the format without passing its maximum, or up to 5 when the format has none, each tying the topic to the niche of the profile
  - Counts the Reels in the 7-day window that starts on the posting date against the minimum and maximum goals of the format, shows the other formats in that window, and suggests another date without blocking
  - Compares the Reel with the posts of the 7 days before and after, so the same topic, axis, or narrative does not repeat in a row, and states the goal it serves from `Referências da estratégia de conteúdo`, a Notion page or other references with the original content strategy, or from the person, asking before writing when there is none
  - Writes the caption only to the AI caption, keeps the human caption, keeps the notice that opens the page body, and writes the script below it
  - Answers in the output template `.agents/assets/templates/reel-do-instagram.md`, one heading per page property plus the body, with the human caption left empty
  - Links exactly one author profile, the one that publishes, and records a collab in the editorial notes instead
  - Keeps one page per Reel, links the format and the author profile as relations, keeps counts and checks out of the page body, lists a value without a mapped property at the end instead of writing it in the body, and reads the page again after writing
  - Reviews an existing Reel by reading the whole page first, shows the before, the after, and the gain for each changed item, treats body text without clear authorship as human, and replaces human text only with a yes for that passage
  - Follows `Arquétipos da marca` or records the persona as inferred in the editorial notes, and does not invent the profile, the speaker, the date, or the format limits
  - Reads the whole project instructions before writing, not only the parameters, and starts from the default definitions of the business and its founder when the request does not name the author profile, the speaker, or the persona
  - Takes the default author profile from the Instagram profile linked to `Empresa do negócio` in the list of companies, or, with `Perfis por praça` set to `sim`, from the list of social profiles by the place of the Reel, and asks when either is missing
  - Defines the voice before writing or changing the script: the speaker owns the lines, the author profile owns the caption, the delivery notes name the speaker, the call to action points to the author profile, and only the profiles the person named are tagged
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses choosing words in the tone of voice, registering only the idea, publishing the post, and creating a carousel

### definir-registro-de-reuniao
- **Stability**: experimental
- **Description**: Register or fix the record of a meeting from a pasted transcript, wherever the project keeps its records
- **Properties**:
  - Lives at `.agents/skills/definir-registro-de-reuniao/SKILL.md`
  - Reads from the project instructions where the records live: local files, a Notion database, Confluence pages, or documents in Google Drive, and asks once when the type or the address is empty
  - Keeps an index file for local files, and treats the Notion database, the Confluence page tree, or the Google Drive folder as the index
  - Keeps an index document in Google Drive only for meeting documents outside the folder, such as those another account created, and lists them by link
  - Names a local file with an ASCII slug and titles a Notion page, a Confluence page, or a Google Drive document with natural text, each by its own pattern from the project instructions
  - Uses a document that already holds the transcript, such as the notes a meeting tool generates, as the record, without copying its text
  - Looks the meeting up in the index before creating it, and fixes the existing record instead of creating another
  - Finds the title, date, start time, and participants through procurar-agenda before asking, and asks once when no single event fits
  - Registers a missing participant through definir-pessoa, and keeps the right spelling and the wrong forms speech recognition produced through definir-grafia
  - Checks a Notion database for a duplicate through identificar-duplicata, and leaves two records of the same meeting to mesclar-registro
  - Starts every record with a level 1 heading and a block with date, participants, and source
  - Keeps the raw transcript unchanged after the summary, and applies spelling corrections only to the summary
  - Records as a decision only what was said as a decision, and marks illegible passages as uncertain
  - Does not assign an action to a person from the pronoun or the position of a line when the transcript does not say who speaks, and asks for each assignment with the hypothesis ready
  - Lists each unknown name or term with the lines around it and asks, and records only what the person confirms, in the spelling variations for a name and in a source of corrections for any other term
  - Keeps the topics the project lists out of the summary, while the raw transcript keeps them
  - Never sends a record outside the place the project names
  - Does not find the context of a past meeting or write the minutes
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### definir-reserva
- **Stability**: experimental
- **Description**: Keep a reservation, a provisional block, a pending event, or a reminder provisional until participation is explicitly confirmed
- **Properties**:
  - Lives at `.agents/skills/definir-reserva/SKILL.md`
  - Keeps that provisional nature when there is no explicit confirmation, and does not turn a reservation into confirmed participation only because an opportunity is approved
  - Updates the title and the description when the person confirms participation, and records stock, payment, curation, agenda, travel, or a third-party confirmation as a pending condition
  - Leaves the calendar write to definir-agenda, a career reservation made before demand to definir-agenda-de-popstar, and an untimed schedule item to sincronizar-cronograma
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording the event time, reserving career time, syncing an untimed item, and auditing time use

### definir-roteiro-de-video
- **Stability**: experimental
- **Description**: Write, review, or adapt a ready-to-record script for a short video
- **Properties**:
  - Lives at `.agents/skills/definir-roteiro-de-video/SKILL.md`
  - Writes the full lines scene by scene, with a hook in the first 3 seconds, time ranges, on-screen text, and each line in a blockquote after a specific bracketed delivery note that names the speaker, tone, pace, volume, stressed word, and pause
  - Puts the recording part first and short, and keeps delivery notes, scene actions, and recording direction out of the lines, the on-screen text, and the caption
  - Adapts a reference script by keeping its structure and narrative triggers and changing the literal theme, with real and verifiable people and a source link for every fact
  - Gives a workable way around each likely obstacle to recording, such as unlicensed audio or someone who does not want to appear
  - Ends with why the script will work, and follows `Arquétipos da marca` or marks the persona as inferred
  - Reads `Referências da estratégia de conteúdo`, and any reference the person gives, before writing, so the script serves the brand's content strategy
  - Sends the wording to `Habilidade de tom de voz`, and leaves the caption and the post to the skill that called it
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses choosing words in the tone of voice, writing the caption, registering the post, and generating the video with AI

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
  - When a spelling is uncertain, follows definir-grafia and writes the correct form
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

### definir-tipo-do-evento
- **Stability**: experimental
- **Description**: Decide the real type of a commitment before the agenda writes it
- **Properties**:
  - Lives at `.agents/skills/definir-tipo-do-evento/SKILL.md`
  - Classifies the commitment before a create, review, or alter, and asks when the type is unclear
  - Treats an opportunity as the edition, the date, the curation, and the chance to participate, a deal as the conversation or commercial meeting, and a contact point as real participation
  - Does not turn a meeting or a review into a contact point, and does not record an approved opportunity as a contact point until the participation days are confirmed
  - Sends an existing opportunity to procurar-oportunidade, a missing one to an offer of criar-oportunidade, a contact point to organizar-ponto-de-contato, a course to procurar-oportunidade and definir-recurso-de-aprendizado, a call to the opportunity regulation, a recurring edition to definir-grupo-de-oportunidades, a task to definir-tarefa, travel to definir-viagem, and cost or payment to lancar-despesa-da-empresa
  - Leaves the write of a commercial meeting, an internal commitment, a deadline, or a delivery to definir-agenda, and keeps a deadline distinct from a delivery
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing the Google Calendar event, reserving career time, auditing time use, and looking up the day

### definir-viagem
- **Stability**: experimental
- **Description**: Register, update, deduplicate, and organize one canonical trip of the business
- **Properties**:
  - Lives at `.agents/skills/definir-viagem/SKILL.md`
  - Reads the trip, lodging, locality, and schedule lists and their property names from the data mapping of the project
  - Keeps one canonical trip on the trip list, locates it by origin, destination, and equal or overlapping dates before any create, treats BH and Belo Horizonte as the same origin and RJ, Rio, and Rio de Janeiro as the same destination, updates a safe match, asks when several match or the match is unsafe, asks for a missing route or dates instead of creating, and creates one trip with only confirmed data when none matches. Keeps origin, destination, dates, lodging, and existing investments on that trip. Resolves origin and destination through the locality list, links the page that already matches the name or the abbreviation, and does not create a locality
  - Chooses the travel stage from the closed list. Saída is leaving home, the hotel, or a meeting point. Ida and Volta are the general outbound and return legs when no more specific milestone exists. Check-in confirms the trip or enters the lodging. Embarque is boarding. Decolagem and Pouso are the flight's actual departure and arrival. Transfer is organized ground movement. Atividade is a visit or program. Check-out is leaving the lodging. Airport arrival keeps an empty stage
  - Updates a schedule row that already matches the trip, the name, the stage, and the date when its time is empty or equal, asks when that time differs or several rows match, and creates a separate row for each other operational milestone, linked to the trip and to the opportunity when that opportunity already exists. Puts an informed time on Início planejado, puts Fim planejado only when the source gives an end of that same event, fills each actual time only when that timestamp is known, keeps a future event as Planejado, and records a known date with a pending time as the date plus the pending note in Contexto e observações, without an approximate time
  - Answers who will drive the person, or whether a bus is needed, from the flight number and the takeoff time of the outbound and return legs, and does not substitute boarding or another milestone for that takeoff
  - Leaves an unconfirmed time empty, and does not copy the next milestone's time or use an all-day block in its place
  - Distinguishes a confirmed fact, a pending item, and conflicting sources. Leaves the pending item empty and named, keeps both conflicting sources, and lets a more recent and explicitly official source prevail. Does not invent a city, an airport, a hotel, a time, a transfer, or a responsibility
  - Links each lodging to the trip only when the name or the address is reliable, because a trip can have more than one. An address without a confirmed name becomes the lodging title. The written address, the address complement, the map place, the room, the breakfast, and a covered expense without a ledger entry stay on that lodging. A financial entry follows lancar-despesa-da-empresa and relates to the trip, and an organization-covered amount stays distinct from an expense the participant owes. General weather and packing guidance, such as cold, heat, dry weather, rain, and what kind of clothes to bring, stays named on the trip. It is not a product of the business, and no property is created for it. Cronograma keeps the operational event, its stage, its times, its owners, and the note for that event
  - Puts a flight number, which has no property of its own, in the milestone context, without repeating date, time, or place
  - Does not write the flight, the lodging, or the guidance on an opportunity or an inscription
  - Does not create a trip when the person only asks whether one exists or which day it falls on
  - Leaves a dated milestone with no confirmed start and end to sincronizar-cronograma, a confirmed calendar time and a named-day plan to definir-agenda, and a financial proof or an amount to lancar-despesa-da-empresa
  - Does not promote the trip to confirmed without evidence, and does not cancel it without explicit evidence
  - Does not close a trip by the person's own vehicle until acompanhar-veiculo has the protection extension requested or refused
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording an event that already has a time, syncing a date-only milestone, posting the amount, registering the opportunity, and registering someone

### definir-vocabulario
- **Stability**: experimental
- **Description**: Register and update one or more voice-vocabulary terms
- **Properties**:
  - Lives at `.agents/skills/definir-vocabulario/SKILL.md`
  - Registers and updates terms for one language on five levels: forbidden, strongly_discouraged, discouraged, allowed_with_care, and allowed
  - Writes a term without an expected field and reports it as incomplete, and imports a batch from another tool with `terms --file`
  - Sends a question about a missing term or its variations to procurar-variacao-de-termo
  - Keeps categories English words in every language, translated by the Categorias parameter, and keeps the term and the notes in that language
  - Reads the brand sources named in the project instructions before answering or writing. An ambiguous channel, audience, line, commercial intent, or situation waits for a question
  - Keeps a term that only fits one context on a middle level, with when. allowed and forbidden stay general rules
  - Adds tags to a context term of one speaker, event, or channel, reusing a tag already in the glossary, and keeps when as the rule in words
  - Marks a name whose casing is part of the spelling with case_sensitive, so the write keeps its casing
  - Keeps the history and limits of a term in notes, apart from the description, without changing the level
  - Uses insert when the person is registering and does not name a mode, update when an existing term changes, and upsert when the batch does both
  - Corrects a stored term by sending only the fields that change, reading the row before and after, and clearing a field only when the person asks
  - Reads and writes with `node node_modules/harness/vocabulary/dist/cli.js lookup`, `exists`, and `terms` when there is a terminal, and with the MCP tools `lookup_term`, `exists_in_text`, and `write_terms` when there is not
  - Tests a large or imported batch with a dry run before it writes, and fixes every problem the refusal lists in one pass
  - Stops without a terminal and without the MCP server, as in a Notion agent
  - Leaves writing brand text to redigir-com-tom-de-voz, and does not invent a term
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing or approving brand text, classifying a phrase, and inventing a term

### descrever-habilidade-ou-schema
- **Stability**: experimental
- **Description**: Write or correct a skill or schema description, and test whether a skill description triggers, even when the person does not say description
- **Properties**:
  - Lives at `.agents/skills/descrever-habilidade-ou-schema/SKILL.md`
  - Does not write the skill body, grade output quality, describe a product, or write the skill page in Notion
  - Writes every description in the third person: what the skill does, "Usada quando" with the intent of whoever asks, and "Não serve para", as ADR 0013 decides
  - Keeps the triggers in the description, because Notion automatic use loads that property and decides from it whether to load the skill
  - Requires a trigger suite with an obvious task and a paraphrased request that should load the skill, and an unrelated topic plus a near miss the skill does not cover that should not
  - On undertriggering, when the skill does not load, the person enables it by hand, or asks when to use it, adds detail and the technical term
  - On overtriggering, when the skill loads for an irrelevant query, the person disables it, or the purpose is confusing, tightens the negative triggers
  - Leaves the skill name and the prompt examples out of the description; the examples stay in the body
  - A request that arrives through a synced copy, such as the Notion page, writes through criar-commit and criar-pull-request
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
  - A request that arrives through a synced copy, such as the Notion page, writes through criar-commit and criar-pull-request
  - Size and run profile follow medir-habilidade
  - Runs at the end of every core skill, following the `Modo de aprendizado` parameter (`sim`, `não`, `perguntar`, default `perguntar`): with yes, one commit per lesson on an English-named branch, pushed, with a draft pull request from the first commit, marked ready when the person ends the sequence
  - Takes the project instructions as a target too: feedback on the agent's behavior edits them in the format of `definir-instrucoes-do-projeto` and raises `metadata.version`, without evals or features of their own
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description says the test edits the validated skill, and refuses creating the first version, only checking whether the description triggers, only reviewing without running, and writing the skill page in Notion

### extrair-tarefas-da-reuniao
- **Stability**: experimental
- **Description**: Turn the action items of a registered meeting into tasks, one per item, without duplicates, in the sprint of the meeting date
- **Properties**:
  - Lives at `.agents/skills/extrair-tarefas-da-reuniao/SKILL.md`
  - Reads the meeting, the task list, and the sprint list from the project data mapping, and stops when one of them is not in the connected workspace
  - Acts only when the meeting status is ready to process, moves it to in progress before writing, and to processed at the end, with the three status names in the project instructions
  - Writes nothing and says it waits when the status is anything else, and asks when the meeting is already in progress
  - Keeps only short items with an infinitive verb and an observable result, and leaves out context, opinions, hypotheses, and history
  - Fills the owner only when the text names who does it, never from a pronoun
  - Picks the sprint whose period contains the meeting date, and leaves the sprint empty with a warning when none or more than one fits
  - Checks each item through procurar-tarefa and the order of identificar-duplicata, and merges items of the same meeting that ask for the same delivery
  - Validates a plan of every item before writing, and creates each new task through definir-tarefa with the status the project instructions name
  - Uses an existing equivalent task as canonical, and fills only its empty sprint, after the person confirms which sprint fits, with the sprint of the meeting date as the suggestion
  - Explains the factual difference of a similar task, and asks when unsure
  - Does not register the meeting or change anything else in an existing task
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### gerenciar-estoque
- **Stability**: experimental
- **Description**: Update the balance of an exhaustible item and leave payment outside
- **Properties**:
  - Lives at `.agents/skills/gerenciar-estoque/SKILL.md`
  - Reads the stock list and its property names from the data mapping of the project, when the person does not name another list
  - Updates the current balance for an entry or an exit and leaves an unknown balance empty
  - Accepts only metro, unidade, pacote, rolo, and kit as the balance unit
  - Sends the cash effect to definir-lancamento and does not record the payment or create a cost category
  - Asks the quantity before suggesting a replenishment
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses a durable good, recording the payment, and creating the cost category

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

### lancar-despesa-da-empresa
- **Stability**: experimental
- **Description**: Record a payment and trace the financial entry that originated a durable asset
- **Properties**:
  - Lives at `.agents/skills/lancar-despesa-da-empresa/SKILL.md`
  - Reads the expense list and its property names from the data mapping of the project, when the person does not name another list
  - Checks each mapped property name against the source schema, uses the equivalent property the schema shows when a mapped name is missing, such as a renamed title, reports the divergence so the mapping gets fixed, and asks before writing when no safe equivalent exists
  - Records a payment in a currency of `Moedas estrangeiras` with the original amount, the exchange rate, its date and source, and the amount in `Moeda`, and asks when the rate is missing
  - Searches by recipient variations, document, amount, date, and payment method before creating an expense, without asking permission to search
  - Reuses an existing entry and preserves its evidence instead of recording the same purchase twice
  - Records an absent expense in the same execution when its business purpose is confirmed or inferable from context, and asks when that purpose is uncertain
  - Keeps original evidence in the mapped attachment property and reports missing optional fields without inventing them
  - Searches the cost category by product and purpose before leaving it empty, links the one that fits, proposes the most specific when several fit, and suggests creating a category with a name and group when none fits, creating it only after the person agrees
  - Resolves the recipient company through identificar-duplicata and definir-empresa, reuses or registers it and links it to the same expense, or explicitly proposes registration and asks only what blocks it
  - Uses a vehicle plate only to find the existing vehicle, links the expense to it through the mapped relation, checking the vehicle side too, keeps the trip relation apart, keeps the plate out of the expense title, description, and notes, and reports the limitation instead of writing the plate as free text when no relation is mapped
  - Verifies the saved entry before reporting that it was recorded
  - Traces the financial entry that originated the purchase or acquisition of a durable asset
  - Leaves the asset page, the split between fixed assets and stock, and a controllable-item purchase to definir-ativo-imobilizado
  - Sends a sale or a mixed sale-and-expense sentence to definir-lancamento
  - Does not invent the amount or the date
  - Reads image evidence through reconhecer-imagem and checks names from both the evidence and the accompanying command through definir-grafia before writing
  - Reuses completed recognition and spelling checks, preserving the original operation without recursive handoffs
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses the opportunity, the signup update, the task, the agenda, and registering the asset
  - [ ] A confirmed or inferable business expense is recorded after an existence search; an existing expense is reused
  - [ ] A missing recipient is registered and linked when identified and permitted; otherwise the response proposes registration rather than leaving an unexplained pending link
  - [ ] A mixed purchase from image evidence excludes the personal item and identifies the person with the confirmed canonical name

### lancar-despesa-pessoal
- **Stability**: experimental
- **Description**: Find or record a personal expense, such as a purchase, a bill, an installment, or a payment slip
- **Properties**:
  - Lives at `.agents/skills/lancar-despesa-pessoal/SKILL.md` and stays internal while it is validated
  - Never records a personal expense in the company list, even for a partner
  - Links a bill to the obligation that generated it, with the installment as number/total
  - Leaves the payment date empty until there is a receipt, and keeps original and paid amounts apart
  - Records who paid when someone other than the debtor pays
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person

### limpar-copias-de-trabalho
- **Stability**: experimental
- **Description**: Remove the git worktrees a coding session left behind, after checking that nothing is lost
- **Properties**:
  - Lives at `.agents/skills/limpar-copias-de-trabalho/SKILL.md`
  - Does not sync to Notion, because it needs a shell
  - Runs at the end of every session whose work landed, and removes without asking: the checks are the safety
  - Leaves the worktrees the Claude app made, in `.claude/worktrees`, to the app's own cleanup, and the session's own worktree to its exit tool
  - Removes a worktree only when it is not the main checkout or a folder of an open session, has no change outside git other than installed dependencies, and its work is on a remote branch or in a merged pull request
  - Treats a missing remote branch after a squash merge as landed when the pull request is merged
  - Removes the local branch too, prunes worktrees whose folder is gone, and reports the space freed and why each kept worktree stayed
- **Test Criteria**:
  - [ ] A session with merged pull requests ends with their worktrees and branches removed and the space freed reported
  - [ ] A worktree with an untracked file other than dependencies stays, with the reason

### liberar-espaco-em-disco
- **Stability**: experimental
- **Description**: Free disk space on a Mac without losing a file, only from caches that rebuild themselves
- **Properties**:
  - Lives at `.agents/skills/liberar-espaco-em-disco/SKILL.md`
  - Does not sync to Notion, because it needs a shell
  - Measures free space and swap first, then the known folders in the background, one level deeper in the largest
  - Sorts each item into a cache that rebuilds itself, a cache its app clears better, or a file of the person, which it only sizes
  - Never deletes by itself: hands over the delete command for the person to run, even after a yes
  - Measures again after each cleanup and reports the space freed against the baseline
  - Explains that Activity Monitor totals bytes written since boot and that swap moves free space up and down
- **Test Criteria**:
  - [ ] Only caches that rebuild themselves are proposed for deletion, and the person's files show only their size
  - [ ] The agent hands over the delete command and deletes nothing itself

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

### mesclar-registro
- **Stability**: experimental
- **Description**: Consolidate records already identified as the same item into one canonical record
- **Properties**:
  - Lives at `.agents/skills/mesclar-registro/SKILL.md`
  - Runs after the records are already the same item, and leaves the existence check to identificar-duplicata
  - Routes skill handoffs from the first step in a flowchart
  - Treats two person records of the same person as the same item even when only one social profile exists, and does not use Não confundir com to separate that duplicate
  - Refuses similar names that are not the same entity, and leaves each entity on its own canonical record
  - Leaves the disambiguation relation to identificar-duplicata, and a social profile link to definir-perfil-social, and does not leave that correction only in the chat
  - Picks one canonical record, preferring a correct official link and then the record with more filled data
  - Keeps the canonical name in the title and records a previous name, nickname, wrong spelling, or ambiguous form in the variation property the database already has, without deleting existing items
  - Uses the variation property the data mapping of the project names for the list, or the variation field the list already has
  - Warns and proposes the variation property when it is missing, and adds the previous name when a recent rename left that field empty
  - Before copying, the reply is a diff of what the canonical page brings and what each duplicate brings, marking what only one page has and what conflicts
  - Copies onto the canonical record any property or relation that only a duplicate has and that does not conflict
  - Deletes the duplicate only when the person ordered it, after every property and relation merges safely; a conflict returns a diff and waits for which value is canonical
  - In the lists `Listas que excluem a duplicata reconciliada` names, empty by default, deletes a reconciled duplicate instead of archiving it, after the useful data and relations are on the canonical record, and asks before deleting when that could lose information or the duplicate is uncertain
  - Sends a consolidated supplier company to definir-empresa for the responsible person, and does not leave that person only in a note or only in the owners relation
  - Records a retired value on the property the list already has for that, or in the page body
  - Does not check existence alone, create the record, lock spelling, register the disambiguation relation, or delete without an order
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses avoiding a duplicate, registering the disambiguation relation, creating the record, locking spelling, and deleting without an order

### organizar-emails
- **Stability**: experimental
- **Description**: Triage email with BASB/PARA and learn personal, work, or mixed context from reviewed messages
- **Properties**:
  - Lives at `.agents/skills/organizar-emails/SKILL.md` and stays internal while the first decision tree is under construction
  - Learns each decision and its reason from real messages instead of classifying an entire sender or mailbox from one example
  - Separates the purpose of a historical obligation from a later intention to separate personal and business finances
  - Reads the protected account in recovery copies, and keeps the security filter thematic rather than automatically personal
  - Preserves inbox and read state on security alerts, verifies applied labels and filters, and does not promise automatic archiving after human reading
  - Keeps account intent and unwanted newsletter preferences in project parameters, without copying email bodies or financial identifiers into the skill
  - Reads the contexts and the context of each organization from project parameters, so a past or paused professional activity is not classified as current work
  - Files automatic confirmations with no pending action, such as unsubscribes, under an archive subfolder by type without asking whether to keep them
  - Finds the obligation of a billing message by sender, keeps open bills visible with their due date and amount, moves negotiation offers of a postponed debt out of the inbox, and never hides a formal notice or a debt still to verify
  - Swaps the bills-to-pay label for the paid-bills label once the payment is recorded with a receipt, including a second slip reissued for the same installment, and says which one was paid
  - Gives a collection agency its own label and adds the creditor's label only when the body names it; an alarming subject is not a formal notice unless the body describes the measure taken
  - Compares batch changes with the plan, redoes only what a partial failure left, and reports every failed call
  - Asks before restoring a conversation that left the inbox during a change, because the person may have archived it
- **Test Criteria**:
  - [x] The skill is present and one user-requested read-only exploratory case is recorded
  - [x] User-provided acceptance examples are recorded in Portuguese Gherkin
  - [x] A clean-session read-only exploratory run was completed and its findings refined the skill
  - [ ] Revalidate the refined version and pass the official skill checker before enabling the skill

### organizar-ponto-de-contato
- **Stability**: experimental
- **Description**: Plan and organize a physical contact point of the business, including a pop-up store
- **Properties**:
  - Lives at `.agents/skills/organizar-ponto-de-contato/SKILL.md`
  - Reads `Agendas` from the project instructions: each calendar by name and optional ID, with its use (`padrão`, `em uso`, `só leitura`, `aposentada`, or `ignorada`) and an optional purpose. Without a `padrão` calendar, the default is the account's main calendar
  - Previous name: organizar-feira
  - Treats a fair as a physical contact point when it is the business's real participation
  - Leaves a meeting or a review with an organization to definir-agenda, and does not create a contact point on the agenda from an approved opportunity until the participation days are confirmed
  - Keeps on the agenda only the participation days the person confirmed or wanted, and removes or cancels a wrong-day event when the person corrects it
  - Prefers one event per confirmed day of the same opportunity, marks the title with the day position, and uses an all-day event or a range only for a continuous trip or a long occupation
  - Writes a contact-point event on the calendar of `Agendas` whose purpose is contact points, or the default calendar, ignores a calendar whose use is `ignorada` even when history still names it, records the contact point scope and the canonical page in the description, migrates an event from another editable calendar and cancels the old one, and when the old calendar cannot be edited creates the equivalent event and says the duplicate must be removed manually
  - Treats Pontos de contato as the canonical order and number, does not split an event only because the calendar title number differs, updates that title after the other identifiers match, and asks before renaming when the match stays ambiguous
  - Reads the editable calendar and the removed calendar from the YAML mapping under Parâmetros de configuração
  - Leaves organizing a trip to definir-viagem
  - Treats contact points as one list and opportunities as another
  - When a reminder names that point, asks which contact point and which opportunity, and does not leave those relations empty
  - Does not invent the page or create a second one with the same name
  - Does not copy the reminder's day onto the contact point or the opportunity dates
  - Does not write the task title, the deadline, or the definition of done
  - When the person asks what is left to organize, lists open linked tasks and gaps already on the pages, orders them by the event date, states that date with the weekday, and does not create tasks in that reply
  - Does not ask the person to name the skill
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering the opportunity, checking whether the opportunity already exists, organizing a trip, writing the task title, the deadline, and the definition of done, checking whether the task exists, and registering someone

### perfilar-tom-de-voz
- **Stability**: experimental
- **Description**: Profile how a person or a channel writes from a real sample and register the patterns in the glossary
- **Properties**:
  - Lives at `.agents/skills/perfilar-tom-de-voz/SKILL.md`
  - Profiles only on an explicit request, for the person or channel the requester names
  - Reads the sample from the source named in the project instructions and leaves out the messages of the requester and of bots
  - Extracts only patterns that repeat, and writes a short summary of the tone where the project instructions say
  - Registers the concrete patterns with `definir-vocabulario` under the tag of the person or channel, preferring small reusable terms to whole phrases
  - Records where the sample came from, and shows the requester what it derived
  - Never quotes a message from a private conversation in another context
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing text, registering a loose term, and profiling without a request

### planejar-calendario-de-conteudo
- **Stability**: experimental
- **Description**: Suggest what to post, plan a week or a campaign, announce an event across posts, or check the calendar mix
- **Properties**:
  - Lives at `.agents/skills/planejar-calendario-de-conteudo/SKILL.md`
  - Reads the list of posts, the list of content formats, the list of narrative axes, and the optional supporting lists from the data mapping of the project
  - Checks what already exists, what is planned, and what can be reused before it suggests a new topic, and cites the page behind each suggestion
  - Counts only a published status or a post URL as published
  - Uses `Referências da estratégia de conteúdo`, and any reference the person gives, as a source behind each suggestion
  - Shows the mix by format against the 7-day goals, by narrative axis, and by narrative, and does not put two narratives in the same week
  - Treats a content campaign as occupying its window from start to end, even before it has posts, and assigns a post to a campaign by its relation when the mapping has one, or by its date inside the window
  - Builds an event sequence before the event from the event page, with pieces ready for sale only, and each post says on its own what happens, the date, the time, the address, why it is worth going, and the action
  - Proposes the author profile of each post from the profiles linked to `Empresa do negócio`, by the channel of the format, or by the place of the post or event when `Perfis por praça` is `sim`
  - Creates nothing before the person approves, and sends each approved Reel to definir-reel-do-instagram
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses writing the script, the caption, or the Reel post, registering only the idea, and publishing

### procurar-agenda
- **Stability**: experimental
- **Description**: Say what is already on the agenda for a day or a week
- **Properties**:
  - Lives at `.agents/skills/procurar-agenda/SKILL.md`
  - Reads `Agendas` from the project instructions: each calendar by name and optional ID, with its use (`padrão`, `em uso`, `só leitura`, `aposentada`, or `ignorada`) and an optional purpose. Without a `padrão` calendar, the default is the account's main calendar
  - Reads `Apelidos da agenda`, the names the person calls the calendar by, from the project instructions
  - Reads Google Calendar, the operational agenda, which is probably connected through Notion Calendar, and does not create, review, or change a commitment
  - Checks that the agenda tool is connected, active, and ready before concluding it cannot look up the day, starts the connection when the tool is available but not ready, and continues the original lookup once it is ready
  - Opens when the request calls the calendar by a name in `Apelidos da agenda`, or when the person asks how the day is, what they have today, or what is already on the day or the week, even without the words agenda, calendar, event, commitment, or time
  - Sends a create or change to definir-agenda and popstar or reverse planning to definir-agenda-de-popstar in the same turn
  - Resolves a request that is not the agenda and offers agenda help
  - Checks context before treating the name as a client, a supplier, a brand, or a person, and asks when the doubt is real
  - Does not invent a date, a time, or a duration
  - Leaves the popstar agenda, reverse planning, and life protection to definir-agenda-de-popstar, time audit to revisar-uso-do-tempo, reservation and the calendar event to definir-agenda, a significant date to definir-data-significativa, and managing a trip to definir-viagem
  - Leaves the learning-resource page to definir-recurso-de-aprendizado and keeps a question about whether a class is on the day
  - Writes the weekday beside each date in the reply, after checking it against the event date, time, and time zone, and does not create or change the event
  - Reads retired calendar products from the calendars whose use is `aposentada` in `Agendas`, matches the calendar name rather than the event title, covers that calendar when the person names it, asks for any day, or asks to look again, warns when it still has an event, and suggests moving that event to the default calendar. The move follows definir-agenda
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description opens on a nickname of the calendar from the project, and on a question about how the day is, what the person has today, or what is already on the day or the week
  - [x] The description refuses reverse planning, auditing time use, reserving, creating or changing the agenda, registering a significant date, and managing travel

### procurar-artista
- **Stability**: experimental
- **Description**: Find whether an artist or band is already in the artists database from loose material
- **Properties**:
  - Lives at `.agents/skills/procurar-artista/SKILL.md`, with `scripts/read-profile.py`, moved from a business harness
  - Reads the artists and events data source names, the related data sources, and the field names from the project instructions
  - Searches one identifier at a time by exact query, and treats a matching name alone as a hypothesis
  - Reads Spotify and YouTube links through their embed and oEmbed pages, which answer without login
  - Writes nothing and routes to definir-artista or mesclar-registro
- **Test Criteria**:
  - [x] The skill is present at that path

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
  - When no record matches, says so and searches in the same reply, following the calendar sources Notion usually uses, with the named year or the current year and the country code of each source, without restricting the search to them, and does not treat the web date as a list record
  - Follows `Fontes de calendário`, where each source has its URL and the country code that site uses, and asks the code when a URL needs it and it is empty, the default
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
  - Spells names through definir-grafia and searches the correct first name plus the surname as plain text, even when the email property is empty, without the from: operator
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
  - Searches every form of a name through definir-grafia, and uses the correct spelling only in the reply
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

### procurar-variacao-de-termo
- **Stability**: experimental
- **Description**: Say whether a term or its gender, number, or spelling variations are in the glossary
- **Properties**:
  - Lives at `.agents/skills/procurar-variacao-de-termo/SKILL.md`
  - Reads each form with `node node_modules/harness/vocabulary/dist/cli.js lookup`, or the MCP tool `lookup_term` without a terminal, and stops without both
  - Says which forms are registered, with their state, and which are not
  - Suggests registering the missing forms and asks the state of each one, without writing
  - Sends the registration to definir-vocabulario
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering or updating a term, writing brand text, and inventing a form

### reconhecer-imagem
- **Stability**: experimental
- **Description**: Read what an image says and pass that text to another skill
- **Properties**:
  - Lives at `.agents/skills/reconhecer-imagem/SKILL.md`
  - Script `scripts/recognize.py` ships with the core, finds the project from `HARNESS_ROOT` or the working directory, and reads `Idiomas do reconhecimento` from its project instructions
  - On a machine with the repository and swiftc, runs recognize.py and reuses the compiled cache
  - On Notion, without that script, reads the image and does not run tesseract
  - When the script is present, does not read the image file itself
  - Reads the recognition languages from its `Idiomas do reconhecimento` parameter
  - Drops the phone and ad chrome, and does not treat a stray syllable as a name
  - Passes text to the next skill without another recognition pass; preserves originals as evidence for a financial entry
  - When the text has an edition name and a date, and the person did not name the next skill, passes that text to procurar-oportunidade without asking, then to criar-oportunidade when the edition is not found
  - Routes a note, receipt, bill, or transaction to lancar-despesa-da-empresa before treating a completed order as an event signup
  - When the reading is a completed or confirmed event order, passes it to definir-inscricao after the edition lookup, and does not write the inscription itself
  - When the reading is a person or a social profile, passes it to definir-grafia and does not stop at the text
  - When the next skill is not in the conversation's skill list, delivers the text and asks whether to call that skill by name, without saying it is unavailable
  - Stops at the text only when the routing flow has no recipient and the person did not name the next skill
  - Does not register the opportunity itself, organize a fair, or create a task
  - Keeps the written or dictated command that accompanies the image as the operation's intent, separate from the reading, and hands both to the next skill
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering an entity, creating a task, and reading text that is already written
  - [ ] A receipt and the matching transaction reach the expense workflow without a written request to record them
  - [ ] A receipt with a dictated expense command reaches lancar-despesa-da-empresa with the requested operation intact

### redigir-com-tom-de-voz
- **Stability**: experimental
- **Description**: Write, suggest, review, and rewrite brand text in the project's voice
- **Properties**:
  - Lives at `.agents/skills/redigir-com-tom-de-voz/SKILL.md`
  - Writes in the voice of the project that is open and reads that project's glossary, with `node node_modules/harness/vocabulary/dist/cli.js lookup` and `exists` when there is a terminal and the CLI is installed, and with the MCP tools when there is no terminal or the CLI is not available
  - Without a terminal and without the MCP server, as in a Notion agent, reads the glossary only from a source the project instructions name, or stops
  - Reads the glossary with the tags of the speaker, the event, and the channel of the text, so a term of another context stays out
  - Writes the stored spelling of a case-sensitive term when a read reports case_matches false
  - Waits for context, channel, audience, the brand sources named in the project instructions, the glossary, and the creative intent
  - Uses each term as its level says: forbidden never, strongly_discouraged only on request or under the exception in when, discouraged only with the scene in when, allowed_with_care as when says
  - Keeps out a forbidden term, a generic phrase, AI-sounding text, and language the glossary marks as misaligned
  - Treats an emoji as a glossary term. Without a row, the copy waits
  - Replaces a cliché with the image, scene, action, effect, or situation in its description, and leaves rejected phrases out
  - Sends term registration to definir-vocabulario
  - Writes an external event title when the person asks, keeps the canonical name they already gave, and does not write the calendar event or lock the spelling
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses answering the person chatting with the AI, locking spelling, changing a content format, and assuming a customer, a piece, an opportunity, or commercial history

### registrar-ciclo-do-ativo
- **Stability**: experimental
- **Description**: Record what happens to a durable asset after it exists
- **Properties**:
  - Lives at `.agents/skills/registrar-ciclo-do-ativo/SKILL.md`
  - Reads the fixed asset list and its property names from the data mapping of the project, when the person does not name another list
  - Records state, maintenance, repair, loan, partnership, write-off, disposal, sale, loss, exchange, and depreciation on the existing asset
  - Uses the partnerships and loans property for a loan or partnership, and the purchase date plus the price paid for depreciation
  - Writes Observações patrimoniais when no structured property exists, and suggests a property without creating it before a yes
  - Does not delete the page, invent a depreciation method, create a status property, or create the asset page
  - Leaves a payment that has financial evidence to lancar-despesa-da-empresa, and does not create an expense without that evidence
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses registering the asset, choosing stock, recording the payment, and creating the company

### revisar-financas
- **Stability**: experimental
- **Description**: Read cash, profit, the income statement, cash flow, diagnosis, audit, or selling price
- **Properties**:
  - Lives at `.agents/skills/revisar-financas/SKILL.md`
  - Reads `Moeda` and `Habilidade de projeção de caixa` from the project instructions, and leaves the cash projection to the skill it names, when there is one
  - Reads what is already recorded and does not create an entry
  - Presents financial figures in `Moeda`, tables first, then a short summary, alerts, and practical guidance
  - Uses the income-statement and cash-flow templates, with months across the columns
  - Writes an audit in three parts only when the data is enough, and asks for the desired margin before suggesting a price
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording a sale or expense, moving stock, planning the month, and projecting fair cash

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
  - A request that arrives through a synced copy, such as the Notion page, writes through criar-commit and criar-pull-request
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating the first version, running the test and editing the skill, only measuring size, and writing the skill page in Notion

### revisar-uso-do-tempo
- **Stability**: experimental
- **Description**: Audit whether planned time supports the priority objective, and review the body of work
- **Properties**:
  - Lives at `.agents/skills/revisar-uso-do-tempo/SKILL.md`
  - Audits creation, visibility, revenue, and personal life against the priority objectives the person or the source named, and says whether more than half of the planned time supports them and where to adjust
  - Reads the priority-time share from the YAML mapping under Parâmetros de configuração
  - Sums only durations Google Calendar shows, and does not estimate a share or choose the priority objective
  - Classifies each commitment by the objective and life area the person or the source already named, and reports a missing classification as an absence
  - Identifies absences, excesses, and recurring reschedules that Google Calendar shows, and does not invent the count or reschedule the event
  - Answers with the proportion of aligned commitments, gaps by area, recurring reschedules, and recommended adjustments, and does not estimate that proportion
  - Answers a bulk action as a table with one row per commitment and columns for alignment, gap by area, recurring reschedule, and recommended adjustment, and does not invent a column
  - Does not write the Google Calendar event
  - Checks that the agenda tool is connected, active, and ready before concluding it cannot audit, starts the connection when the tool is available but not ready, and continues the original audit once it is ready
  - Leaves the event to definir-agenda, career structure to definir-agenda-de-popstar, and a question about what is already on a day or a week to procurar-agenda
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses creating, reviewing, altering, or reserving the event, the popstar agenda, reverse planning, life protection, the day or week lookup, and choosing the priority objective

### sincronizar-cronograma
- **Stability**: experimental
- **Description**: Keep a dated item with no confirmed time off the calendar
- **Properties**:
  - Lives at `.agents/skills/sincronizar-cronograma/SKILL.md`
  - Reads the schedule list and its property names from the data mapping of the project
  - Does not create an all-day event as a stand-in for a missing time
  - Keeps the item on the schedule list, pending a time, and off the agenda until temporal evidence exists, unless the person confirms the commitment is all-day
  - Updates the real start and the real end from later evidence and keeps the original plan
  - Splits distinct real commitments into separate items
  - Prefers one atomic event for each real schedule item, pointing at that canonical item, and removes a duplicate umbrella only after the safe atomic items exist and no exclusive data would be lost
  - Uses the next milestone as the end only after the person authorizes that rule, records the rule, and otherwise leaves the end pending
  - Converts, updates, or removes an all-day placeholder once a real time exists, then reads the agenda again
  - Leaves an event that already has a start and an end, and a plan the person states for a named day, to definir-agenda
  - Leaves registering, reviewing, or organizing the canonical trip to definir-viagem
  - Leaves the guest list to definir-convidado
- **Test Criteria**:
  - [x] The skill is present at that path
  - [x] The description refuses recording an event that already has a time, creating an all-day stand-in, deciding the guest, the production day, and the day lookup

### sincronizar-status-da-tarefa
- **Stability**: experimental
- **Description**: Move tasks, cards, or issues through their status flow from the state of the pull request linked to each one
- **Properties**:
  - Lives at `.agents/skills/sincronizar-status-da-tarefa/SKILL.md`
  - Works with any task tracker, reading from the project instructions the task query, the status flow, the status for a merged, ready, draft, or blocked pull request, the labels that mean blocked, how a task links to a pull request, and whether to confirm the plan
  - Links a task to a pull request only after reading its title and body, and marks a link made only by subject
  - Leaves unchanged, with the reason, a task whose pull request was closed without merging, cites another key, or needs judgment
  - Writes a plan, rereads the task and the pull request before running it, and asks for confirmation when the project says so
  - Moves one task at a time, one status step at a time, and reads the returned status before the next step
  - Records a denied or failed call as not done, with the status the task really has, without retrying or working around it
  - Reports by final status from what the tool returned, and counts the totals from the final list
- **Test Criteria**:
  - [x] The skill is present at that path
  - [ ] Three cases validated with the person
