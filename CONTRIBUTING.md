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

The workflow is `.github/workflows/ci.yml`. It runs on every pull request and on every push to `main`, on `ubuntu-26.04`. A push to another branch does not run it, so a pull request runs the checks once. It checks out the full history, checks the branch name of a pull request, runs the `check-skill` action of this repository against itself, runs every `.agents/scripts/*/test_*.py` and `.agents/skills/*/scripts/test_*.py` with the checker's own Python, typechecks, and runs `npm test`. When `.github/scripts/change-scope.sh` finds that every changed file is under `docs/` or is Markdown at the root other than `AGENTS.md` and `CLAUDE.md`, it skips the skill check, the tests, the dependency install, and the typecheck, and still reports the required `test` check. Without a base to compare, it runs everything.

Every step in a workflow or a composite action has a `name`: a short imperative phrase in English, such as `Install dependencies`. The run log and the pull request checks show that name instead of the command.

## Actions

Business harnesses call two composite actions from this repository. Each one runs the scripts of the tag the caller pins, against the caller's checkout in `github.workspace`.

`check-skill` installs Python 3.14 and runs `.agents/scripts/check-skill/run-check.sh` with `HARNESS_ROOT` set to the caller. `base` and `head` limit the check to the skills that changed. An error becomes an `::error` annotation with the file and the line, and the job summary is one table of skills. Every check that `run-check.sh` runs does the same: it prints `file:line: message`, and in GitHub Actions an `::error` annotation with that file and line, so the pull request shows the finding inline on the line that causes it. A new check follows that rule.

`sync-skill-pages` first stops with an `::error` annotation when `notion-token` is empty, before any install. Then it installs Node.js 24 and the runtime dependencies of this repository, then runs `.agents/scripts/sync-skill-pages/sync-skill-pages.ts` with `HARNESS_ROOT` set to the caller. It reads the mapping from `mapping`, the page icon from the parameters in the frontmatter of the caller's `AGENTS.md` with the core fallback, and the token from `notion-token`. It creates or updates a page for each changed skill that does not set `metadata.notion` to `"false"` or `metadata.internal` to `true`, and a page for the caller's `AGENTS.md` when that file changes. When a published skill cites an output template and the mapping sets `templates_parent_page_id`, it publishes that template as a child page of that page and replaces the path in the skill page with a mention of it; a change to a template republishes the skills that cite it. A change to the mapping republishes every skill. A skill removed from git does not remove the page. A rename keeps the page whose title is the previous name when the new skill lists it in `metadata.aliases`.

With `include-core`, which is on by default, the action also publishes the skills of this repository into the caller's Notion, with the caller's mapping. It does that when the change between `base` and `head` touches the caller's mapping, a file under `.github/workflows/`, `package.json`, or `package-lock.json`, which is where a business harness moves the version of this repository it uses. A skill name that exists in both repositories stops the sync.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a GitHub Release. Business harnesses pin the actions, the plugin, and the Node.js dependency to that full tag.

Release Please owns the version. `.github/workflows/release-please.yml` runs on every push to `main` and keeps one release pull request open. That pull request bumps `version` in `package.json`, `.claude-plugin/plugin.json`, and `.cursor-plugin/plugin.json`, and writes `CHANGELOG.md` from the Conventional Commits since the last release. Merging it creates the tag and the GitHub Release. The first release is 0.1.0. Before 1.0.0, a breaking change bumps the minor version. Do not bump either version or create a tag by hand. The configuration is `release-please-config.json`, and the last released version is in `.release-please-manifest.json`.

The release pull request is opened with `GITHUB_TOKEN`, so CI does not run on it. Every commit it describes already passed CI on its own pull request.

## Renovate

`default.json` is the shared Renovate preset. This repository extends it from `renovate.json`, and business harnesses extend it as `github>jimmyandrade/harness`. It runs before 9 a.m. on Mondays, São Paulo time, with semantic commits. A major update waits for approval on the Dependency Dashboard. Every pin of this repository, in a workflow, in `package.json`, or in `.claude-plugin/marketplace.json`, moves in one `harness core` pull request as soon as a release exists. The marketplace pin, a `url` plugin source that Codex reads too, is read by a regex manager, because Renovate does not know that file. A pin of jimmyandrade/vocabulary in `package.json` moves the same way, in its own `vocabulary` pull request.

When a workflow or an action changes, update this file from the diff.
