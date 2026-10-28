---
locale: en
---

# Make the work copy a global parameter

## Status

Accepted. It builds on ADR 0008, which defines the `Global` entry of the parameter tree.

## Context

Working in the person's own clone caused real problems: a skill edited a clone that was on another branch with pending changes. The fix is to work in a separate git worktree created from `main`.

Two skills already read a `Cópia de trabalho` parameter (`escrever-codigo` and `publicar-revisao-de-codigo`). Each had its own value in the person's settings, and four more skills that write to a repository did not read it at all. Repeating the value per skill means one of them is forgotten, and the choice is the same for every skill.

Two options were considered:

1. **Keep the default inside each skill and no `Global` value.** It works, but nothing changes the choice for a whole project in one place.
2. **Make it a `Global` parameter and let each skill cite the key.** One value changes the choice for every skill that writes.

## Decision

`Cópia de trabalho` is a `Global` parameter, with `worktree` as the project default in the `AGENTS.md` of this repository. A value is `worktree` or empty: `worktree` works in a new git worktree from `main`, empty works where the person already is. `worktree` is always the ideal and the default. `escrever-codigo` and `publicar-revisao-de-codigo` also accept `workspace`, an independent copy of the repository exclusive to the task, with the working root moved to it. It is the uncommon exception, a fallback for when a worktree does not work and working in the person's clone is not safe. The other skills do not know `workspace`, so it is set on those two skills and not in `Global`.

Every skill that creates or changes files in a repository declares the key in its parameter block and cites it in the step that changes the repository. The skill keeps `worktree` as its own default, because ADR 0008 says a skill without a default asks and stops. A value set on a single skill still wins over the `Global` one. The comment above the key in each skill says so: the value is `Global` and the skill can override it. `escrever-codigo` and `publicar-revisao-de-codigo`, which used to default to empty and relied on a personal setting, now default to `worktree` too.

## Consequences

- One `Global` value switches the choice for every skill that writes. A project that wants the clone sets it to empty once.
- A skill-level value equal to the default is redundant and is removed from the person's settings.
- The default is written twice: in the skill, as the fallback ADR 0008 requires, and in `Global`, as the switch. The two must stay equal.
- A new skill that writes to a repository must declare and cite the key. The checker does not enforce this yet.
