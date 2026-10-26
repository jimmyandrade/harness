---
locale: en
---

# Load the skills in Cursor

Cursor reads skills from `.agents/skills` and `.cursor/skills` of the open project, and follows symbolic links. It does not look inside `node_modules`, so the core skills need a link. Run this runbook from the root of the project, after `npm ci`.

Read `Instalação do harness` in the project instructions. `INSTALL.md` explains the choice. When the value is `global`, stop. The harness is the plugin already installed in the tool, and this repository does not receive the links below. When `Harness no repositório atual` is `não`, stop as well. That value does not mean the install is global. When the key is absent, the install is `repositório` and the steps below apply.

Each step ends with a check.

## 1. Choose the layout

| The project has | `.agents/skills` | `.cursor/skills` |
|---|---|---|
| Skills of its own | a directory with its skills | a link to `../node_modules/harness/.agents/skills` |
| Only the core skills | a link to `../node_modules/harness/.agents/skills` | absent |

Check: `test -d node_modules/harness/.agents/skills && echo ok` prints `ok`.

## 2. Create the link

A project with skills of its own:

```bash
mkdir -p .cursor
ln -s ../node_modules/harness/.agents/skills .cursor/skills
```

A project with only the core skills:

```bash
ln -s ../node_modules/harness/.agents/skills .agents/skills
```

Commit the link. It resolves on every machine after `npm ci`.

Check: `ls .cursor/skills/ .agents/skills/` lists the skills of both layers and no error.

## 3. Confirm in Cursor

Open the project in Cursor, then open Customize → Skills, or type `/` in the chat.

Check: the list shows the skills of the project and the core skills, such as `criar-commit`.

## 4. Optional: install the skills as Cursor plugins

A team can install the skills as plugins instead of links, from team marketplaces, as `docs/adr/0011-publish-the-plugin-to-codex-and-cursor-from-the-claude-code-manifests.md` decides. A business harness and this repository each have `.cursor-plugin/plugin.json`, whose `skills` points at `.agents/skills/`. A Cursor marketplace cannot list a plugin from another repository, so the team imports two marketplaces: the business repository and this one. The `core` plugin then follows the default branch of this repository, not the tag in `package.json`; keep the links of steps 1 to 3 when the project needs the pinned core.

Read the manifest of the business repository.

```bash
jq -r '.name, .skills' .cursor-plugin/plugin.json
```

Check: the output is the business name and `./.agents/skills/`.

The dashboard is [cursor.com/dashboard](https://cursor.com/dashboard). The account menu in the editor does not open it. An admin on a Teams or Enterprise plan opens Plugins & MCPs. Under Team Marketplaces, choose Add Marketplace, then Import from Repo, and import the business repository, then `https://github.com/jimmyandrade/harness`. A personal account shows Your Marketplaces and no Team Marketplaces section. When the account belongs to a team and the page still shows only Your Marketplaces, switch to that team in the dashboard header.

Check: Team Marketplaces lists both repositories.

Open the imported marketplace, then Marketplace Settings, then Plugin Repository, and turn on Enable Auto Refresh. The Cursor GitHub App must be installed on the repository and allowed to read it. A push to the default branch re-indexes the marketplace, at most once every 10 minutes, and the index keeps the latest commit. Refresh in that same section re-indexes once, without the app. Restart Cursor, or focus the window, so the client reads the new index. A Cloud Agent that is already running keeps the version it started with.

Check: after a push to the default branch and a re-index, Customize lists the skills of that commit. The manifest name is `core`. Cursor may show the marketplace name in front of it, such as `harness-core`.

Then remove the links of step 2 from the project, so each skill shows once.

Check: in Cursor, Customize lists the business plugin and `core`, and installing them shows the same skills as step 3.

## 5. Grok Bot does not load these skills

Grok Bot does not read `.agents/skills`, `.cursor/skills`, or the `core` plugin. Connect apps lists apps from the Cursor Marketplace. A skill a Bot saves belongs to that Bot. Get Grok Bot in the account menu opens the mobile app. It is not the dashboard, and Enable Auto Refresh is not there.

A team admin chooses which connected apps Grok Bot may use on the same Plugins & MCPs page. That choice does not install this repository.

Check: Connect apps does not list `core` from this repository. The skills in Cursor still come from steps 1 to 4.

## Do not

- Do not create a skill under a link. It would land in `node_modules` and disappear on the next install.
- Do not keep the links and the `core` plugin in the same project. Each core skill would show twice.
- Do not add this repository under Your Marketplaces to follow new commits. That list is personal, each row only offers Remove, and the install stays on the commit from when the repository was added. Adding it again installs that same commit.
