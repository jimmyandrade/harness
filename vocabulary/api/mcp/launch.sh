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

# The launcher cannot pick a Node.js: it runs the first `node` on the PATH of the app that started it.
REQUIRED="24.22.1"
FOUND="$(node -p 'process.versions.node' 2>/dev/null || true)"
version_at_least() {
  # Compares major, minor, and patch as integers; a pre-release suffix is ignored.
  [ -n "$1" ] || return 1
  old_ifs="$IFS"
  IFS=.
  # shellcheck disable=SC2086
  set -- $1 $2
  IFS="$old_ifs"
  [ "$#" -eq 6 ] || return 1
  for part in "$1" "$2" "$3" "$4" "$5" "$6"; do
    case "$part" in '' | *[!0-9]*) return 1 ;; esac
  done
  [ "$1" -gt "$4" ] && return 0
  [ "$1" -lt "$4" ] && return 1
  [ "$2" -gt "$5" ] && return 0
  [ "$2" -lt "$5" ] && return 1
  [ "$3" -ge "$6" ]
}
version_at_least "${FOUND%%[-+]*}" "$REQUIRED" ||
  fail "Node.js ${FOUND:-of unknown version} is on PATH, and Node.js $REQUIRED or newer is required."
[ "$(node -p 'Boolean(process.features.typescript)' 2>/dev/null)" = "true" ] ||
  fail "Node.js $FOUND does not strip TypeScript types by default. Use Node.js $REQUIRED or newer."

# The marker is written only after npm ci finishes. A file of a package proves nothing:
# a launcher stopped in the middle of an install leaves half of node_modules behind.
MARKER="$ROOT/node_modules/.vocabulary-installed"
# A host can start the server twice at once, and two npm ci in the same folder break each other.
# mkdir is atomic, so only one launcher installs; the others wait for its marker.
LOCK="$ROOT/.vocabulary-install.lock"
if [ ! -f "$MARKER" ]; then
  command -v npm >/dev/null 2>&1 || fail "npm is not on PATH, and the dependencies are not installed."
  held=0
  waited=0
  while :; do
    if mkdir "$LOCK" 2>/dev/null; then
      held=1
      break
    fi
    [ -f "$MARKER" ] && break
    # A lock older than five minutes belongs to a launcher that died: take it over.
    if [ "$waited" -ge 300 ]; then
      rmdir "$LOCK" 2>/dev/null || true
      waited=0
    fi
    sleep 1
    waited=$((waited + 1))
  done
  if [ "$held" -eq 1 ]; then
    trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT INT TERM
    if [ ! -f "$MARKER" ]; then
      # --ignore-scripts skips prepare, which needs the development dependencies to compile.
      (cd "$ROOT" && npm ci --omit=dev --ignore-scripts --no-audit --no-fund --loglevel=error >&2) ||
        fail "npm ci failed."
      : >"$MARKER"
    fi
    rmdir "$LOCK" 2>/dev/null || true
    trap - EXIT INT TERM
  fi
fi

exec node "$ROOT/vocabulary/api/mcp/index.ts" "$@"
