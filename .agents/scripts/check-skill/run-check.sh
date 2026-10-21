#!/bin/sh
# Run the skill checker for the project in HARNESS_ROOT, or in the working directory,
# then check that .agents/skills/README.md matches the skill graph, that the plugin manifests agree,
# that every pin of the core names the same tag, and that every model in .agents/assets/templates is valid.
# The virtual environment lives in this harness, so a project does not need its own.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd)"
SCRIPT="$CORE/.agents/scripts/check-skill"
GRAPH="$CORE/.agents/scripts/skill-graph/skill-graph.py"
MANIFESTS="$CORE/.agents/scripts/plugin-manifests/plugin-manifests.py"
PINS="$CORE/.agents/scripts/core-pins/core-pins.py"
MODELS="$CORE/.agents/scripts/check-models/check-models.py"
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

# The project instructions file, also named in the project-parameters module.
INSTRUCTIONS=AGENTS.md
status=0
only_skills=1
count=$#
for arg in "$@"; do
  case "$arg" in
    # The model check below reads every model, so a model is not passed to the skill checker.
    .agents/assets/templates/*.md) ;;
    */SKILL.md|"$INSTRUCTIONS"|*/"$INSTRUCTIONS") set -- "$@" "$arg" ;;
    *) only_skills=0 ;;
  esac
done
shift "$count"
if [ "$count" -gt 0 ] && [ "$#" -eq 0 ] && [ "$only_skills" -eq 1 ]; then
  : # Only models changed.
elif [ "$only_skills" -eq 1 ]; then
  "$VENV/bin/python" "$SCRIPT/check-skill.py" "$@" || status=1
else
  "$VENV/bin/python" "$SCRIPT/check-skill.py" || status=1
fi
"$VENV/bin/python" "$GRAPH" --check || status=1
"$VENV/bin/python" "$MANIFESTS" || status=1
"$VENV/bin/python" "$PINS" || status=1
"$VENV/bin/python" "$MODELS" || status=1
exit "$status"
