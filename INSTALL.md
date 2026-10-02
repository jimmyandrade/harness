---
locale: en
---

# haRness

## Overview

This repository is the core layer of every harness. A business harness is a separate repository that uses it in three ways: as a Claude Code plugin, as GitHub Actions, and as a Node.js dependency for the local hook.

## Use it from a business harness

### 1. Lay out the business repository

The root has `AGENTS.md`, `.agents/config.yml`, and `.agents/skills/`. The mapping for the Notion skill pages is `.agents/mappings/skill-page.notion.json`. The glossary, when the business has one, is `.agents/glossary/<language>.json`.

`.agents/config.yml` lists only what differs from the `.agents/config.yml` of this repository. A missing key falls back to the core value.

```yaml
organization:
  name: example
```

Check: `test -f .agents/config.yml && test -d .agents/skills && echo ok` prints `ok`.

### 2. Write the mapping

Copy `.agents/mappings/skill-page.notion.example.json` from this repository to `.agents/mappings/skill-page.notion.json` in the business repository. Set `data_source_id` to the Habilidades data source of that workspace. Rename a property or a status option when the database uses another name.

Check: every key under `properties` names a property of that data source.

### 3. Call the actions

The Notion token is a repository secret named `NOTION_TOKEN`. The integration must have access to the Habilidades data source.

```yaml
name: skills

on:
  push:
  pull_request:

jobs:
  check:
    runs-on: ubuntu-26.04
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: jimmyandrade/harness/.github/actions/check-skill@v0.1.0
        with:
          base: ${{ github.event_name == 'pull_request' && github.event.pull_request.base.sha || github.event.before }}
          head: ${{ github.event_name == 'pull_request' && github.event.pull_request.head.sha || github.sha }}

  sync:
    needs: check
    if: github.event_name == 'push' && github.ref == format('refs/heads/{0}', github.event.repository.default_branch)
    runs-on: ubuntu-26.04
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: jimmyandrade/harness/.github/actions/sync-skill-pages@v0.1.0
        with:
          notion-token: ${{ secrets.NOTION_TOKEN }}
          base: ${{ github.event.before }}
```

Check: a push that changes one skill writes one line, `create` or `update`, in the sync job log.

### 4. Run the checker before each commit

Add this repository as a development dependency, pinned to a tag.

```bash
npm install --save-dev github:jimmyandrade/harness#v0.1.0
```

Point Lefthook at it.

```yaml
pre-commit:
  commands:
    skill-check:
      glob:
        - ".agents/skills/**/SKILL.md"
        - ".agents/config.yml"
      run: node_modules/harness/.agents/scripts/check-skill/run-check.sh {staged_files}
```

The same script fails when `.agents/skills/README.md` does not match the skill graph. Write it from the business root:

```bash
node_modules/harness/.agents/scripts/skill-graph/run-graph.sh
```

Check: `node_modules/harness/.agents/scripts/check-skill/run-check.sh` exits 0 from the business root.

### 5. Publish the plugins

The business repository has `.claude-plugin/marketplace.json`. It lists its own plugin and points at `harness-core` here, so one marketplace brings both.

```json
{
  "name": "example",
  "owner": { "name": "Example" },
  "plugins": [
    { "name": "example", "source": "." },
    { "name": "harness-core", "source": { "source": "github", "repo": "jimmyandrade/harness", "ref": "v0.1.0" } }
  ]
}
```

A person adds the marketplace once and installs both plugins.

```bash
claude plugin marketplace add example/harness
```

An organization can install them for every member through managed settings, with `extraKnownMarketplaces` and `enabledPlugins`.

Check: `/plugin` lists both plugins as installed.

### 6. Keep the core version current

The actions, the Node.js dependency, and the marketplace each pin a release of this repository. The Renovate preset in `default.json` moves the three pins in one pull request when a release exists. Extend it from `renovate.json` in the business repository.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>jimmyandrade/harness"]
}
```

That pull request changes a workflow and the package files, so the next sync on the default branch also publishes the core skills.

Check: the Dependency Dashboard issue of the business repository lists `harness core`.

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
