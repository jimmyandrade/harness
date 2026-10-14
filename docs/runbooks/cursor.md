---
locale: en
---

# Load the skills in Cursor

Cursor reads skills from `.agents/skills` and `.cursor/skills` of the open project, and follows symbolic links. It does not look inside `node_modules`, so the core skills need a link. Run this runbook from the root of the project, after `npm ci`.

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

An admin of the Cursor team opens Dashboard → Plugins & MCPs, chooses Add Marketplace → Import from Repo, and imports the business repository, then `https://github.com/jimmyandrade/harness`. Then remove the links of step 2 from the project, so each skill shows once.

Check: in Cursor, Customize lists the business plugin and `core`, and installing them shows the same skills as step 3.

## Do not

- Do not create a skill under a link. It would land in `node_modules` and disappear on the next install.
- Do not keep the links and the `core` plugin in the same project. Each core skill would show twice.
