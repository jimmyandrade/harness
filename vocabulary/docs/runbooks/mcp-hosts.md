---
locale: en
---

# Connect MCP hosts to the vocabulary server

An MCP host is the application a person talks to. It reads a list of MCP servers and starts them. There are two ways to start the `vocabulary` server, and a host uses one of them, never both.

- Claude Code with the `core` plugin starts it by itself. `.claude-plugin/plugin.json` declares it, so there is nothing to clone, install, or build. Step 1 explains how it runs and how to point it at a glossary.
- Every other host, and Claude Code when the plugin cannot start the server, reads a project list that comes from the npm dependency. The list is `.agents/mcp.json`, with `mcpServers` as the first key. Steps 2 to 7 set it up.

The server reads the glossary in `.agents/glossary/` of the project that is open. `HARNESS_GLOSSARY_DIR` points it at another directory.

Cursor reads `.cursor/mcp.json`. Claude Code reads `.mcp.json` at the project root. Claude Desktop, Windsurf, and Cline keep their list outside the repository, so each one gets a link to `.agents/mcp.json`. VS Code expects `servers` as the first key, so it does not use this list. The Cursor and Codex manifests of the plugin do not declare the server, so those two hosts use the project list.

`.mcp.json` is a link to `.agents/mcp.json`, not a second copy. Run steps 2 to 7 from the root of the project, after the project has a `package.json`. A link replaces the whole file it points from: copy anything you still need into `.agents/mcp.json` first. If you move the clone, create the links again. Each step ends with a check.

## 1. Start the server from the `core` plugin

The plugin declares a server named `vocabulary`. Claude Code shows it as `plugin:core:vocabulary` and starts it when the plugin is enabled, in every project. It runs `vocabulary/api/mcp/launch.sh`, which:

1. Stops with a message on stderr when `node` is missing or does not strip TypeScript types by default, which Node.js 22.18 or newer does. The plugin ships `api/` as TypeScript, with no `dist/`, and Node.js strips types outside `node_modules`, where the plugin does not live.
2. Runs `npm ci --omit=dev --ignore-scripts` inside the plugin folder when `node_modules/zod` is missing. That happens once per plugin version, on the first start, and needs npm and the registry. `prepare` is skipped because it compiles with the development dependencies.
3. Runs `node vocabulary/api/mcp/index.ts`.

The glossary is `.agents/glossary/` of the project that is open: the plugin passes `HARNESS_ROOT=${CLAUDE_PROJECT_DIR}`. To read another directory, such as a glossary you keep for every project, set `HARNESS_GLOSSARY_DIR` in the environment Claude Code starts with, for example in the `env` of `~/.claude/settings.json`. The plugin reads it with an empty default, so it needs no edit.

```json
{ "env": { "HARNESS_GLOSSARY_DIR": "/path/to/glossary" } }
```

When the server cannot start, the `core` skills still load. The cause can be a Node.js older than 22.18, no npm, or no network on the first start. Claude Code lists `plugin:core:vocabulary` as failed in `/mcp`, and the launcher says why on stderr. Use steps 2 to 7, which do not depend on the plugin.

Do not run two servers named `vocabulary`. A server you configured by hand, in `.mcp.json`, in `~/.claude.json`, or with `claude mcp add`, is a second server next to `plugin:core:vocabulary`, with its own tool names, so the agent sees every tool twice. Pick one:

- Keep the plugin: remove the server you configured, with `claude mcp remove vocabulary --scope user`, `--scope project`, or `--scope local`, whichever `claude mcp list` shows.
- Keep your server, for example one from a clone or from steps 2 to 7: disable `plugin:core:vocabulary` in `/mcp`.

Check: `/mcp` in Claude Code lists `plugin:core:vocabulary` as connected and no other `vocabulary` server. To test the launcher without a host, run `sh vocabulary/api/mcp/launch.sh < /dev/null && echo ok` from the plugin folder: it prints `ok`.

## 2. Install the package and write the project list

Skip steps 2 to 7 in Claude Code while the plugin server of step 1 is connected: a second `vocabulary` server duplicates every tool.

```bash
npm install --save-dev github:jimmyandrade/harness
mkdir -p .agents
cp -n node_modules/harness/vocabulary/examples/mcp.json .agents/mcp.json
ln -sfn .agents/mcp.json .mcp.json
```

The list starts `node node_modules/harness/vocabulary/dist/mcp/index.js`. Node.js does not strip TypeScript types under `node_modules`, so a list that starts `node_modules/harness/vocabulary/api/mcp/index.ts` fails with `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`. Change that path to `node_modules/harness/vocabulary/dist/mcp/index.js`. The `prepare` script of the package writes `dist/` during the install, so do not install with `--ignore-scripts`. npm may list that script as not covered by `allowScripts`. It still runs.

Check: `jq -r '.mcpServers | keys[]' .agents/mcp.json` prints `vocabulary`, `readlink .mcp.json` prints `.agents/mcp.json`, and `node node_modules/harness/vocabulary/dist/mcp/index.js < /dev/null && echo ok` prints `ok`.

## 3. Link Cursor

```bash
mkdir -p .cursor
ln -sfn ../.agents/mcp.json .cursor/mcp.json
```

Commit the link.

Check: `readlink .cursor/mcp.json` prints `../.agents/mcp.json`.

## 4. Link Claude Desktop

On macOS the file is `~/Library/Application Support/Claude/claude_desktop_config.json`. It also stores Claude Desktop preferences.

```bash
ln -sfn "$PWD/.agents/mcp.json" "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

On Linux the file is `~/.config/Claude/claude_desktop_config.json`. On Windows it is `%APPDATA%\Claude\claude_desktop_config.json`.

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 5. Link Windsurf

On macOS and Linux the file is `~/.codeium/windsurf/mcp_config.json`. On Windows it is `%USERPROFILE%\.codeium\windsurf\mcp_config.json`.

```bash
mkdir -p "$HOME/.codeium/windsurf"
ln -sfn "$PWD/.agents/mcp.json" "$HOME/.codeium/windsurf/mcp_config.json"
```

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 6. Link Cline

The VS Code extension on macOS uses `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`. The same extension in Cursor uses `Cursor` in place of `Code`. The Cline CLI uses `~/.cline/data/settings/cline_mcp_settings.json`.

```bash
mkdir -p "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
ln -sfn "$PWD/.agents/mcp.json" "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

On Linux the extension file is under `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/`. On Windows it is under `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\`.

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 7. Confirm in a host

Restart the host and ask it to look up a term of the glossary.

Check: the host lists the `vocabulary` tools `lookup_term`, `exists_in_text`, `write_terms`, and `migrate_glossary`.
