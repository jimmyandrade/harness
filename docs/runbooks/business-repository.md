---
locale: en
---

# Set up a business repository

A business harness is its own repository. It keeps its skills, glossary, and mappings, and takes the checker, the skill graph, and the shared skills from this repository. Its layout is in `ARCHITECTURE.md`. Run this runbook once per business repository, from its root. The other runbooks start where this one ends.

This repository keeps `Instalação do harness` at `repositório`, the default. It is the harness. A product repository of the same business sets `global` when it must use the tool's install and not receive its own copy. `INSTALL.md` explains the glossary, the skills folder, and the harness install as three separate choices.

Each step ends with a check. Stop at the first check that fails and read `TROUBLESHOOTING.md`.

## 1. Read the core release

Every pin in the business repository uses the same tag.

```bash
TAG="$(gh release view --repo jimmyandrade/harness --json tagName --jq .tagName)"
echo "$TAG"
```

Check: the output is a tag such as `v1.2.3`.

## 2. Add the development dependency

```bash
npm install --save-dev "github:jimmyandrade/harness#$TAG"
npm approve-scripts --no-allow-scripts-pin harness
```

The second command lets the `prepare` script of the core build the vocabulary on every tag, so a later npm that blocks unreviewed install scripts still builds it. `TROUBLESHOOTING.md` explains the warning without it.

Check: `test -d node_modules/harness && echo ok` prints `ok`, and `npm approve-scripts --allow-scripts-pending` prints `No packages with unreviewed install scripts.`

## 3. Copy the example files and the instructions template

`examples/business-harness/` holds the files this runbook needs: `lefthook.yml`, the `skills` workflow, the plugin and marketplace in `.claude-plugin/`, which Claude Code and Codex read, the Cursor plugin in `.cursor-plugin/`, `.claude/settings.json`, and `renovate.json`. The project instructions start from the template the `definir-instrucoes-do-projeto` skill uses. Copy them without overwriting a file that already exists, then pin them to the tag.

```bash
cp -Rn node_modules/harness/examples/business-harness/. .
cp -n node_modules/harness/.agents/assets/templates/agents-md.md AGENTS.md
grep -rl 'vX\.Y\.Z' .github .claude-plugin | while read -r file; do perl -pi -e "s/vX\.Y\.Z/$TAG/g" "$file"; done
```

Replace `example` with the name of the business in `.claude-plugin/`, `.cursor-plugin/`, and `.claude/settings.json`. Keep the `name`, `description`, and `skills` of `.cursor-plugin/plugin.json` equal to those of `.claude-plugin/plugin.json`: the checker fails when they differ. A file that already existed was not copied; merge the example into it by hand.

Fill `AGENTS.md` with the `definir-instrucoes-do-projeto` skill: replace each placeholder between `<` and `>`, keep the Notion section word for word, and replace the placeholder entries of `metadata.parameters` in the frontmatter with `"Organização"` under `Global`, set to the name of the business. Keep `metadata.version` at `"0.1.0"` for a new business.

Check: `grep -rn 'vX\.Y\.Z\|example' .github .claude-plugin .cursor-plugin .claude` and `grep -n '<[^a/]' AGENTS.md` print nothing, and `grep -n '"Organização"' AGENTS.md` prints one line.

## 4. Write the skill graph and run the checker

```bash
node_modules/harness/.agents/scripts/skill-graph/run-graph.sh
node_modules/harness/.agents/scripts/check-skill/run-check.sh
npx lefthook install
```

Check: the checker exits 0, which includes the check that the plugin manifests agree, and `.agents/skills/README.md` exists.

## 5. Open the first pull request

Commit the files and open a pull request.

Check: the `check` job of the `skills` workflow passes, and the pull request gets a Skill check comment with the table of the skills it adds.

## Next

- `cursor.md` to load the skills in Cursor.
- `claude-code.md` to load the skills in Claude Code.
- `codex.md` to load the skills in Codex.
- `notion.md` to publish the skills as Notion pages.
- `renovate.md`, optional, to move the core pins on each release.
