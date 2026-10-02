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

## Do not

- Do not create a skill under a link. It would land in `node_modules` and disappear on the next install.
