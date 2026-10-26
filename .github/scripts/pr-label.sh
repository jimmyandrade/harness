#!/usr/bin/env bash
# Print the label a pull request gets from the Conventional Commits type of its title.
# A dependency update, with the deps scope, is dependencies whatever its type.
# Exits 1 when the type has no label, so a person picks one.
# Usage: pr-label.sh "<title>"
set -euo pipefail

title="${1:-}"
pattern='^([a-z]+)(\(([^)]*)\))?!?: '
if [[ ! "$title" =~ $pattern ]]; then
  echo "\"$title\" does not start with a Conventional Commits type." >&2
  exit 1
fi
type="${BASH_REMATCH[1]}"
scope="${BASH_REMATCH[3]}"

if [ "$scope" = "deps" ]; then
  echo "dependencies"
  exit 0
fi
case "$type" in
  feat) echo "enhancement" ;;
  fix) echo "bug" ;;
  docs) echo "documentation" ;;
  ci) echo "ci" ;;
  *)
    echo "No label fits the type $type. Add the label that describes the change." >&2
    exit 1
    ;;
esac
