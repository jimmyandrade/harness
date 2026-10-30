---
locale: en
---

# Features

## Features

Skills are in `.agents/skills/FEATURES.md`. How they relate is in `.agents/skills/README.md`.

### core
- **Stability**: experimental
- **Description**: Plugin with the shared skills, for Claude Code, Codex, and Cursor
- **Properties**:
  - Manifest at `.claude-plugin/plugin.json`, listed in `.claude-plugin/marketplace.json` with source `.`. Claude Code and Codex read both files
  - Cursor reads `.cursor-plugin/plugin.json`, which repeats the shared fields of `.claude-plugin/plugin.json`. Release Please bumps `version` in both
  - Skills come from `.agents/skills/`. Each one arrives after its audit
  - A business marketplace lists it with a `url` source, `https://github.com/jimmyandrade/harness.git` pinned to a tag, because Codex skips a `github` source. Cursor cannot list it from another repository, so a team imports this repository as its own Cursor marketplace, which follows the default branch. A personal entry under Your Marketplaces does not follow later commits. Grok Bot does not load the plugin. The steps are in `docs/runbooks/cursor.md`, and the stale install is in `TROUBLESHOOTING.md`
  - `Forma do harness` is `repositório próprio`, `repositório existente`, or `próprio e repositórios`. The role of the open repository is `harness` or `projeto`. `global` uses this plugin as the single install and adds no files to that repository. A project role in `próprio e repositórios` installs the business harness and the core. `INSTALL.md` explains how that differs from the glossary and the skills folder
- **Test Criteria**:
  - [ ] Adding a business marketplace installs that plugin and `core`, in Claude Code and in Codex
  - [ ] Importing a business repository and this repository as Cursor team marketplaces installs both plugins

### vocabulary
- **Stability**: experimental
- **Description**: Engine that reads and writes the glossary of a project, with a command line and an MCP server
- **Properties**:
  - Code in `vocabulary/api/`, built by `npm run build` into `vocabulary/dist/`, which the `prepare` script runs on install
  - A project installs the core with `npm install --save-dev github:jimmyandrade/harness` and runs `node node_modules/harness/vocabulary/dist/cli.js` and `node node_modules/harness/vocabulary/dist/mcp/index.js`
  - Reads and writes one UTF-8 JSON file per language in the project. This repository ships no glossary and no brand name
  - The skills `definir-vocabulario`, `classificar-estado-do-termo`, `validar-plano-de-vocabulario`, `gravar-termos-no-vocabulario`, `procurar-variacao-de-termo`, `redigir-com-tom-de-voz` and `perfilar-tom-de-voz` use it. Their entries are in `.agents/skills/FEATURES.md`
  - Decisions about the engine are in `vocabulary/docs/adr/`, and the host runbooks are in `vocabulary/docs/runbooks/`
- **Test Criteria**:
  - [x] `npm test` runs the vocabulary tests with the script tests
  - [x] `npm run build` compiles the engine into `vocabulary/dist/`

### core-pins
- **Stability**: experimental
- **Description**: Keep every pin of the core harness in a repository on the same tag, so a manual bump cannot leave one behind
- **Properties**:
  - Script `.agents/scripts/core-pins/core-pins.py`, run by `run-check.sh` on commit and in the `check-skill` action
  - Reads the pins the Renovate preset moves: the `harness` dependency in `package.json` and `package-lock.json`, each `jimmyandrade/harness/...@<tag>` in `.github/workflows/`, and a `github` or `url` source of the core with a `ref` in `.claude-plugin/marketplace.json` and `.claude/settings.json`
  - The pin in `package.json` is the reference. A pin on another tag fails at its line, and in GitHub Actions the pull request shows it inline
  - A repository without pins, such as this one, passes
- **Test Criteria**:
  - [x] Every kind of pin is found at its line, and a commit in the lockfile is not a pin
  - [x] Matching pins pass, and each pin on another tag fails at its line
  - [x] In GitHub Actions each finding is an `::error` annotation with the file and the line
  - [x] This repository and `examples/business-harness/` pass

