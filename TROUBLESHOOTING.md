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

## The checker or the sync reads the wrong project

The message names a skill, a config key, or a mapping that belongs to another repository.

1. A script reads the project in `HARNESS_ROOT`, or the working directory when it is unset.
2. Run it from the project root, or set `HARNESS_ROOT` to that root.

## A config key is missing

The message is `section.key is missing from .agents/config.yml`.

1. The key is missing from the project and from this harness.
2. Update the harness dependency or the action tag, or add the key to the project `.agents/config.yml`.

## The vocabulary MCP rejects a language

The message is `Unknown language.`

1. The server reads `.agents/glossary/<language>.json` in the open project, or `HARNESS_GLOSSARY_DIR`.
2. Add that file with `{}` as its content, or point `HARNESS_GLOSSARY_DIR` at the directory that has it.
