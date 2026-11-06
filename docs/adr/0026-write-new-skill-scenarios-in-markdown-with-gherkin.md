---
locale: en
---

# Write new skill scenarios in Markdown with Gherkin

## Status

Accepted. It answers the evaluation asked in issue #743.

## Context

Each skill keeps its functional tests as Gherkin scenarios in `features/`, one file per functionality. There are 244 `.feature` files today. On GitHub and in the editor a `.feature` file is plain text: the feature, the rules and the examples get no heading, list or rendered table. Reading the scenarios of a skill asked for something closer to Markdown, and closer to a specification that a person reads before the skill is written.

Cucumber has a format called *Markdown with Gherkin* (`.feature.md`). The feature, the rule and each scenario are Markdown headings, the steps are list items, and the examples are Markdown tables.

The format was checked against how this repository writes scenarios, with the official parser `@cucumber/gherkin` and its `GherkinInMarkdownTokenMatcher`, on a scenario converted from a real skill:

| Item | Result |
| --- | --- |
| `Funcionalidade`, `Regra`, `Exemplo`, `Esquema do Cenário`, `Dado`, `E`, `Quando` and `Então` | Parsed, with the `pt` dialect |
| `# language: pt` on the first line | Not read as a language header. In Markdown it is a level-1 heading, so it becomes the feature name. The dialect has to be given to the parser |
| `Exemplos` table | Parsed only when the table is indented by two spaces. Without the indent, the outline produces no scenario and the parser raises no error |
| Headings and list items | Rendered as a document on GitHub |

Three options were considered:

1. **Keep `.feature`.** Nothing changes, and the scenarios stay hard to read.
2. **Convert every `.feature` now.** Every scenario becomes readable at once, at the cost of a large change in every skill.
3. **Write new scenarios in `.feature.md` and convert the old ones later.** New work gets the readable format now, and the conversion is planned on its own.

## Decision

New skill scenarios are written in Markdown with Gherkin, as `.feature.md` files in the `features/` folder of the skill. Existing `.feature` files stay until a separate migration converts them.

- A `.feature.md` file has no `# language:` line. The dialect comes from the `Idioma do Gherkin` parameter, which is `pt` in this repository.
- The feature is a level-1 heading, a rule a level-2 heading, and each scenario, outline and examples block a heading below its parent. Steps are list items.
- An `Exemplos` table is indented by two spaces.
- The skill checker accepts both `.feature` and `.feature.md`. It parses each `.feature.md` with the official Gherkin parser in the dialect of `Idioma do Gherkin`, and fails when an outline produces no scenario.
- The keyword rules stay the same in both formats, including a Given that starts with `Dado que`.
- The skills that write scenarios tell the agent to write `.feature.md` for every new scenario.

## Consequences

- New scenarios read as documents on GitHub, closer to a specification written before the skill.
- For a while a skill can hold both formats. The checker handles both, and the migration removes the old one.
- The language moves out of the file. A scenario read outside this repository needs the dialect from the project instructions.
- A table without its indent would silently drop scenarios. The checker is the guard, so it must ship before any skill writes `.feature.md`.
- The checker needs the official Gherkin parser, which runs on Node, already used in this repository.
