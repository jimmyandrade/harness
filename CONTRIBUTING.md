---
locale: en
---

# Contributing

## Commits

Subjects follow [Conventional Commits](https://www.conventionalcommits.org/): `type: description`, in English (`locale.commit_subject`).

| Type | Use |
| --- | --- |
| `feat` | A feature a person or a repository uses |
| `fix` | A defect |
| `docs` | Documentation only |
| `refactor` | A behavior-preserving restructure |
| `perf` | A change that makes something faster or lighter, with no other behavior change |
| `test` | Tests only |
| `chore` | Upkeep that is none of the above |
| `ci` | CI and the actions under `.github/actions/` |

Branches are named `type/short-description`, with one of these types and an ASCII kebab-case description, such as `feat/build-on-install`. A branch a tool created with another prefix, such as `claude/` or `cursor/`, is renamed before the first push. `criar-commit` and `criar-pull-request` follow the same rule in every project, and a `Check the branch name` step in CI fails a pull request that does not. The step is three lines of shell, copied into each repository's workflow as in `examples/business-harness/.github/workflows/skills.yml`, with no action to pin. It skips `renovate/`, `dependabot/`, and `release-please--` branches, and a push.

## CI

The workflow is `.github/workflows/ci.yml`. It runs on every pull request, including the release pull request, and on every push to `main`, on `ubuntu-26.04`. A push to another branch does not run it, so a pull request runs the checks once. It checks out the full history, checks the branch name of a pull request, runs the `check-skill` action of this repository against itself, runs every `.agents/scripts/*/test_*.py` and `.agents/skills/*/scripts/test_*.py` with the checker's own Python, typechecks, and runs `npm test`. When `.github/scripts/change-scope.sh` finds that every changed file is under `docs/` or is Markdown at the root other than `AGENTS.md` and `CLAUDE.md`, it skips the skill check, the tests, the dependency install, and the typecheck, and still reports the required `test` check. Without a base to compare, it runs everything.

Every step in a workflow or a composite action has a `name`: a short imperative phrase in English, such as `Install dependencies`. The run log and the pull request checks show that name instead of the command.

## Actions

Business harnesses call two composite actions from this repository. Each one runs the scripts of the tag the caller pins, against the caller's checkout in `github.workspace`.

`check-skill` installs Python 3.14 and runs `.agents/scripts/check-skill/run-check.sh` with `HARNESS_ROOT` set to the caller. `base` and `head` limit the check to the skills that changed. It also checks every model in `.agents/assets/templates/` with `.agents/scripts/check-models/check-models.py`, and the `metadata.models` of each skill that declares it, as ADR 0016 decides. An error becomes an `::error` annotation with the file and the line, and the job summary is one table of skills. A skill that existed at `base` and is gone at `head` gets a removed row, with its last version and size, in that table and in the pull request comment. Every check that `run-check.sh` runs does the same: it prints `file:line: message`, and in GitHub Actions an `::error` annotation with that file and line, so the pull request shows the finding inline on the line that causes it. A new check follows that rule.

`sync-notion-pages` first stops with an `::error` annotation when `notion-token` is empty, before any install. Then it installs Node.js 24 and the runtime dependencies of this repository without running their scripts, since the `prepare` build of the vocabulary needs the development dependencies that the sync does not install, then runs `.agents/scripts/sync-notion-pages/sync-notion-pages.ts` with `HARNESS_ROOT` set to the caller. It reads the mapping from `mapping`, the page icon from the parameters in the frontmatter of the caller's `AGENTS.md` with the core fallback, the icon of model pages from `Ícone dos modelos no Notion` and `Cor do ícone dos modelos no Notion` the same way, and the token from `notion-token`. It creates or updates a page for each changed skill that does not set `metadata.notion` to `"false"` or `metadata.internal` to `true`, and a page for the caller's `AGENTS.md` when that file changes. A change to the mapping republishes every skill. A skill removed from git does not remove the page. A rename keeps the page whose title is the previous name when the new skill lists it in `metadata.aliases`.

When the caller has the model mapping that `template-mapping` names, `.agents/mappings/template-page.notion.json` by default, the action also creates or updates a page for each changed model in `.agents/assets/templates/`, as ADR 0015 decides, and every model when that mapping changes. It writes only the properties the mapping binds, and the file body as the page body. It finds the page by the model name or one of its aliases, and never removes one. Without that file, it publishes no model.

With `include-core`, which is on by default, the action also publishes the skills of this repository into the caller's Notion, with the caller's mapping, and the models of this repository when the caller has a model mapping. It does that when the change between `base` and `head` touches the caller's mapping, a file under `.github/workflows/`, `package.json`, or `package-lock.json`, which is where a business harness moves the version of this repository it uses. A skill name that exists in both repositories stops the sync. So does a model name, counting only files whose frontmatter has `name`.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a GitHub Release. Business harnesses pin the actions, the plugin, and the Node.js dependency to that full tag.

Release Please owns the version. `.github/workflows/release-please.yml` runs on every push to `main` and keeps one release pull request open. That pull request bumps `version` in `package.json`, `.claude-plugin/plugin.json`, and `.cursor-plugin/plugin.json`, and writes `CHANGELOG.md` from the Conventional Commits since the last release. Merging it creates the tag and the GitHub Release. The first release is 0.1.0. Before 1.0.0, a breaking change bumps the minor version. Do not bump either version or create a tag by hand. The configuration is `release-please-config.json`, and the last released version is in `.release-please-manifest.json`.

Release Please opens the release pull request and creates the release with the token of a GitHub App, not `GITHUB_TOKEN`. GitHub holds the `pull_request` runs of a pull request that `GITHUB_TOKEN` opens or updates as `action_required` until someone with write access approves them, and a `test` check from a `workflow_dispatch` run on the same commit does not count for the pull request: on release pull request #234, run 39136414110 passed and the pull request stayed blocked until run 39136410121 was approved. With the app token, `ci.yml` runs on the release pull request like on any other, and auto-merge can merge it.

The app is installed only on this repository, with these repository permissions: Contents read and write, Pull requests read and write, Issues read and write for the labels, and Metadata read. Its client ID is the repository variable `RELEASE_APP_CLIENT_ID`, and a private key is the repository secret `RELEASE_APP_PRIVATE_KEY`. `release-please.yml` asks `actions/create-github-app-token` for a token on each run, and its own `GITHUB_TOKEN` has no permission.

## Renovate

`default.json` is the shared Renovate preset. This repository extends it from `renovate.json`, and business harnesses extend it as `github>jimmyandrade/harness`. It runs before 9 a.m. on Mondays, São Paulo time, with semantic commits. A major update waits for approval on the Dependency Dashboard. Every pin of this repository, in a workflow, in `package.json`, or in `.claude-plugin/marketplace.json`, moves in one `core harness` pull request as soon as a release exists. The marketplace pin, a `url` plugin source that Codex reads too, is read by a regex manager, because Renovate does not know that file. For a minor or patch release, Renovate merges that pull request by itself once its checks pass, so the checks of the business harness, such as the skill check, decide. A failing check leaves it open, and a major release still waits for approval. Before 1.0.0 a breaking change bumps the minor version and merges the same way, so `CHANGELOG.md` names what a business harness must change.

When a workflow or an action changes, update this file from the diff.
