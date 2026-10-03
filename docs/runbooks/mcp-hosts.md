---
locale: en
---

# Connect MCP hosts to the project servers

An MCP host is the application a person talks to. It reads a list of MCP servers and starts them. The project list is `.mcp.json` at the root, with `mcpServers` as the first key. It starts the `vocabulary` server, which reads the glossary in `.agents/glossary/`.

Claude Code loads the vocabulary server through the `harness-core` plugin (`claude-code.md`). Cursor reads `.cursor/mcp.json`. Claude Desktop, Windsurf, and Cline keep their list outside the repository, so each one gets a link to `.mcp.json`. VS Code expects `servers` as the first key, so it does not use this list.

Run this runbook from the root of the project. Each step ends with a check. A link replaces the whole file it points from: copy anything you still need into `.mcp.json` first. If you move the clone, create the links again.

## 1. Write the project list

A business harness already has `.mcp.json` from `business-repository.md`, step 3. Any other project copies it.

```bash
cp -n node_modules/harness/examples/business-harness/.mcp.json .mcp.json
```

Check: `jq -r '.mcpServers | keys[]' .mcp.json` prints `vocabulary`.

## 2. Link Cursor

```bash
mkdir -p .cursor
ln -s ../.mcp.json .cursor/mcp.json
```

Commit the link.

Check: `readlink .cursor/mcp.json` prints `../.mcp.json`.

## 3. Link Claude Desktop

On macOS the file is `~/Library/Application Support/Claude/claude_desktop_config.json`. It also stores Claude Desktop preferences.

```bash
ln -sf "$PWD/.mcp.json" "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

On Linux the file is `~/.config/Claude/claude_desktop_config.json`. On Windows it is `%APPDATA%\Claude\claude_desktop_config.json`.

Check: `readlink` on that file prints the path of `.mcp.json`.

## 4. Link Windsurf

On macOS and Linux the file is `~/.codeium/windsurf/mcp_config.json`. On Windows it is `%USERPROFILE%\.codeium\windsurf\mcp_config.json`.

```bash
mkdir -p "$HOME/.codeium/windsurf"
ln -sf "$PWD/.mcp.json" "$HOME/.codeium/windsurf/mcp_config.json"
```

Check: `readlink` on that file prints the path of `.mcp.json`.

## 5. Link Cline

The VS Code extension on macOS uses `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`. The same extension in Cursor uses `Cursor` in place of `Code`. The Cline CLI uses `~/.cline/data/settings/cline_mcp_settings.json`.

```bash
mkdir -p "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
ln -sf "$PWD/.mcp.json" "$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
```

On Linux the extension file is under `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/`. On Windows it is under `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\`.

Check: `readlink` on that file prints the path of `.mcp.json`.

## 6. Confirm in a host

Restart the host and ask it to look up a term of the glossary.

Check: the host lists the `vocabulary` tools `lookup_term`, `exists_in_text`, and `write_terms`.
