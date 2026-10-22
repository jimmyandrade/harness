---
locale: en
description: Use these instructions for any task in this repository, including its skills. Do not use them to store a brand glossary or a brand rule.
metadata:
  version: "0.2.0"
  parameters:
    "Global":
      "Organização": "jimmyandrade"
---

# Agent instructions

## Scope

- This repository is the vocabulary kit: the API, the command line, the MCP server, and the skills that register glossary terms and write in the voice of the project that is open.
- The glossary stays in that project, one UTF-8 JSON file per language. This repository ships no glossary and no brand name.
- A skill reads what differs between projects from that project's instructions.

## Git

- Every change lands through a pull request. Do not push to `main`.
- Name every branch `type/short-description`, with a Conventional Commits type from `CONTRIBUTING.md` and an ASCII kebab-case description, such as `feat/build-on-install`. A branch a tool created with another prefix, such as `claude/` or `cursor/`, is renamed before the first push. Renaming a branch that already has a pull request closes that pull request, so open a new one from the renamed branch with the same title and body, and link it from the old one.
