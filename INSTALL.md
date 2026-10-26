---
locale: en
---

# haRness

## Overview

This repository is the core layer of every harness. A business harness is a separate repository that uses it in three ways: as a plugin for Claude Code, Codex, and Cursor, as GitHub Actions, and as a Node.js dependency for the local hook.

## Where the install lives

Three choices stay separate. Mixing them puts files in the wrong place.

| Choice | What it is | Parameter | Default |
|---|---|---|---|
| Glossary | The language files, such as `pt-BR.json` | `Glossário no repositório atual` and `Pasta do glossário`, on `gravar-termos-no-vocabulario` | `sim`, so the files live in the open repository and can be pushed. `não` keeps them only on the computer, in `Pasta do glossário` |
| Skills folder | The skills a repository chooses to store | None. A repository that stores skills keeps them in its skills folder. Core skills can also arrive through a link to the installed dependency, or through the tool's plugin | The repository's own folder, or the core install it already uses |
| Harness install | The plugin, the dependency, the command line, and the MCP server | `Instalação do harness` and `Harness no repositório atual`, on `levantar-ambiente-do-repositorio` | `repositório` and `sim` |

The current repository is the one open in the session. Each project sets its own value in its project instructions. A business that wants the same choice in several repositories writes that same value in each of them. This repository does not copy the value from another repository.

`Instalação do harness` is `repositório` or `global`.

- `repositório` allows the install in the current repository. Follow the runbook of the tool. `Harness no repositório atual` set to `não` blocks that install here and does not select a global one. Ask once where the harness for this work is, and stop.
- `global` means the business uses the single install already present in the tool. Do not add the dependency, a skills link, plugin files, or the MCP server to the current repository. `Harness no repositório atual` set to `sim` does not add a second copy.

The business harness repository keeps the default. That repository is the harness, so `docs/runbooks/business-repository.md` still applies to it. A product repository of the same business sets `global` when it must not receive its own copy.

A glossary may live inside a harness repository. The glossary directory is not the harness, and the harness is not the skills folder.

## Runbooks

Each runbook is a list of steps with a command and a check, written for an agent to run and a person to follow. Run them in this order. Business repositories link here instead of copying the steps, and change their own `INSTALL.md` only when the way of installing changes.

| Runbook | Run it | It sets up |
|---|---|---|
| [`docs/runbooks/business-repository.md`](docs/runbooks/business-repository.md) | Once per business repository | Layout, core pin, checker, CI check, marketplace |
| [`docs/runbooks/cursor.md`](docs/runbooks/cursor.md) | Once per project | The links Cursor follows to the project and core skills, or the Cursor team plugins. Grok Bot does not load them |
| [`docs/runbooks/claude-code.md`](docs/runbooks/claude-code.md) | Once per project, and the install step once per machine | The project skills link and the `core` plugin |
| [`docs/runbooks/codex.md`](docs/runbooks/codex.md) | Once per machine and project | The marketplace and the plugins in Codex |
| [`docs/runbooks/notion.md`](docs/runbooks/notion.md) | Once per business repository | The mapping, a connection used only by the sync, the token, and the sync job |
| [`docs/runbooks/renovate.md`](docs/runbooks/renovate.md) | Once per repository, optional | The Renovate preset, app, and portal settings that move the core pins on each release |

## Work in this repository

From the root, run the checker and the tests.

```bash
.agents/scripts/check-skill/run-check.sh
npm ci
npm test
```

Check: both commands exit 0.
