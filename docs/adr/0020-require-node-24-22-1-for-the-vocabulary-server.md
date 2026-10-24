---
locale: en
---

# Require Node.js 24.22.1 for the vocabulary server

## Status

Accepted. It amends `docs/adr/0019-start-the-vocabulary-server-from-the-core-plugin.md` in one point: the launcher no longer accepts any Node.js that strips types, it requires Node.js 24.22.1 or newer. Everything else in ADR 0019 stands.

## Context

ADR 0019 made the `core` plugin start the vocabulary server with `vocabulary/api/mcp/launch.sh`, which ran the TypeScript directly and accepted any Node.js that strips types by default, 22.18 and newer. The rest of the repository asks for more: `package.json` has `engines.node` set to `>=24`, and CI runs on Node.js 24. Two requirements for one runtime meant a Node.js between 22.18 and 24 started the server in the plugin but could not run the tests or the build of this repository.

The launcher also cannot choose a Node.js. It runs the first `node` on the `PATH` of the app that started it, so a person whose default Node.js is older gets the failure message and not the server.

## Decision

The launcher requires Node.js 24.22.1 or newer. It compares major, minor, and patch with plain `sh`, with no tool outside POSIX, and keeps the check that types are stripped as a second barrier. On failure it writes to stderr the version it found, the version it requires, and a pointer to `vocabulary/docs/runbooks/mcp-hosts.md`, and exits with a non-zero code. The plugin and its skills keep working, as ADR 0019 decides.

`engines.node` in `package.json` is `>=24.22.1`, so the package, the CI, and the plugin ask for the same minimum. The CI keeps `node-version: 24` and sets `check-latest: true` on `actions/setup-node`, in the workflow and in the `sync-notion-pages` action. Without it, the `24` resolved to the 24.x already on the runner image, 24.21.0, which the launcher test rejected. With it, the runner downloads the newest 24.x, so nothing needs an update when a newer Node.js 24 comes out.

The runbook says how to leave a suitable Node.js as the default, for example `nvm alias default 24.22.1`, and that the app must be started again to inherit the `PATH`.

## Alternatives considered

- Keep 22.18. It is the lowest version that strips types, but it keeps two minimums in one repository, and the Node.js that the owner of the repository uses and the CI tests is 24.
- Choose the Node.js inside the launcher, for example by searching the folders of `nvm`. It would start the server on more machines, but it makes the launcher depend on one version manager, on paths that vary, and on a choice the person did not make. The `PATH` is the one place every manager already controls.

## Consequences

A person whose default Node.js is older than 24.22.1 has no `plugin:core:vocabulary` server. Claude Code lists it as failed, the launcher says why, and the person either updates the default Node.js or uses the steps of the runbook that do not depend on the plugin.

`vocabulary/api/mcp/plugin.test.ts` tests the check with a stand-in `node` that reports a version, so it needs no other Node.js installed: versions below 24.22.1 must exit with the message, and 24.22.1 and newer must pass the check.
