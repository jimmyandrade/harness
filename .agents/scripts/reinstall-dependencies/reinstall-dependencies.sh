#!/bin/sh
# Reinstall the dependencies when the lockfile changed between the previous and the
# current commit, so tests and builds never run against packages older than the lockfile.
# Lefthook calls it from post-checkout, with the three git hook arguments, and from post-merge.
#   reinstall-dependencies.sh post-checkout <previous> <current> <branch flag>
#   reinstall-dependencies.sh post-merge
# It skips a checkout of single files, the first checkout of a new worktree, and a
# dependency folder that is a link, such as a worktree that shares the main clone's install.
# LOCKFILE, DEPENDENCIES_DIR and REINSTALL_COMMAND replace the npm defaults.
set -eu

LOCKFILE="${LOCKFILE:-package-lock.json}"
DEPENDENCIES_DIR="${DEPENDENCIES_DIR:-node_modules}"
REINSTALL_COMMAND="${REINSTALL_COMMAND:-npm ci --no-audit --no-fund}"

hook="${1:-}"
case "$hook" in
  post-checkout)
    previous="${2:-}"
    current="${3:-}"
    [ "${4:-}" = 1 ] || exit 0
    ;;
  post-merge)
    previous="$(git rev-parse -q --verify ORIG_HEAD || true)"
    current="$(git rev-parse HEAD)"
    ;;
  *)
    echo "usage: $0 post-checkout <previous> <current> <flag> | post-merge" >&2
    exit 2
    ;;
esac

[ -n "$previous" ] && [ -n "$current" ] || exit 0
[ "$previous" != "$current" ] || exit 0
case "$previous" in
  *[!0]*) ;;
  *) exit 0 ;;
esac
[ ! -L "$DEPENDENCIES_DIR" ] || exit 0

if git diff --quiet "$previous" "$current" -- "$LOCKFILE"; then
  exit 0
fi

echo "$LOCKFILE changed: $REINSTALL_COMMAND"
sh -c "$REINSTALL_COMMAND"
