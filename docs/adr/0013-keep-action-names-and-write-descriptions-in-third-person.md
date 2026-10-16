---
locale: en
---

# Keep action names and write descriptions in third person

## Status

Accepted

## Context

The skills of this harness follow the [skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) of the Claude platform. Two points of that guide differ from what the skills do today.

On names, the guide suggests the gerund form, such as `processing-pdfs`, and lists action names, such as `process-pdfs`, and noun phrases as acceptable alternatives. What it asks above all is one pattern across the collection. Every skill here, in the core and in the business harnesses, is named with a verb in the infinitive followed by the entity, such as `criar-habilidade` and `definir-tarefa`, as `criar-habilidade` requires. In Portuguese the infinitive reads as an instruction to the agent, while the gerund, such as `criando-habilidade`, reads as an ongoing action. Renaming is a breaking change for every skill: a new name, an alias, and a renamed Notion page in each business.

On descriptions, the guide requires the third person, because the description is injected into the system prompt and a mixed point of view hurts skill selection. A good description reads "Processes Excel files and generates reports"; "You can use this to process Excel files" is to avoid. Every description here starts with "Use essa habilidade sempre que", which addresses the agent.

## Decision

Skill names keep the action pattern: a verb in the infinitive, then the entity, in ASCII kebab-case, with the verbs `criar-habilidade` defines. This is one of the alternatives the guide accepts, and it keeps the collection consistent. No skill is renamed to the gerund.

Skill descriptions move to the third person. Each description says what the skill does, when it is used, and what it is not used for, without addressing the agent. `descrever-habilidade-ou-schema` and `criar-habilidade` change first, and then each skill changes its description with a patch version, as issue 206 tracks.

Where this harness departs from the guide, the skill that writes skills says so and points to this record, so a later author does not undo the choice.

## Consequences

New skills keep names like the existing ones, and nothing breaks for the businesses that use them.

The descriptions change one skill at a time. Until the last one changes, the collection mixes both styles, and the checker reports the descriptions that still address the agent.

The other gaps between the guide and this harness are tracked as issues 207 to 212, and each one changes the skills only when its own pull request lands.
