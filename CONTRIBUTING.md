---
locale: en
---

# Contributing

## Commits

Subjects follow [Conventional Commits](https://www.conventionalcommits.org/): `type: description`, in English. Release Please reads them to pick the next version and write `CHANGELOG.md`.

| Type | Use |
| --- | --- |
| `feat` | A feature a person or a project uses |
| `fix` | A defect |
| `docs` | Documentation only |
| `refactor` | A behavior-preserving restructure |
| `perf` | A change that makes something faster or lighter, with no other behavior change |
| `test` | Tests only |
| `chore` | Upkeep that is none of the above |
| `ci` | The workflows under `.github/workflows/` |

Branches are named `type/short-description`, with one of these types and an ASCII kebab-case description, such as `fix/mcp-path`. A branch a tool created with another prefix, such as `claude/`, is renamed before the first push. CI fails a pull request from a branch outside that pattern.

Every change lands through a pull request. Do not push to `main`.

## CI

`.github/workflows/ci.yml` runs on every pull request and on every push to `main`, on `ubuntu-26.04`. On a pull request it first checks that the branch is `type/short-description`, skipping Renovate, Dependabot, and Release Please branches. Then it typechecks and runs `npm test`. `npm ci` builds `dist/` through `prepare`, and one test installs the commit from git and starts the MCP server from that copy. `.github/workflows/skill-check.yml` checks the skills with the harness action when a skill or `AGENTS.md` changes.

Every step in a workflow has a `name`: a short imperative phrase in English, such as `Install dependencies`.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a GitHub Release. Business harnesses pin the npm dependency to that full tag, as in `github:jimmyandrade/vocabulary#vMAJOR.MINOR.PATCH`.

Release Please owns the version. `.github/workflows/release-please.yml` runs on every push to `main` and keeps one release pull request open. That pull request bumps `version` in `package.json` and `package-lock.json`, and writes `CHANGELOG.md` from the Conventional Commits since the last release. Merging it creates the tag and the GitHub Release. Before the first major version, a breaking change bumps the minor version. Do not bump the version or create a tag by hand. The configuration is `release-please-config.json`, and the last released version is in `.release-please-manifest.json`.

The MCP server reads its version from `package.json`, so the release pull request does not touch `api/`.

The release pull request is opened with `GITHUB_TOKEN`, so CI does not run on it. Every commit it describes already passed CI on its own pull request.

## Renovate

`renovate.json` extends the shared preset of the core harness, `github>jimmyandrade/harness`. A business harness extends the same preset. Renovate moves a pin of this repository in a business harness when the pin is a release tag and a newer tag exists. A pin to a commit does not move.

When a workflow changes, update this file from the diff.
