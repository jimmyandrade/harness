---
locale: en
---

# Publish the skills in Notion

GitHub is the write source. On each push to the default branch, the sync action writes one Habilidades page per changed skill, including the core skills. Nobody edits those pages in Notion. Run this runbook from the root of the business repository, after `business-repository.md`.

Each step ends with a check.

## 1. Write the mapping

Copy the template from this repository.

```bash
mkdir -p .agents/mappings
cp node_modules/harness/.agents/mappings/skill-page.notion.example.json .agents/mappings/skill-page.notion.json
```

Set `data_source_id` to the Habilidades data source of the workspace. Rename a property or a status option when the database uses another name. The status follows the version: below 0.1.0 is `draft`, from 0.1.0 with major 0 is `validation`, from 1 onward is `production`.

Check: every value under `properties` and `status_options` names a property or an option of that data source.

## 2. Give the integration access

Create a Notion integration, or reuse one, and share the Habilidades database with it. Store its token as the repository secret `NOTION_TOKEN`.

```bash
gh secret set NOTION_TOKEN
```

Check: `gh secret list` shows `NOTION_TOKEN`.

## 3. Add the sync job

Add this job to the workflow from `business-repository.md`, step 5.

```yaml
  sync:
    needs: check
    if: github.event_name == 'push' && github.ref == format('refs/heads/{0}', github.event.repository.default_branch)
    runs-on: ubuntu-26.04
    steps:
      - name: Check out the repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - name: Sync skill pages
        uses: jimmyandrade/harness/.github/actions/sync-skill-pages@vX.Y.Z
        with:
          notion-token: ${{ secrets.NOTION_TOKEN }}
          base: ${{ github.event.before }}
```

Check: after a push that changes one skill, the sync job log has one line, `create` or `update`, and the page shows the new version.
