#!/bin/sh
# Temporary: wrap plain skill citations in backticks, for the project in HARNESS_ROOT or the working directory.
set -eu
CORE="$(CDPATH= cd -- "$(dirname "$0")/../../.." && pwd)"
if [ -n "${HARNESS_ROOT:-}" ]; then
  cd "$HARNESS_ROOT"
fi
exec python3 "$CORE/.agents/scripts/backtick-skill-citations/backtick-skill-citations.py" "$@"
