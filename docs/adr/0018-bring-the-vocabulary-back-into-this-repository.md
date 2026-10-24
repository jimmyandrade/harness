---
locale: en
---

# Bring the vocabulary back into this repository

## Status

Accepted. It replaces the former ADR 0010, which moved the vocabulary out and is deleted; its text stays in the git history.

## Context

The former ADR 0010 moved the vocabulary API, CLI, MCP server, and skills to jimmyandrade/vocabulary so this repository could stay focused on skills, and so a vocabulary fix and a skill fix would not share one pin and one plugin.

Since then the two repositories became tied in both directions:

- Core skills cite the vocabulary skills, and a project that uses the core writes text in a voice, so every project that uses this repository ends up using the vocabulary.
- The vocabulary repository depends on this one. Its `package.json`, its lockfile, and the pinned `check-skill` action must all name the same core version, and the skill check fails when they differ. Each core release needs a second pull request there, and a rule change here, such as the description style of ADR 0013, blocks new skills there until that pull request lands.
- A person who installs the core and the vocabulary installs and updates two plugins that need to stay compatible.

The reason for that move no longer outweighs that cost.

## Decision

The vocabulary API, CLI, MCP server, tests, and skills live in this repository again, with the history of jimmyandrade/vocabulary and its authorship preserved.

The `core` plugin ships the vocabulary skills and starts the vocabulary server. There is one plugin, one version, and one release line.

The glossary of a project stays in that project, one UTF-8 JSON file per language. This repository ships no glossary and no brand name.

The repository jimmyandrade/vocabulary was archived with a notice that points here, and deleted later. Its plugin is retired.

## Consequences

A person who installed the `vocabulary` plugin uninstalls it and updates the `core` plugin, which carries the skills and the server. The glossary files do not move.

A fix to the engine and a fix to a skill ship in one release and are tested together.

The vocabulary version line ends at the last release of the archived repository. The engine takes the version of the core.

Pull requests of this repository are squash merged, which drops the imported history. The import therefore lands with a merge commit, as a one-time exception, so every commit and author of the vocabulary stays visible in `git log` and `git blame`.

`AGENTS.md` and the repository documentation stop pointing to jimmyandrade/vocabulary, and the sentence of ADR 0005 about the vocabulary API in the core holds again.
