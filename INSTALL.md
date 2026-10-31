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
| Glossary | The language files, such as `pt-BR.json` | `Glossário no repositório atual` and `Pasta do glossário`, on `gravar-termos-no-vocabulario` | Empty. Ask once and create no file. `sim` keeps the files in the open repository. `não` keeps them only on the computer, in `Pasta do glossário` |
| Skills folder | The skills a repository chooses to store | None. A repository that stores skills keeps them in its skills folder. Core skills can also arrive through a link to the installed dependency, or through the tool's plugin | No assumed folder. The project says where its skills live |
| Harness install | The plugin, the dependency, the command line, and the MCP server | `Forma do harness`, `Papel do repositório atual`, `Instalação do harness`, and `Harness no repositório atual`, on `levantar-ambiente-do-repositorio` | Empty. Ask once. Do not assume the open repository, the tool install, or a business harness |

The current repository is the one open in the session. Each project sets its own value in its project instructions. A business that wants the same choice in several repositories writes that same value in each of them. This repository does not copy the value from another repository. An empty value asks once and does not choose for that project.

`Forma do harness` is the business choice. The table applies after the project sets the form, the role, and the install.

| Form | What the business has | Role `harness` | Role `projeto` |
|---|---|---|---|
| `repositório próprio` | One business harness repository | This repository is that harness. `Instalação do harness` is `repositório`. Run `docs/runbooks/business-repository.md` | `Instalação do harness` is `global`. This repository does not receive a dependency, a skills link, plugin files, or the MCP server. It uses the plugin already installed in the tool |
| `repositório existente` | No separate harness repository. The harness is installed in a repository that already exists, such as a site | Does not apply | `Instalação do harness` is `repositório`. The core skills serve the code workflow. The glossary may live in this repository, with `Glossário no repositório atual` at `sim`, when the copy should be pushed with the site |
| `próprio e repositórios` | A business harness repository, and the other repositories install that harness together with the core | This repository is the business harness. `Instalação do harness` is `repositório` | `Instalação do harness` is `repositório`. Install the business harness and the core. `global` is the wrong value for this role |

`Instalação do harness` is still `repositório` or `global` for the current repository. `global` uses the install already present in the tool and adds no second copy here. `Harness no repositório atual` set to `não` only blocks this repository. It does not choose a form, and it does not mean `global`. A combination that the table does not list asks once and stops.

A glossary may live inside a harness repository, inside the existing repository, or only on the computer. The glossary directory is not the harness, and the harness is not the skills folder.

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
npx tsc --noEmit
npm test
```

Check: every command exits 0.
