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
