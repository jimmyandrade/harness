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
| `test` | Tests only |
| `chore` | Upkeep that is none of the above |
| `ci` | CI and the actions under `.github/actions/` |

## CI

The workflow is `.github/workflows/ci.yml`. It runs on every push and pull request on `ubuntu-26.04`. It checks out the full history, runs the `check-skill` action of this repository against itself, typechecks, and runs `npm test`.

## Actions

Business harnesses call two composite actions from this repository. Each one runs the scripts of the tag the caller pins, against the caller's checkout in `github.workspace`.

`check-skill` installs Python 3.14 and runs `.agents/scripts/check-skill/run-check.sh` with `HARNESS_ROOT` set to the caller. `base` and `head` limit the check to the skills that changed. An error becomes an `::error` annotation with the file and the line, and the job summary is one table of skills.

`sync-skill-pages` installs Node.js 24 and the runtime dependencies of this repository, then runs `.agents/scripts/sync-skill-pages/sync-skill-pages.ts` with `HARNESS_ROOT` set to the caller. It reads the mapping from `mapping`, the page icon from the caller's `.agents/config.yml` with the core fallback, and the token from `notion-token`. It creates or updates a page for each changed skill that does not set `metadata.notion` to `"false"`. A change to the mapping republishes every skill. A skill removed from git does not remove the page. A rename keeps the page whose title is the previous name when the new skill lists it in `metadata.aliases`.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a moving `vMAJOR` tag. Business harnesses pin the actions to `vMAJOR`, and the plugin and the Node.js dependency to the full tag. Bump `version` in `.claude-plugin/plugin.json` and `package.json` with the tag.

When a workflow or an action changes, update this file from the diff.
