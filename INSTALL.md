---
locale: en
---

# haRness

## Overview

This repository is the core layer of every harness. A business harness is a separate repository that uses it in three ways: as a Claude Code plugin, as GitHub Actions, and as a Node.js dependency for the local hook.

## Runbooks

Each runbook is a list of steps with a command and a check, written for an agent to run and a person to follow. Run them in this order. Business repositories link here instead of copying the steps, and change their own `INSTALL.md` only when the way of installing changes.

| Runbook | Run it | It sets up |
|---|---|---|
| [`docs/runbooks/business-repository.md`](docs/runbooks/business-repository.md) | Once per business repository | Layout, core pin, checker, CI check, marketplace, Renovate |
| [`docs/runbooks/cursor.md`](docs/runbooks/cursor.md) | Once per project | The links Cursor follows to the project and core skills |
| [`docs/runbooks/claude-code.md`](docs/runbooks/claude-code.md) | Once per project, and the install step once per machine | The project skills link and the `harness-core` plugin |
| [`docs/runbooks/notion.md`](docs/runbooks/notion.md) | Once per business repository | The mapping, the token, and the sync job |

## Work in this repository

From the root, run the checker and the tests.

```bash
.agents/scripts/check-skill/run-check.sh
npm ci
npm test
```

Check: both commands exit 0.

## Vocabulary MCP

The `harness-core` plugin starts the `vocabulary` server. It reads the glossary of the project that is open, in `.agents/glossary/`. `HARNESS_GLOSSARY_DIR` points it at another directory. Inside this repository, `.mcp.json` starts the same server from the source tree.