### plugin-manifests
- **Stability**: experimental
- **Description**: Keep the plugin manifests of a repository in agreement, so Claude Code, Codex, and Cursor install the same plugin
- **Properties**:
  - Script `.agents/scripts/plugin-manifests/plugin-manifests.py`, run by `run-check.sh` on commit and in the `check-skill` action
  - `.claude-plugin/` is the source of truth. The check fails when `.cursor-plugin/plugin.json` differs from `.claude-plugin/plugin.json` in `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, or `skills`, or exists without it
  - It fails when a plugin source in `.claude-plugin/marketplace.json` is one that Codex skips, such as `github`
  - It fails when a `.claude-plugin/plugin.json` sits below the root, outside `node_modules` and `.git`, because the plugin sync of a claude.ai organization rejects the plugin. The business example keeps its plugin as `.claude-plugin/plugin.example.json`, and the runbook renames it
  - Each error points at the line of the field or plugin it is about, and in GitHub Actions the pull request shows it inline
- **Test Criteria**:
  - [x] Matching manifests pass, and a different or missing shared field fails
  - [x] A `github` plugin source fails, and a `./` path or a `url` source passes
  - [x] A nested `.claude-plugin/plugin.json` fails, and one in `node_modules` passes
  - [x] This repository and `examples/business-harness/`, as the runbook leaves it after the copy, pass

### renovate-preset
- **Stability**: experimental
- **Description**: Renovate preset that keeps a repository and its pins of the core harness current
- **Properties**:
  - Preset at `default.json`, extended as `github>jimmyandrade/harness`
  - Groups every pin of the core harness, in workflows, `package.json`, `.claude-plugin/marketplace.json`, and `.claude/settings.json` into one `core harness` pull request, as soon as a release exists
  - Merges that pull request by itself for a minor or patch release, once its checks pass
  - A major update waits for approval on the Dependency Dashboard
  - Names the Dependency Dashboard issue `chore(deps): dependency dashboard`, a Conventional Commits title matching the `chore(deps)` and `fix(deps)` pull requests it lists
- **Test Criteria**:
  - [x] The marketplace regex reads the repository and the tag of a `github` plugin source
  - [x] A second regex reads the repository and the tag of a `url` plugin source on github.com, as in the business marketplace
  - [x] The same regex reads the pin in `.claude/settings.json`, and `.claude/settings.local.json` is not matched
  - [x] A release of the core opens one `core harness` pull request in a business harness
  - [x] That pull request merges by itself once its checks pass, for a minor or patch release

### skill-graph
- **Stability**: experimental
- **Description**: Show how the skills of a repository relate, as a Mermaid graph
- **Properties**:
  - Script `.agents/scripts/skill-graph/run-graph.sh` writes `.agents/skills/README.md`, which GitHub renders when the folder is opened
  - In a business harness, the project skills and the core skills are separate groups. The Core group shows a fixed node for the `core` plugin and only the core skills that project skills declare in `metadata.related`; body citations only link project skills, and arrows only leave project skills, so a core release that adds or relates core skills leaves the project graph unchanged
  - A solid arrow comes from `metadata.related`. A dotted arrow is a skill cited in the body of a skill that does not declare `metadata.related` yet. A citation is a skill name between backticks in prose, or a name in a Mermaid diagram
  - `run-check.sh` fails when the README is out of date, at the first line that differs, which a pull request shows inline in GitHub Actions
- **Test Criteria**:
  - [x] Declared related skills draw solid arrows, and cited skills draw dotted arrows
  - [x] The project and the core are separate groups
  - [x] A core release that adds or relates skills leaves a project graph unchanged, including a core skill whose name a project body already mentions
  - [x] A stale README fails the check

### check-skill
- **Stability**: experimental
- **Description**: Check the skills of a repository against the harness rules
- **Properties**:
  - Composite action at `.github/actions/check-skill/` and script `.agents/scripts/check-skill/run-check.sh`
  - Reads the project from `HARNESS_ROOT` or the working directory, and its settings from `metadata.parameters` in the frontmatter of its `AGENTS.md`, with the core as fallback. It validates them: the frontmatter exists and parses, every key belongs to a skill or a script, and script settings have the right type. A project that links `.agents/skills` to the core gets only its `AGENTS.md` checked
  - `base` and `head` limit the check to the skills that changed
  - The project's root `AGENTS.md` gets the size limits of a skill body (words, lines, body tokens), because it loads in every session, as ADR 0008 decides. The structure rules of a skill do not apply to it. It shows in the summary table and in the pull request comment when it changes
  - On a pull request, the action keeps one comment with the table of the skills the pull request adds, changes, or fails: version, body tokens, and share of the limit, before and after. Each push edits that comment. `comment: false` turns it off. The calling workflow needs `permissions: pull-requests: write`; without it the step warns and the check result stands
  - `metadata` has no `notion` field and no `internal` field. Every skill syncs to Notion
  - A changed skill must raise `metadata.version` above its copy at `base` when `base` and `head` are given, and above its copy at `HEAD` otherwise
  - When a skill declares `metadata.related`, each name must be a skill in the project or in the core, and every skill the body cites must be listed. A citation is a skill name between backticks in prose, or a name in a Mermaid diagram; a plain name in prose is not one
  - `Considerar grupos de oportunidades` is `sim` or `não`. When it is `sim` for `criar-oportunidade` or `definir-grupo-de-oportunidades`, and the project has the opportunity mapping `.agents/mappings/oportunidades.notion.json`, that mapping must bind the logical field `group`
  - When a skill declares `metadata.models`, each name must be a file in `.agents/assets/templates/` of the project or of the core, every model the body cites between backticks must be listed, and the body cites no model by path, as ADR 0016 decides
  - `Banco de modelos no Notion` is the link of a Notion database or its `collection://` data source
  - Each model in `.agents/assets/templates/`, a file whose frontmatter has `name`, needs `name` equal to the file name in ASCII kebab-case, `description`, and `metadata.version` as a double-quoted semver that rises when the file changes. `metadata.aliases` and `metadata.tags` are lists, and the body has `## Contexto`, `## Formato`, and `## Estilo`, in this order. A model name the core also uses fails. Files without frontmatter or without `name` are not models and are not checked
  - Each Gherkin file in a skill's `features/` starts with `# language: <locale.gherkin>`. With `pt`, every Given starts with `Dado que`, because `Dado` is the reserved keyword and does not agree with the noun
