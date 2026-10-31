#!/usr/bin/env bash
# Fail when another open pull request, from any branch, has the same title or the same head commit.
# Each duplicate becomes an error annotation that links it, so a person closes one of them.
# Usage: duplicate-pull-request.sh <owner/repo> <number> "<title>" <head-sha>
set -euo pipefail

repository="$1"
number="$2"
title="$3"
head="$4"

duplicates=$(gh pr list --repo "$repository" --state open --limit 1000 --json number,title,headRefOid,url |
  jq -r --argjson number "$number" --arg title "$title" --arg head "$head" '
    .[]
    | select(.number != $number)
    | if .title == $title then "#\(.number) has the same title: \(.url)"
      elif .headRefOid == $head then "#\(.number) has the same head commit: \(.url)"
      else empty end')

if [ -z "$duplicates" ]; then
  echo "No other open pull request has the same title or head commit."
  exit 0
fi
while IFS= read -r duplicate; do
  echo "::error title=Duplicate pull request::$duplicate. Close one of them and keep working on the other."
done <<< "$duplicates"
exit 1
