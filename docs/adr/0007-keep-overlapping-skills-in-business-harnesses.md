---
locale: en
---

# Keep overlapping skills in business harnesses

## Status

Accepted

## Context

Two business harnesses can need the same kind of skill and still differ in parts of it. A calendar skill is the example that started this decision. Any business wants it to search before it creates an event, write the weekday next to each date, and name the time zone. But one business routes each event type to its own skills, reads times from its own canonical pages, and follows its own spelling and voice rules. The skill that exists today was written for one business and ties the calendar to that business's model.

Several of the skills it depends on could also be shared: classifying the event type, checking the canonical spelling of a name, writing in a voice whose guide each project provides, and protecting a person's time when scheduling. Each of them carries business rules today too.

ADR 0005 already keeps a skill in its business harness until it is audited. This ADR records what was evaluated for skills that are partly shared, and why none of it is adopted yet.

### Facts that shaped the options

- A Claude Code skill is one text. There is no inheritance between skills.
- Claude Code namespaces skills by plugin, so `core:<skill>` and `<business>:<skill>` can coexist. Cursor and Copilot have no namespace: a skill is named after its folder.
- Claude Code and the Copilot CLI read skills one level deep. Cursor reads nested folders. Each tool reads a different set of folders: Claude Code `.claude/skills`; Copilot `.github/skills`, `.claude/skills`, and `.agents/skills`; Cursor `.agents/skills` and `.cursor/skills`.
- A business Notion skills database has no namespace, and Notion cannot read this repository. The Notion sync runs in the business repository, where the core is installed.
- A composed text must stay under the body token limit set in `AGENTS.md`.

### Options considered

1. **Copy the core skill into the business harness.** Simple, but the copy drifts on every core release.
2. **Make the core skill generic and move business values into parameters.** This works when a business differs only in values, as in the core product news skill, which reads its sources, audience, and channel from the project instructions. It does not cover business behavior such as routing an event type to a business skill.
3. **Extension points with a business skill of the same name.** The core skill marks named extension points with default text. A business skill declares `metadata.extends: core:<name>`, fills the points, and appends items to the problems, examples, edge cases, and gotchas. A composer joins the two texts, the checker measures the composed body, and the skill graph draws an extends arrow. This was prototyped in jimmyandrade/harness#90, with these variants:
   - **3a. Join while the agent runs.** The extension sends the agent to the core skill. The agent must open both texts and merge them itself.
   - **3b. Commit the composed text.** The business writes only an extension file. A script generates its `SKILL.md` already composed, and the checker fails when it is stale. Every pull request that moves the core pin must regenerate it.
4. **Group skills in subfolders**, such as `.agents/skills/core/` and `.agents/skills/<business>/`. Only Cursor would find them.
5. **Point each tool at a second folder**, such as `.cursor/skills` and `.github/skills` for the business skills. This needs no script. But two skills with the same name reach every tool, and Copilot also reads `.claude/skills`, which can show the core skills twice.
6. **Generate one flat folder of per-skill links** from the core and the business packages, with an extension replacing the core skill of the same name. Every tool reads the same set. This needs a script after each install.

### Open problems

- **Automatic dispatch.** Calling `core:<skill>` or `<business>:<skill>` by name is unambiguous. A request such as "book a meeting" is matched by description, and both skills describe the same intent, so the agent can pick the core skill without anyone noticing. A sentence in the core skill that defers to an extension makes this less likely, but does not prevent it.
- **Tools without namespaces.** In Cursor, Copilot, and Notion, two skills with the same name cannot be told apart.
- **Size.** A core skill plus its extension can reach the body token limit. A long business skill may need to split before it moves.
- **Breaking changes.** Renaming or removing an extension point breaks every business that fills it.
- **Cost.** Moving a skill means auditing it and the skills it cites, as ADR 0005 requires. The calendar skill alone cites several.

## Decision

Skills that are partly shared stay business skills for now. Each business harness keeps its own version, written for its model, even when another business has a similar one. The core does not add extension points, `metadata.extends`, or a composer.

When a difference is only a value, prefer option 2: a generic core skill with a parameter that each project fills in its instructions.

jimmyandrade/harness#90 stays closed as a reference.

## Consequences

Similar skills can drift apart between businesses. A fix that helps every business is applied in each business harness by hand.

A business skill must not reuse the name of a core skill. The Notion sync already stops when a name exists in both.

Business skills reach Claude Code through the business plugin. Making them reach Cursor and Copilot in a consumer project is a separate decision.

Revisit this decision when one of these becomes true:

- three or more businesses keep a version of the same skill;
- the same fix is applied to two business copies more than once;
- Claude Code, Cursor, or Copilot add skill inheritance, a namespace that every tool honors, or a way to pick between two skills with the same name;
- a skill can be split so that the shared part stands alone, with no business behavior left to extend.

When it is revisited, start from option 3b and the open problems above.
