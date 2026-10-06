---
locale: en
---

# Set up a business repository

A business harness is its own repository. It keeps its skills, glossary, and mappings, and takes the checker, the skill graph, and the shared skills from this repository. Its layout is in `ARCHITECTURE.md`. Run this runbook once per business repository, from its root. The other runbooks start where this one ends.

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
```

Check: `test -d node_modules/harness && echo ok` prints `ok`.

## 3. Copy the example files and the instructions template

`examples/business-harness/` holds the files this runbook needs: `.agents/mcp.json`, `lefthook.yml`, the `skills` workflow, the Claude Code plugin and marketplace, `.claude/settings.json`, and `renovate.json`. The project instructions start from the template the `definir-instrucoes-do-projeto` skill uses. Copy them without overwriting a file that already exists, then pin them to the tag.

```bash
cp -Rn node_modules/harness/examples/business-harness/. .
cp -n node_modules/harness/.agents/assets/templates/agents-md.md AGENTS.md
grep -rl 'vX\.Y\.Z' .github .claude-plugin | while read -r file; do perl -pi -e "s/vX\.Y\.Z/$TAG/g" "$file"; done
```

Replace `example` with the name of the business in `.claude-plugin/` and `.claude/settings.json`. A file that already existed was not copied; merge the example into it by hand.

Fill `AGENTS.md` with the `definir-instrucoes-do-projeto` skill: replace each placeholder between `<` and `>`, keep the Notion section word for word, and replace the placeholder entries of `metadata.parameters` in the frontmatter with `"Organização"` under `Global`, set to the name of the business. Keep `metadata.version` at `"0.1.0"` for a new business.

Check: `grep -rn 'vX\.Y\.Z\|example' .github .claude-plugin .claude` and `grep -n '<[^a/]' AGENTS.md` print nothing, and `grep -n '"Organização"' AGENTS.md` prints one line.

## 4. Write the skill graph and run the checker

```bash
node_modules/harness/.agents/scripts/skill-graph/run-graph.sh
node_modules/harness/.agents/scripts/check-skill/run-check.sh
npx lefthook install
```

Check: the checker exits 0, and `.agents/skills/README.md` exists.

## 5. Open the first pull request

Commit the files and open a pull request.

Check: the `check` job of the `skills` workflow passes, and the pull request gets a Skill check comment with the table of the skills it adds.

## Next

- `cursor.md` to load the skills in Cursor.
- `claude-code.md` to load the skills in Claude Code.
- `notion.md` to publish the skills as Notion pages.
- `mcp-hosts.md` to connect Claude Desktop, Windsurf, and Cline to the vocabulary server.
- `renovate.md`, optional, to move the core pins on each release.
