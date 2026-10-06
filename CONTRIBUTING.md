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

## CI

The workflow is `.github/workflows/ci.yml`. It runs on every pull request and on every push to `main`, on `ubuntu-26.04`. A push to another branch does not run it, so a pull request runs the checks once. It checks out the full history, runs the `check-skill` action of this repository against itself, runs every `.agents/scripts/*/test_*.py` and `.agents/skills/*/scripts/test_*.py` with the checker's own Python, typechecks, and runs `npm test`.

Every step in a workflow or a composite action has a `name`: a short imperative phrase in English, such as `Install dependencies`. The run log and the pull request checks show that name instead of the command.

## Actions

Business harnesses call two composite actions from this repository. Each one runs the scripts of the tag the caller pins, against the caller's checkout in `github.workspace`.

`check-skill` installs Python 3.14 and runs `.agents/scripts/check-skill/run-check.sh` with `HARNESS_ROOT` set to the caller. `base` and `head` limit the check to the skills that changed. An error becomes an `::error` annotation with the file and the line, and the job summary is one table of skills.

`sync-skill-pages` first stops with an `::error` annotation when `notion-token` is empty, before any install. Then it installs Node.js 24 and the runtime dependencies of this repository, then runs `.agents/scripts/sync-skill-pages/sync-skill-pages.ts` with `HARNESS_ROOT` set to the caller. It reads the mapping from `mapping`, the page icon from the parameters in the frontmatter of the caller's `AGENTS.md` with the core fallback, and the token from `notion-token`. It creates or updates a page for each changed skill that does not set `metadata.notion` to `"false"`, and a page for the caller's `AGENTS.md` when that file changes. A change to the mapping republishes every skill. A skill removed from git does not remove the page. A rename keeps the page whose title is the previous name when the new skill lists it in `metadata.aliases`.

With `include-core`, which is on by default, the action also publishes the skills of this repository into the caller's Notion, with the caller's mapping. It does that when the caller's push changes its mapping, a file under `.github/workflows/`, `package.json`, or `package-lock.json`, which is where a business harness moves the version of this repository it uses. A skill name that exists in both repositories stops the sync.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a GitHub Release. Business harnesses pin the actions, the plugin, and the Node.js dependency to that full tag.

Release Please owns the version. `.github/workflows/release-please.yml` runs on every push to `main` and keeps one release pull request open. That pull request bumps `version` in `package.json` and `.claude-plugin/plugin.json`, and writes `CHANGELOG.md` from the Conventional Commits since the last release. Merging it creates the tag and the GitHub Release. The first release is 0.1.0. Before 1.0.0, a breaking change bumps the minor version. Do not bump either version or create a tag by hand. The configuration is `release-please-config.json`, and the last released version is in `.release-please-manifest.json`.

The release pull request is opened with `GITHUB_TOKEN`, so CI does not run on it. Every commit it describes already passed CI on its own pull request.

## Renovate

`default.json` is the shared Renovate preset. This repository extends it from `renovate.json`, and business harnesses extend it as `github>jimmyandrade/harness`. It runs before 9 a.m. on Mondays, São Paulo time, with semantic commits. A major update waits for approval on the Dependency Dashboard. Every pin of this repository, in a workflow, in `package.json`, or in `.claude-plugin/marketplace.json`, moves in one `harness core` pull request as soon as a release exists. The marketplace pin is read by a regex manager, because Renovate does not know that file.

When a workflow or an action changes, update this file from the diff.
