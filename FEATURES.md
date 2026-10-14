---
locale: en
---

# Features

## Features

Skills are in `.agents/skills/FEATURES.md`. How they relate is in `.agents/skills/README.md`.

### core
- **Stability**: experimental
- **Description**: Claude Code plugin with the shared skills
- **Properties**:
  - Manifest at `.claude-plugin/plugin.json`, listed in `.claude-plugin/marketplace.json` with source `.`
  - Skills come from `.agents/skills/`. Each one arrives after its audit
  - A business marketplace lists it with a `github` source pinned to a tag
- **Test Criteria**:
  - [ ] Adding a business marketplace installs that plugin and `core`

### renovate-preset
- **Stability**: experimental
- **Description**: Renovate preset that keeps a repository and its pins of the core harness current
- **Properties**:
  - Preset at `default.json`, extended as `github>jimmyandrade/harness`
  - Groups every pin of the core harness, in workflows, `package.json`, `.claude-plugin/marketplace.json`, and `.claude/settings.json`, into one `harness core` pull request
  - Moves a release-tag pin of jimmyandrade/vocabulary in `package.json` in one `vocabulary` pull request, as soon as a release exists
  - A major update waits for approval on the Dependency Dashboard
  - Names the Dependency Dashboard issue `chore(deps): dependency dashboard`, a Conventional Commits title matching the `chore(deps)` and `fix(deps)` pull requests it lists
- **Test Criteria**:
  - [x] The marketplace regex reads the repository and the tag of a `github` plugin source
  - [x] The same regex reads the pin in `.claude/settings.json`, and `.claude/settings.local.json` is not matched
  - [ ] A release of the core opens one `harness core` pull request in a business harness
  - [ ] A release of jimmyandrade/vocabulary opens one `vocabulary` pull request in a business harness that pins a tag

### skill-graph
- **Stability**: experimental
- **Description**: Show how the skills of a repository relate, as a Mermaid graph
- **Properties**:
  - Script `.agents/scripts/skill-graph/run-graph.sh` writes `.agents/skills/README.md`, which GitHub renders when the folder is opened
  - In a business harness, the project skills and the core skills are separate groups. The Core group shows a fixed node for the `core` plugin and only the core skills that project skills declare in `metadata.related`; body citations only link project skills, and arrows only leave project skills, so a core release that adds or relates core skills leaves the project graph unchanged
  - A solid arrow comes from `metadata.related`. A dotted arrow is a skill cited in the body of a skill that does not declare `metadata.related` yet. A citation is a skill name between backticks in prose, or a name in a Mermaid diagram
  - `run-check.sh` fails when the README is out of date
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
  - A changed skill must raise `metadata.version` above its copy at `base` when `base` and `head` are given, and above its copy at `HEAD` otherwise
  - When a skill declares `metadata.related`, each name must be a skill in the project or in the core, and every skill the body cites must be listed. A citation is a skill name between backticks in prose, or a name in a Mermaid diagram; a plain name in prose is not one
  - Each Gherkin file in a skill's `features/` starts with `# language: <locale.gherkin>`. With `pt`, every Given starts with `Dado que`, because `Dado` is the reserved keyword and does not agree with the noun
- **Test Criteria**:
  - [x] A project block without a limit uses the core limit, and a misspelled key or a wrong type fails
  - [x] A related name that is not a skill fails, and a cited skill missing from `metadata.related` fails
  - [x] A feature without the configured language line fails, and in Portuguese a Given such as `Dada uma` or `Dado um` fails
  - [x] A committed change is compared with the base, and without a base with `HEAD`
  - [x] An `AGENTS.md` over the body token or line limit fails, and a change to it shows as a row with its tokens before and after
  - [x] The comment is created when none has the marker, edited when one has it, and says no skill changes when a later push reverts them
  - [ ] A business pull request that changes a skill shows the comment, and a second push edits it
  - [ ] A business workflow that calls the action fails on a skill that breaks a rule

### check-branch-name
- **Stability**: experimental
- **Description**: Fail a pull request whose branch is not named after its Conventional Commits type
- **Properties**:
  - Composite action at `.github/actions/check-branch-name/` and script `.agents/scripts/check-branch-name/check-branch-name.py`
  - Accepts `type/short-description`, with a type from `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `ci` and an ASCII kebab-case description, where a dot may join two parts
  - Skips `renovate/`, `dependabot/`, and `release-please--` branches, and skips a push, which has no pull request branch
  - `types` and `exempt` replace the defaults
- **Test Criteria**:
  - [x] `claude/…`, a branch without a type, and a description that is not kebab-case fail, and a bot branch passes
  - [ ] A business pull request from a `claude/…` branch fails the check

### sync-skill-pages
- **Stability**: experimental
- **Description**: Publish each changed skill of a repository as a page in its Notion skills database
- **Properties**:
  - Composite action at `.github/actions/sync-skill-pages/` and script `.agents/scripts/sync-skill-pages/sync-skill-pages.ts`
  - The mapping lives in the calling repository: data source id, property names, and status option names
  - `mapping` points at another mapping file. A change to that file republishes every skill
  - The page icon comes from the `Ícone das páginas no Notion` and `Cor do ícone das páginas no Notion` settings, with the core fallback
  - The project instructions file becomes one more page of the skills database, titled with the file name. Its description and version properties come from `description` and `metadata.version` in the frontmatter, and the description tells the Notion agent to load the page for any task. The page body ends with its parameters in a YAML code block. It publishes when the file changes, when the mapping or the publisher changes, or when the project moves the core version
  - `include-core` also publishes the skills of the core harness into the caller's Notion
- **Test Criteria**:
  - [x] A mapping can rename every status option
  - [x] Core skills publish when the project moves the core version or its mapping, and a name in both stops the sync
  - [x] The project root is `HARNESS_ROOT`, or the working directory
  - [x] The instructions page is created once and then updated, with the version of its block
  - [x] Every checked `AGENTS.md` needs `metadata.version`, which must rise when the instructions change, and a business harness also needs `description`
  - [ ] A business workflow that calls the action creates one page per new skill
