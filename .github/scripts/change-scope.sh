#!/usr/bin/env bash
# Print the scope of a change between two commits, as GitHub Actions outputs.
# code=false when every changed file is documentation, which needs no check at all.
# node=false when every changed file is documentation or the text of a skill
# (SKILL.md, evals/, features/, and the generated README.md and FEATURES.md of
# the skills), which the Node.js tests and the typecheck never read.
# Documentation is docs/ and Markdown at the root, except AGENTS.md and CLAUDE.md,
# which the skill check reads. Usage: change-scope.sh <base> <head>
set -euo pipefail

base="${1:-}"
head="${2:-HEAD}"

# Without a base to compare, as on the first push of a branch, check everything.
if [ -z "$base" ] || [ -z "${base//0/}" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  echo "code=true"
  echo "node=true"
  exit 0
fi

code=false
node=false
while IFS= read -r path; do
  case "$path" in
    AGENTS.md | CLAUDE.md) code=true node=true ;;
    docs/*) ;;
    .agents/skills/README.md | .agents/skills/FEATURES.md) code=true ;;
    .agents/skills/*/SKILL.md | .agents/skills/*/evals/* | .agents/skills/*/features/*) code=true ;;
    */*) code=true node=true ;;
    *.md) ;;
    *) code=true node=true ;;
  esac
done < <(git diff --name-only "$base" "$head")

echo "code=$code"
echo "node=$node"
