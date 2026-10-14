---
locale: en
---

# Connect MCP hosts to the vocabulary server

An MCP host is the application a person talks to. It reads a list of MCP servers and starts them. The project list is `.agents/mcp.json`, with `mcpServers` as the first key. It starts the `vocabulary` server, which reads the glossary in `.agents/glossary/` of the project that is open. `HARNESS_GLOSSARY_DIR` points it at another directory.

Cursor reads `.cursor/mcp.json`. Claude Code reads `.mcp.json` at the project root. Claude Desktop, Windsurf, and Cline keep their list outside the repository, so each one gets a link to `.agents/mcp.json`. VS Code expects `servers` as the first key, so it does not use this list.

`.mcp.json` is a link to `.agents/mcp.json`, not a second copy. The harness `core` plugin does not start this server.

Run this runbook from the root of the project, after the project has a `package.json`. Each step ends with a check. A link replaces the whole file it points from: copy anything you still need into `.agents/mcp.json` first. If you move the clone, create the links again.

## 1. Install the package and write the project list

```bash
npm install --save-dev github:jimmyandrade/vocabulary
mkdir -p .agents
cp -n node_modules/vocabulary/examples/mcp.json .agents/mcp.json
ln -sfn .agents/mcp.json .mcp.json
```

The list starts `node node_modules/vocabulary/dist/mcp/index.js`. Node.js does not strip TypeScript types under `node_modules`, so a list that starts `node_modules/vocabulary/api/mcp/index.ts` fails with `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`. Change that path to `node_modules/vocabulary/dist/mcp/index.js`. The `prepare` script of the package writes `dist/` during the install, so do not install with `--ignore-scripts`. npm may list that script as not covered by `allowScripts`. It still runs.

Check: `jq -r '.mcpServers | keys[]' .agents/mcp.json` prints `vocabulary`, `readlink .mcp.json` prints `.agents/mcp.json`, and `node node_modules/vocabulary/dist/mcp/index.js < /dev/null && echo ok` prints `ok`.

## 2. Link Cursor

```bash
mkdir -p .cursor
ln -sfn ../.agents/mcp.json .cursor/mcp.json
```

Commit the link.

Check: `readlink .cursor/mcp.json` prints `../.agents/mcp.json`.

## 3. Link Claude Desktop

On macOS the file is `~/Library/Application Support/Claude/claude_desktop_config.json`. It also stores Claude Desktop preferences.

```bash
ln -sfn "$PWD/.agents/mcp.json" "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

On Linux the file is `~/.config/Claude/claude_desktop_config.json`. On Windows it is `%APPDATA%\Claude\claude_desktop_config.json`.

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 4. Link Windsurf

On macOS and Linux the file is `~/.codeium/windsurf/mcp_config.json`. On Windows it is `%USERPROFILE%\.codeium\windsurf\mcp_config.json`.

```bash
mkdir -p "$HOME/.codeium/windsurf"
ln -sfn "$PWD/.agents/mcp.json" "$HOME/.codeium/windsurf/mcp_config.json"
```

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 5. Link Cline

The VS Code extension on macOS uses `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`. The same extension in Cursor uses `Cursor` in place of `Code`. The Cline CLI uses `~/.cline/data/settings/cline_mcp_settings.json`.

```bash
mkdir -p "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
ln -sfn "$PWD/.agents/mcp.json" "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

On Linux the extension file is under `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/`. On Windows it is under `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\`.

Check: `readlink` on that file prints the path of `.agents/mcp.json`.

## 6. Confirm in a host

Restart the host and ask it to look up a term of the glossary.

Check: the host lists the `vocabulary` tools `lookup_term`, `exists_in_text`, and `write_terms`.
