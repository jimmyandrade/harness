#!/bin/sh
# Start the vocabulary MCP server from an installed plugin.
# Dependencies are installed once per plugin version, inside that version.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
if [ ! -d "$CORE/node_modules/zod" ]; then
  npm ci --omit=dev --no-audit --no-fund --silent --prefix "$CORE" >&2
fi
exec node "$CORE/api/mcp/index.ts" "$@"
