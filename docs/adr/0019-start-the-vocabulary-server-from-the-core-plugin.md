---
locale: en
---

# Start the vocabulary server from the core plugin

## Status

Accepted. It carries out the sentence of `docs/adr/0018-bring-the-vocabulary-back-into-this-repository.md` that says the `core` plugin starts the vocabulary server, which the repository did not do until now.

## Context

ADR 0018 promised one plugin, one version, and one release line, with the plugin starting the server. The import kept the opposite behavior of the archived repository: the plugin shipped only skills, a test asserted that it declared no MCP server, and the runbook told a person to install the package from npm in every project, or to clone, install, and build the repository by hand. A person who updated the `core` plugin still had to keep a second copy of the server in step with it.

Two facts shaped the choice:

- The plugin folder has no `node_modules` and no `dist/`. A plugin install copies the tracked files and runs no npm script, so the `prepare` script of `docs/adr/0007-build-on-install.md` never runs.
- Node.js strips TypeScript types only outside `node_modules`, and the plugin folder is not under one. Node.js 22.18 and newer strip types by default. The server needs only one runtime dependency, `zod`.

## Decision

`.claude-plugin/plugin.json` declares an MCP server named `vocabulary` that runs `vocabulary/api/mcp/launch.sh`. The launcher checks that Node.js strips types, installs the runtime dependencies with `npm ci --omit=dev --ignore-scripts` inside the plugin folder the first time, and runs `vocabulary/api/mcp/index.ts` directly. It writes only to stderr.

The three options were weighed this way. Running the TypeScript directly keeps one source and needs no build. A compiled `dist/` in the plugin would repeat what ADR 0007 removed, a committed copy that changes with every change to `api/`. A launcher that compiles on the first run needs the development dependencies, TypeScript included, for no gain over type stripping.

The plugin passes `HARNESS_ROOT=${CLAUDE_PROJECT_DIR}`, so the server reads `.agents/glossary/` of the open project, and `HARNESS_GLOSSARY_DIR=${HARNESS_GLOSSARY_DIR:-}`, so a person points every project at one glossary from their own environment without editing the plugin. An empty value counts as unset.

The server starts whenever it can. When Node.js is too old, npm is missing, or the first install has no network, the launcher exits with a message and Claude Code lists the server as failed. The skills do not depend on the server, so they keep working, and the project list of `vocabulary/docs/runbooks/mcp-hosts.md` remains the way to start the server.

The Cursor and Codex manifests do not declare the server. Cursor keeps its own list, and the repository has not confirmed that Codex reads the same field.

## Consequences

A person who enables the `core` plugin gets the server and updates it with the plugin. The first start of each plugin version runs `npm ci`, which needs the registry.

A person who configured a server named `vocabulary` by hand has two servers after the update. `vocabulary/docs/runbooks/mcp-hosts.md` says which one to remove.

The plugin starts the server in every project where it is enabled, including a project with no glossary, where the tools answer that the language is unknown.

`vocabulary/api/mcp/plugin.test.ts` replaces the test that asserted the opposite. It checks the declaration and starts the launcher from a copy of the tracked files, which needs npm and the registry, like `vocabulary/api/mcp/installed.test.ts`.
