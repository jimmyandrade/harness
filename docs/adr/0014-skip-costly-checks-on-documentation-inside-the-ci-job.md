---
locale: en
---

# Skip costly checks on documentation inside the ci job

## Status

Accepted

## Context

The `test` job of the `ci` workflow runs the skill check, the script tests, `npm ci`, the typecheck, and the unit tests on every pull request and on every push to `main`. A pull request that only changed `docs/adr/` spent 44 seconds on those steps, and none of them could fail because of that change (issue 215).

The ruleset of `main` requires the `test` check. A pull request cannot merge until a job named `test` reports success.

Four ways to skip the work were considered before the one below:

- **`paths-ignore` on the workflow.** It skips the whole workflow, so no job named `test` runs. GitHub then keeps the required check pending, waiting for a status that never comes, and the pull request cannot merge.
- **A second workflow with a job of the same name**, triggered only on documentation paths and always passing. It reports the required check, but the two files must keep the same job name, and nothing warns when one changes and the other does not.
- **Removing `test` from the ruleset of `main`.** Any pull request could then merge without tests, which costs more than the time it saves.
- **The `dorny/paths-filter` action**, evaluated in October 2026. It is widely used and maintained, but it had a high severity advisory on 2026-08-05, GHSA-7hc6-8hq5-9q2m, a shell command injection through a changed file name with a newline in its `list-files: shell` output. A security fix for its `picomatch` dependency was committed on 2026-09-27 and had no release yet. The core pins actions by tag, and a tag can be moved, so a third-party action would need a commit pin that Renovate does not keep today. The action would also run with the pull request token on file names that anyone can choose. Our case needs two filters and one condition, about the same size as a short script.

## Decision

The `test` job always runs, so the required check is always reported. Its first steps check out the repository, check the branch name, and run `.github/scripts/change-scope.sh` with the base and head commits. The script prints `code=false` when every changed file is under `docs/` or is Markdown at the root other than `AGENTS.md` and `CLAUDE.md`, which the skill check reads, and `code=true` otherwise. Without a base to compare, as on the first push of a branch, it prints `code=true`.

The costly steps run only when the output is `code=true`.

The decision lives in a script, not inline in the workflow, so that a person reading `ci.yml` sees what each step does at a glance (issue 217).

## Consequences

A documentation-only pull request finishes the required check after the checkout, the branch name check, and the script, with no dependency outside `git` and `bash`.

A new kind of file that the skill check or the tests read, outside `docs/` and outside root Markdown, is checked by default, because the script treats every unknown path as code. Moving a file into `docs/` or making a root Markdown file matter to a check needs a change to the script.

Adopting a path filter action later needs, at least: a pin by commit SHA that Renovate updates, no use of file list outputs in shell, and a release that carries every known security fix. This record is the place to revisit that choice.
