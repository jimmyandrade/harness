#!/bin/sh
# Run the skill checker for the project in HARNESS_ROOT, or in the working directory,
# then check that .agents/skills/README.md matches the skill graph.
# The virtual environment lives in this harness, so a project does not need its own.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd)"
SCRIPT="$CORE/.agents/scripts/check-skill"
GRAPH="$CORE/.agents/scripts/skill-graph/skill-graph.py"
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

status=0
only_skills=1
for arg in "$@"; do
  case "$arg" in
    */SKILL.md|AGENTS.md|*/AGENTS.md) ;;
    *) only_skills=0 ;;
  esac
done
if [ "$only_skills" -eq 1 ]; then
  "$VENV/bin/python" "$SCRIPT/check-skill.py" "$@" || status=1
else
  "$VENV/bin/python" "$SCRIPT/check-skill.py" || status=1
fi
"$VENV/bin/python" "$GRAPH" --check || status=1
exit "$status"
