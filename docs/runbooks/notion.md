---
locale: en
---

# Publish the skills in Notion

GitHub is the write source. On each push to the default branch, the sync action writes one page per changed skill, including the core skills, into the skills database of the workspace. Nobody edits those pages in Notion. The database can have any name; businesses in Brazil often call it Habilidades. Run this runbook from the root of the business repository, after `business-repository.md`, with `TAG` from its step 1.

Each step ends with a check.

## 1. Write the mapping

```bash
mkdir -p .agents/mappings
cp -n node_modules/harness/.agents/mappings/skill-page.notion.example.json .agents/mappings/skill-page.notion.json
```

Set `data_source_id` to the data source of the skills database. Rename a property or a status option when the database uses another name. The status follows the version: below 0.1.0 is `draft`, from 0.1.0 with major 0 is `validation`, from 1 onward is `production`.

Check: every value under `properties` and `status_options` names a property or an option of that data source.

## 2. Create a connection for the sync

Create a Notion connection used only by the sync. Do not reuse one that a website, an automation, or a person also uses: a leaked token then reaches only the skills database, the token can be rotated alone, and page history names the sync as the editor.

In the Notion integrations page (notion.so/profile/integrations), create a connection in the workspace of the skills database, with the API token method (an internal integration), not OAuth. Name it after the harness, since the name shows as the editor of each page.

| Capability | Value |
|---|---|
| Read content | on |
| Update content | on |
| Insert content | on |
| Read comments, insert comments | off |
| User information | none |
| Agent access | off |

The sync queries the data source, creates pages, and updates them. It never deletes a page and never reads people, comments, or other pages.

In the access tab of the connection, select only the skills database, not the page that contains it, which would grant everything under it. If another connection had access to the skills database, remove it there.

Check: the access tab of the connection lists the skills database and nothing else.

## 3. Store the token

Store the token of the connection as the repository secret `NOTION_TOKEN`. The command asks for the value.

```bash
gh secret set NOTION_TOKEN
```

Check: `gh secret list` shows `NOTION_TOKEN`.

## 4. Copy the sync workflow

The `skill-pages` workflow checks the skills again and then syncs them, on each push to `main`. Change `main` when the default branch has another name.

```bash
cp -Rn node_modules/harness/examples/notion/. .
perl -pi -e "s/vX\.Y\.Z/$TAG/g" .github/workflows/skill-pages.yml
```

Check: after a push to `main` that changes one skill, the sync step log has one line, `create` or `update`, and the page shows the new version. An `object_not_found` error that asks to share the data source with the integration means the connection of step 2 has no access to the skills database.
