#!/bin/sh
# Write .agents/skills/README.md for the project in HARNESS_ROOT, or in the working directory.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd)"
VENV="${HARNESS_VENV:-$CORE/.venv}"
if [ -n "${HARNESS_ROOT:-}" ]; then
  cd "$HARNESS_ROOT"
fi
if [ ! -x "$VENV/bin/python" ]; then
  python3 -m venv "$VENV"
fi
if ! "$VENV/bin/python" -c "import yaml" >/dev/null 2>&1; then
  "$VENV/bin/pip" install -q -r "$CORE/.agents/scripts/check-skill/requirements.txt"
fi
exec "$VENV/bin/python" "$CORE/.agents/scripts/skill-graph/skill-graph.py" "$@"
