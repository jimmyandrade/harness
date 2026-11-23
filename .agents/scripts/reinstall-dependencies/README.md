# reinstall-dependencies

Reinstalls the dependencies when the lockfile changed between the previous and the current commit, so the hooks never run tests or a build against packages older than the lockfile.

```yaml
# lefthook.yml of a project that installs the core as the `harness` dependency
post-checkout:
  commands:
    reinstall-dependencies:
      run: node_modules/harness/.agents/scripts/reinstall-dependencies/reinstall-dependencies.sh post-checkout {1} {2} {3}
post-merge:
  commands:
    reinstall-dependencies:
      run: node_modules/harness/.agents/scripts/reinstall-dependencies/reinstall-dependencies.sh post-merge
```

- Input: the hook name. `post-checkout` also takes the three git hook arguments: the previous commit, the current commit and the branch flag. `post-merge` compares `ORIG_HEAD` with `HEAD`.
- Skips: a checkout of single files (flag `0`), the first checkout of a new worktree (previous commit all zeros), and a dependency folder that is a link, such as a worktree that shares the install of the main clone, where a reinstall would replace the link.
- Settings: `LOCKFILE` (default `package-lock.json`), `DEPENDENCIES_DIR` (default `node_modules`) and `REINSTALL_COMMAND` (default `npm ci --no-audit --no-fund`).
- Not covered: `git pull --rebase` runs `post-rewrite`, not `post-merge`.
- Exit code: 0 when nothing changed or the reinstall passed, the exit code of the reinstall when it fails, 2 for an unknown hook.
- Test: `python3 .agents/scripts/reinstall-dependencies/test_reinstall_dependencies.py`. Standard library and git only.
