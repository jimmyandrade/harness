---
locale: en
---

# Set up a business repository

A business harness is its own repository. It keeps its skills, its glossary, and its mappings, and takes the checker, the skill graph, and the shared skills from this repository. Run this runbook once per business repository, from its root. The other runbooks start where this one ends.

Each step ends with a check. Stop at the first check that fails and read `TROUBLESHOOTING.md` of this repository.

## 1. Lay out the repository

The root has `AGENTS.md`, `.agents/config.yml`, and `.agents/skills/`. The glossary, when the business has one, is `.agents/glossary/<language>.json`.

`.agents/config.yml` lists only what differs from the `.agents/config.yml` of this repository. A missing key falls back to the core value.

```yaml
organization:
  name: example
```

Check:

```bash
test -f AGENTS.md && test -f .agents/config.yml && test -d .agents/skills && echo ok
```

The output is `ok`.

## 2. Pin the core release

Every pin in the business repository uses the same tag. Read the latest one.

```bash
gh release view --repo jimmyandrade/harness --json tagName --jq .tagName
```

The runbooks write it as `vX.Y.Z`. Replace it with that tag everywhere.

Check: the command prints a tag such as `v1.2.3`.

## 3. Add the development dependency

```bash
npm install --save-dev github:jimmyandrade/harness#vX.Y.Z
```

Check: `test -d node_modules/harness && echo ok` prints `ok`.

## 4. Run the checker before each commit

Point Lefthook at the checker.

```yaml
pre-commit:
  commands:
    skill-check:
      glob:
        - ".agents/skills/**/SKILL.md"
        - ".agents/config.yml"
      run: node_modules/harness/.agents/scripts/check-skill/run-check.sh {staged_files}
```

The checker also fails when `.agents/skills/README.md` does not match the skill graph. Write the graph:

```bash
node_modules/harness/.agents/scripts/skill-graph/run-graph.sh
```

Check: `node_modules/harness/.agents/scripts/check-skill/run-check.sh` exits 0.

## 5. Check skills in CI

Add the check job to a workflow, for example `.github/workflows/skills.yml`. The Notion runbook adds the sync job to the same file.

```yaml
name: skills

on:
  push:
  pull_request:

jobs:
  check:
    runs-on: ubuntu-26.04
    steps:
      - name: Check out the repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - name: Check skills
        uses: jimmyandrade/harness/.github/actions/check-skill@vX.Y.Z
        with:
          base: ${{ github.event_name == 'pull_request' && github.event.pull_request.base.sha || github.event.before }}
          head: ${{ github.event_name == 'pull_request' && github.event.pull_request.head.sha || github.sha }}
```

Check: the `check` job passes on a pull request.

## 6. Publish the marketplace

`.claude-plugin/marketplace.json` lists the business plugin and points at `harness-core` here, so one marketplace brings both.

```json
{
  "name": "example",
  "owner": { "name": "Example" },
  "plugins": [
    { "name": "example", "source": "." },
    { "name": "harness-core", "source": { "source": "github", "repo": "jimmyandrade/harness", "ref": "vX.Y.Z" } }
  ]
}
```

Check: `jq -r '.plugins[].name' .claude-plugin/marketplace.json` prints the business plugin and `harness-core`.

## 7. Keep the core version current

The workflow, the development dependency, and the marketplace each pin a release. The Renovate preset in `default.json` of this repository moves the pins in one pull request. Extend it from `renovate.json`.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>jimmyandrade/harness"]
}
```

Check: the Dependency Dashboard issue of the business repository lists `harness core`.

## Next

- `cursor.md` to load the skills in Cursor.
- `claude-code.md` to load the skills in Claude Code.
- `notion.md` to publish the skills as Notion pages.
