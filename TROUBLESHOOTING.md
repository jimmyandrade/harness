---
locale: en
---

# Troubleshooting

Failure diagnosis belongs here. A usage tip belongs in `INSTALL.md`. CI and actions belong in `CONTRIBUTING.md`.

## The checker asks for tiktoken

The message names `.agents/scripts/check-skill/requirements.txt`.

1. Run `.agents/scripts/check-skill/run-check.sh` from the project root.
2. The script creates `.venv` inside this harness when it is missing and installs the dependency. `HARNESS_VENV` points it at another directory.
3. Run it again. Exit code 0 closes the case.

## The folder icon hook cannot import yaml

The Lefthook `skill-folder-icon` command fails on checkout or commit with `ModuleNotFoundError: No module named 'yaml'`, raised from `project-parameters.py`.

1. The hook ran `set-folder-icon.py` with the system `python3`, which has no PyYAML. In a business harness, `lefthook.yml` still calls `python3 node_modules/harness/.agents/scripts/skill-folder-icon/set-folder-icon.py`.
2. Update the harness dependency, then replace that command, under `pre-commit` and `post-checkout`, with `node_modules/harness/.agents/scripts/skill-folder-icon/run-folder-icon.sh`, as in `examples/business-harness/lefthook.yml`. The script uses the virtual environment of the checker and installs PyYAML in it when it is missing. `HARNESS_VENV` points it at another directory.
3. When the message is `skill folder symbol is missing` instead, `node_modules/harness` is older than the version `package.json` pins, and reads a configuration file that no longer exists. Run `npm ci`.
4. Run `npx lefthook run post-checkout`. Exit code 0 closes the case.

## The checker or the sync reads the wrong project

The message names a skill, a config key, or a mapping that belongs to another repository.

1. A script reads the project in `HARNESS_ROOT`, or the working directory when it is unset.
2. Run it from the project root, or set `HARNESS_ROOT` to that root.

## A setting is missing or invalid

The message is `"<key>" is missing from metadata.parameters of AGENTS.md`, or a finding on `AGENTS.md` such as `"<key>" is not a parameter of any skill nor a script setting`.

1. A missing setting is absent from the project and from the core. Update the harness dependency or the action tag, or add the key under `metadata.parameters.Global` in the frontmatter of the project `AGENTS.md`.
2. An unknown key is usually misspelled. Copy the key from the skill's `Parâmetros de configuração` block, or from the core `AGENTS.md` for a script setting.

## The plugin manifests disagree

The checker prints a line that starts with `.cursor-plugin/plugin.json` or `.claude-plugin/marketplace.json`.

1. `.claude-plugin/` is the source of truth. A line on `.cursor-plugin/plugin.json` names the field and both values. Copy the value from `.claude-plugin/plugin.json`.
2. A line that names a plugin `source` Codex skips is usually the `core` entry of a marketplace copied before Codex support. Replace it with the `core` entry of `examples/business-harness/.claude-plugin/marketplace.json`, with `vX.Y.Z` replaced by the tag the other pins use.
3. Run `run-check.sh` again. Exit code 0 closes the case.

## The Renovate `core harness and vocabulary` pull request fails the check

In a business harness, the `check` job of a `core harness and vocabulary` pull request opened by Renovate fails, while `main` passed with the previous release. Renovate does not merge it by itself while the check fails.

1. Renovate only moves the pins: the workflows, `package.json`, `package-lock.json`, and `.claude-plugin/marketplace.json`. The workflow runs the checker of the new release, so a release that adds a rule fails on a file the rule now refuses, until that file changes too. The message names the file and the rule.
2. Read `CHANGELOG.md` of this repository from the pinned release up to the new one. A breaking change or a feature that changes a file the runbooks copy names what the business harness needs. Compare its files with `examples/business-harness/` at the new tag.
3. Commit the fix on the Renovate branch, or open a pull request from a `chore/` branch with the same pins and the fix. With the second, merge it and leave the Renovate pull request open: Renovate closes it on its next run, because the pins already match.
4. A failure after the fix is a single transition. Later Renovate pull requests only move the tags, and pass while no rule changes again. For example, the release that publishes the plugin to Codex refuses a `github` plugin source; once the `core` entry uses a `url` source, Renovate moves its `ref` with the second regex of `default.json`, as in "The plugin manifests disagree".
5. Run `run-check.sh` on the branch. Exit code 0, and a passing `check` job, close the case.

## Renovate opens no pull request after a release

The release exists, but the Dependency Dashboard of a business harness still lists the previous tag under the detected dependencies, after a run.

1. Renovate caches the list of tags for a while. A run in the first minutes after a release can miss the new tag.
2. Check the box at the end of the Dependency Dashboard issue to ask for another run, later. The `renovate.md` runbook, step 4, covers a run from the Mend portal.
3. To move the pins now, open the pull request by hand, as in the previous section, step 3.
4. The dashboard listing the new tag, or a `core harness and vocabulary` pull request, closes the case.
