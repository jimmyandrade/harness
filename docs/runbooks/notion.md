---
locale: en
---

# Publish the skills in Notion

GitHub is the write source. On each push to the default branch, the sync action writes one Habilidades page per changed skill, including the core skills. Nobody edits those pages in Notion. Run this runbook from the root of the business repository, after `business-repository.md`, with `TAG` from its step 1.

Each step ends with a check.

## 1. Write the mapping

```bash
mkdir -p .agents/mappings
cp -n node_modules/harness/.agents/mappings/skill-page.notion.example.json .agents/mappings/skill-page.notion.json
```

Set `data_source_id` to the Habilidades data source of the workspace. Rename a property or a status option when the database uses another name. The status follows the version: below 0.1.0 is `draft`, from 0.1.0 with major 0 is `validation`, from 1 onward is `production`.

Check: every value under `properties` and `status_options` names a property or an option of that data source.

## 2. Give the integration access

Create a Notion integration, or reuse one, and share the Habilidades database with it. Store its token as the repository secret `NOTION_TOKEN`. The command asks for the value.

```bash
gh secret set NOTION_TOKEN
```

Check: `gh secret list` shows `NOTION_TOKEN`.

## 3. Copy the sync workflow

The `skill-pages` workflow checks the skills again and then syncs them, on each push to `main`. Change `main` when the default branch has another name.

```bash
cp -Rn node_modules/harness/examples/notion/. .
perl -pi -e "s/vX\.Y\.Z/$TAG/g" .github/workflows/skill-pages.yml
```

Check: after a push to `main` that changes one skill, the sync step log has one line, `create` or `update`, and the page shows the new version.
