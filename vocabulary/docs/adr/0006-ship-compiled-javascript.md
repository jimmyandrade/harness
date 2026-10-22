---
locale: en
---

# Ship compiled JavaScript for an installed copy

## Status

Superseded by `docs/adr/0007-build-on-install.md`. `dist/` is no longer committed.

## Context

A project installs this repository with `npm install --save-dev github:jimmyandrade/vocabulary` and starts the MCP server from `node_modules/vocabulary`. Node.js 24 and 26 strip TypeScript types, but not for a file under `node_modules`. `node node_modules/vocabulary/api/mcp/index.ts` stops with `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`, and so does the command line in `api/cli.ts`.

A `prepare` script could compile on install. npm 11 does not run the lifecycle scripts of a dependency until the project approves them with `npm approve-scripts`, so the install would end without the compiled files. A launcher that copies the source out of `node_modules`, or a loader hook that strips types itself, would depend on an experimental Node.js API.

## Decision

`npm run build` compiles `api/` to `dist/` with `tsconfig.build.json`, which rewrites the `.ts` imports to `.js` and leaves the tests out. `dist/` is committed with the source change that produced it.

A project runs `node node_modules/vocabulary/dist/mcp/index.js` and `node node_modules/vocabulary/dist/cli.js`. This repository keeps running `api/` directly, as `.mcp.json` and `npm test` do.

## Consequences

An install needs no script and no approval. It works under `.npmrc` `allow-git=root`.

CI runs `npm run build` and fails when `dist/` differs from the commit. A change to `api/`, or a move of the `typescript` pin that changes the output, commits the new `dist/`.

`api/mcp/installed.test.ts` packs this repository, installs it in a scratch project, and runs the command in `examples/mcp.json`. It needs npm and the registry for `zod`.

The type check is still `tsc --noEmit`, as `docs/adr/0005-typecheck-with-typescript-7.md` decides. The build is a second `tsc` run with its own configuration.
