#!/usr/bin/env bash
# Print code=true when a change between two commits needs the skill check, the tests,
# and the typecheck, and code=false when every changed file is documentation.
# Documentation is docs/ and Markdown at the root, except AGENTS.md and CLAUDE.md,
# which the skill check reads. Usage: change-scope.sh <base> <head>
set -euo pipefail

base="${1:-}"
head="${2:-HEAD}"

# Without a base to compare, as on the first push of a branch, check everything.
if [ -z "$base" ] || [ -z "${base//0/}" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  echo "code=true"
  exit 0
fi

code=false
while IFS= read -r path; do
  case "$path" in
    AGENTS.md | CLAUDE.md) code=true ;;
    docs/*) ;;
    */*) code=true ;;
    *.md) ;;
    *) code=true ;;
  esac
done < <(git diff --name-only "$base" "$head")

echo "code=$code"
