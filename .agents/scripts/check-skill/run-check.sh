#!/bin/sh
# Run the skill checker for the project in HARNESS_ROOT, or in the working directory.
# The virtual environment lives in this harness, so a project does not need its own.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd)"
SCRIPT="$CORE/.agents/scripts/check-skill"
VENV="${HARNESS_VENV:-$CORE/.venv}"
if [ -n "${HARNESS_ROOT:-}" ]; then
  cd "$HARNESS_ROOT"
fi

if [ ! -x "$VENV/bin/python" ]; then
  python3 -m venv "$VENV"
fi
if ! "$VENV/bin/python" -c "import tiktoken" >/dev/null 2>&1; then
  "$VENV/bin/pip" install -q -r "$SCRIPT/requirements.txt"
fi

for arg in "$@"; do
  case "$arg" in
    */SKILL.md) ;;
    *) exec "$VENV/bin/python" "$SCRIPT/check-skill.py" ;;
  esac
done

exec "$VENV/bin/python" "$SCRIPT/check-skill.py" "$@"
