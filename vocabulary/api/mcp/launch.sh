#!/bin/sh
# Start the vocabulary MCP server from an installed `core` plugin.
# The plugin ships api/ as TypeScript and has no node_modules, so this script
# installs the runtime dependencies once per plugin version, inside that version,
# and runs the server with the type stripping of Node.js.
# It writes only to stderr: stdout belongs to the MCP protocol.
set -eu

# pwd -P resolves symlinks: the server starts only when argv[1] equals its own real path, and npm misreads the lockfile under a symlinked one.
ROOT="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd -P)"

fail() {
  echo "vocabulary: $1 The core plugin skills still work; see vocabulary/docs/runbooks/mcp-hosts.md for the fallback." >&2
  exit 1
}

command -v node >/dev/null 2>&1 || fail "Node.js is not on PATH."
[ "$(node -p 'Boolean(process.features.typescript)' 2>/dev/null)" = "true" ] ||
  fail "Node.js $(node -v) does not strip TypeScript types by default. Use Node.js 22.18 or newer."

if [ ! -f "$ROOT/node_modules/zod/package.json" ]; then
  command -v npm >/dev/null 2>&1 || fail "npm is not on PATH, and the dependencies are not installed."
  # --ignore-scripts skips prepare, which needs the development dependencies to compile.
  (cd "$ROOT" && npm ci --omit=dev --ignore-scripts --no-audit --no-fund --loglevel=error >&2) ||
    fail "npm ci failed."
fi

exec node "$ROOT/vocabulary/api/mcp/index.ts" "$@"
