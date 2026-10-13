#!/bin/sh
# Write the macOS folder symbol onto each skill folder of the project in HARNESS_ROOT,
# or in the working directory. Elsewhere than macOS, exit 0 at once.
# The script reads the parameters with PyYAML, so it runs in the virtual environment of
# this harness, the same one the skill checker uses, instead of the system python3.
set -eu
[ "$(uname -s)" = Darwin ] || exit 0
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

exec "$VENV/bin/python" "$CORE/.agents/scripts/skill-folder-icon/set-folder-icon.py"
