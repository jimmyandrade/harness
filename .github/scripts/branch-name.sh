#!/usr/bin/env bash
# Fail when a pull request branch is not <type>/<short-description> with a Conventional Commits type.
# A branch with the prefix of a coding agent gets a message that tells the agent how to fix its own instructions.
# Branches that Renovate, Dependabot, and Release Please create pass.
# BRANCH_TYPES, BLOCKED_BRANCH_PREFIXES, and ALLOWED_BRANCH_PREFIXES hold the lists, separated by spaces or commas.
# The check-branch-name action sets them, with the default lists in its inputs.
# Usage: branch-name.sh "<branch>"
set -euo pipefail

for variable in BRANCH_TYPES BLOCKED_BRANCH_PREFIXES ALLOWED_BRANCH_PREFIXES; do
  if [ -z "${!variable:-}" ]; then
    echo "::error title=Branch name::$variable is empty. Set it through the check-branch-name action, which has the default list."
    exit 1
  fi
done
read -ra types <<< "${BRANCH_TYPES//,/ }"
read -ra agent_prefixes <<< "${BLOCKED_BRANCH_PREFIXES//,/ }"
read -ra allowed_prefixes <<< "${ALLOWED_BRANCH_PREFIXES//,/ }"
type_pattern=$(IFS='|'; echo "${types[*]}")
type_list="${types[*]}"
type_list="${type_list// /, }"
name_pattern="^($type_pattern)/[a-z0-9]+([.-][a-z0-9]+)*$"

branch="${1:-}"
for prefix in "${allowed_prefixes[@]}"; do
  [[ "$branch" == "$prefix"* ]] && exit 0
done
[[ "$branch" =~ $name_pattern ]] && exit 0

for prefix in "${agent_prefixes[@]}"; do
  if [[ "$branch" == "$prefix/"* ]]; then
    echo "::error title=Branch name::$branch has the prefix of a coding agent, and branches that a coding agent names after its tool are not accepted. Rename it to type/short-description, with one of the Conventional Commits types accepted here: $type_list. Then check whether your instructions already have this rule, to use that type as the branch prefix, and whether you followed it: add the rule when it is missing, or reinforce it when you did not follow it. Always open and update pull requests with the criar-pull-request skill of jimmyandrade/harness. If this branch already has a pull request, rename it with atualizar-branch-do-pull-request, which closes the old pull request."
    exit 1
  fi
done
echo "::error title=Branch name::$branch is not type/short-description. Rename it before the first push."
exit 1
