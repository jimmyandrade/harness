---
locale: en
---

# Keep the learning loop out of the skills

## Status

Accepted. It builds on ADR 0008, which defines the `Global` entry of the parameter tree, and ADR 0005, which splits the core from business harnesses.

## Context

After a skill runs, the agent may learn from the run: record a lesson in the skill that ran and open a pull request. The `Modo de aprendizado` parameter decides this, with `não`, `perguntar` or `sim`.

Today every skill carries that loop itself. 74 of the core skills declare `Modo de aprendizado` in their parameter block and end with the step "Ao terminar, siga `evoluir-habilidade` conforme `Modo de aprendizado`". `criar-habilidade` requires it of every new skill, and business skills follow the same rule.

This has three problems:

1. **The skills are not agnostic.** Learning from a run is a behavior of the agent, not of the task a skill describes. Repeating it in each skill writes the same rule 74 times, and a change to it touches every skill.
2. **The relationship graph is dominated by one node.** The skill graph has 81 edges into `evoluir-habilidade`. Every skill looks like it depends on it, which hides the real dependencies between skills.
3. **It blocks splitting the core into plugins.** Version 2.0 groups the skills into plugins by area, published in a marketplace. A plugin for one area should not depend on the plugin that holds the skill-authoring skills just to close its runs.

Two options were considered:

1. **Keep the step in each skill and only shorten it.** It keeps the 74 citations and the graph, and still couples every plugin to `evoluir-habilidade`.
2. **Move the loop to the project instructions.** The core `AGENTS.md` and each business harness `AGENTS.md` say what happens after any skill runs. The skills do not mention it.

## Decision

The learning loop lives in the project instructions, not in the skills.

- `Modo de aprendizado` is a `Global` parameter of the project instructions, with `perguntar` as the default in the core `AGENTS.md`. `sim` always learns from a skill run, `não` never learns, and `perguntar` asks once per session and keeps the answer for the rest of that session.
- The core `AGENTS.md` and the `agents-md` template for business harnesses say that, when any skill finishes, the agent follows `Modo de aprendizado` and, when it learns, follows `evoluir-habilidade`.
- A skill does not declare `Modo de aprendizado` and does not end with a step that cites `evoluir-habilidade` or `testar-habilidade`. A skill cites another skill only when its own task routes to it.
- The skills whose task is to write, test, review, describe or measure skills keep citing each other, because that is their task.
- `criar-habilidade` stops requiring the parameter and the last step, and the skill checker rejects them in a skill.

## Transition

Until the step leaves the skills, the skill graph hides `evoluir-habilidade`: the generator gives it no node and no arrows. This is a stopgap that prepares the 2.0 cut. Drawn, the skill added about 100 arrows, and the graph went past the 500-edge limit of Mermaid on GitHub.

Hiding it is not enough: the graph still has about 600 arrows. The limit is a secure setting of the renderer (`maxEdges`), so a diagram cannot raise it, and GitHub does not let a repository change it. Raising it is possible only in a renderer we control, such as a documentation site or the Mermaid command line.

We do not split the graph by group now. The groups should follow the plugin boundaries of 2.0, and drawing them before those boundaries are decided would bake in a cut that may change. Splitting the graph into one diagram per plugin is part of the later ADR that cuts the core into plugins.

## Consequences

- Changing how learning works is one edit in the project instructions instead of 74.
- The skill graph shows only the dependencies that belong to each task, which is the input for drawing the plugin boundaries of 2.0.
- A per-skill value of `Modo de aprendizado` in a project's parameters stops having effect. Only the `Global` value counts. This is a breaking change for projects that set it per skill, so it ships with 2.0 and a migration note.
- Business harnesses apply the same change to their own skills and `AGENTS.md`.
- How the core is cut into plugins, and whether each plugin has its own subagents, is decided in a later ADR.