- **Test Criteria**:
  - [x] A project block without a limit uses the core limit, and a misspelled key or a wrong type fails
  - [x] A related name that is not a skill fails, and a cited skill missing from `metadata.related` fails
  - [x] An opportunity mapping without `group` fails while `Considerar grupos de oportunidades` is `sim`, and passes with `não`
  - [x] A feature without the configured language line fails, and in Portuguese a Given such as `Dada uma` or `Dado um` fails
  - [x] A committed change is compared with the base, and without a base with `HEAD`
  - [x] An `AGENTS.md` over the body token or line limit fails, and a change to it shows as a row with its tokens before and after
  - [x] A model in `metadata.models` that does not exist fails, a cited model missing from the list fails, and a path to a model fails once the skill lists its models
  - [x] A model without `description` or a quoted version, with a name other than its file, without the three sections, or changed without a higher version fails
  - [x] The comment is created when none has the marker, edited when one has it, and says no skill changes when a later push reverts them
  - [ ] A business pull request that changes a skill shows the comment, and a second push edits it
  - [ ] A business workflow that calls the action fails on a skill that breaks a rule

### sync-notion-pages
- **Stability**: experimental
- **Description**: Publish each changed skill, the project instructions, and each changed model of a repository as pages in its Notion databases
- **Properties**:
  - Composite action at `.github/actions/sync-notion-pages/` and script `.agents/scripts/sync-notion-pages/sync-notion-pages.ts`, with one module per kind of page
  - The mapping lives in the calling repository: data source id, property names, and status option names
  - `mapping` points at another mapping file. A change to that file republishes every skill
  - The page icon comes from the `Ícone das páginas no Notion` and `Cor do ícone das páginas no Notion` settings, with the core fallback
  - A model page gets the icon of `Ícone dos modelos no Notion` and `Cor do ícone dos modelos no Notion`, `script` in gray by default, when it is created and on every update
  - The project instructions file becomes one more page of the skills database, titled with the file name. Its description and version properties come from `description` and `metadata.version` in the frontmatter, and the description tells the Notion agent to load the page for any task. The page body ends with its parameters in a YAML code block. It publishes when the file changes, when the mapping or the publisher changes, or when the project moves the core version
  - `include-core` also publishes the skills of the core harness into the caller's Notion
  - The `sync-skills` example workflow runs it on each release, with the previous release as `base`, after `check-skill`. A Release Please workflow calls it, and a person can run it by hand with another `base`
  - Publishes every changed skill. A `notion` or `internal` field in the file does not leave it out
  - With a model mapping, `.agents/mappings/template-page.notion.json` or `template-mapping`, publishes each changed model of `.agents/assets/templates/` as a page of the models database, with the file body as the page body. The mapping binds `name` and `version`, and the other properties only when it names them. A change to that mapping republishes every model. Without it, no model is published
  - A model page is found by its name, or else by one of its `metadata.aliases`, so it replaces a page a person created with another title. A removed model keeps its page. A file without `name` in frontmatter is logged as skipped
- **Test Criteria**:
  - [x] A mapping can rename every status option
  - [x] A skill with a `notion` or `internal` field is still published
  - [x] Core skills publish when the project moves the core version or its mapping, and a name in both stops the sync
  - [x] A model name in both the project and the core stops the sync, and a file without `name` in frontmatter, which is not a model, does not
  - [x] The project root is `HARNESS_ROOT`, or the working directory
  - [x] The instructions page is created once and then updated, with the version of its block
  - [x] Every checked `AGENTS.md` needs `metadata.version`, which must rise when the instructions change, and a business harness also needs `description`
  - [x] A changed model is created, then updated in place, and an unchanged one is not published
  - [x] Without a model mapping, no model is published
  - [ ] A business workflow that calls the action creates one page per new skill
