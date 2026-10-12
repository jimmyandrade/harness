---
locale: en
---

# Move the vocabulary to its own repository

## Status

Accepted

## Context

This repository shipped the shared skills and the vocabulary API, CLI, and MCP server in one package and one Claude Code plugin. A business glossary stayed in that business, under `.agents/glossary/`. The engine did not depend on a skill, and no skill here cited the glossary.

The repository is meant to stay focused on skills. A vocabulary fix and a skill fix shared one pin and one plugin.

## Decision

The vocabulary API, CLI, MCP server, and the decisions about the glossary file and its validation live in jimmyandrade/vocabulary.

This repository keeps the skills, the checker, the skill graph, the Notion sync, and the `core` plugin. The plugin ships skills. It does not start the vocabulary server.

A project that wants the glossary engine installs jimmyandrade/vocabulary and follows that repository's host runbook. The glossary files stay in the project.

## Consequences

A business that loaded the vocabulary server from this package, from `node_modules/harness/api/mcp/index.ts`, or from the `core` plugin, points the host at jimmyandrade/vocabulary instead.

A fix to the vocabulary engine is a change in that repository. A fix to a skill stays here.

ADR 0005 still records why the core and the business harnesses split. The sentence that places the vocabulary API in the core is superseded by this decision.
