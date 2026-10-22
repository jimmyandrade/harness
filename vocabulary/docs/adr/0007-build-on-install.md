---
locale: en
---

# Build on install

## Status

Accepted. Supersedes `docs/adr/0006-ship-compiled-javascript.md`.

## Context

`docs/adr/0006-ship-compiled-javascript.md` committed `dist/`, the JavaScript compiled from `api/`, because Node.js does not strip TypeScript types under `node_modules`. It rejected a `prepare` script on the belief that npm 11 blocks the lifecycle scripts of a dependency until the project approves them. That test had `dist/` in `.gitignore` and no `files` field, so npm left the compiled files out of the package. The script had run.

In npm 11.17, `allowScripts` is advisory. A first `npm install` of a git dependency with a `prepare` script prints that the script is not covered by `allowScripts`, and runs it. `npm ci` from the lockfile runs it without that notice. The lockfile keeps no integrity for a prepared git dependency.

A committed `dist/` duplicates every change to `api/` and fails CI whenever the compiler output moves.

## Decision

`dist/` is not committed. `prepare` runs `npm run build`. When a project installs this repository from git, npm installs its development dependencies in a temporary clone, runs `prepare`, and packs the `files` listed in `package.json`: `dist`, `docs`, `examples`, `.agents`, and `COMMERCIAL.md`.

A project runs `node node_modules/vocabulary/dist/mcp/index.js` and `node node_modules/vocabulary/dist/cli.js`, as before. This repository keeps running `api/` directly.

## Consequences

An install from git downloads TypeScript and compiles once per install. It works under `.npmrc` `allow-git=root`. An install with `--ignore-scripts` has no `dist/`.

`api/mcp/installed.test.ts` installs the committed `HEAD` from git into a scratch project and runs the command in `examples/mcp.json`. It does not see uncommitted changes. It needs npm, git, and the registry.

The package no longer ships `api/`. A project that ran a file under `node_modules/vocabulary/api/` already failed on type stripping.
