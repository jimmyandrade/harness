---
locale: en
---

# haRness

Shared agent skills, skill checks, Notion skill sync, and the vocabulary API and MCP, for any project.

This repository is the core layer. A business keeps its own harness repository with its own skills, schemas, mappings, glossary, and output styles, and uses this one for everything they share.

| Layer | Repository | Holds |
| --- | --- | --- |
| Core | `jimmyandrade/harness` (public) | Skills that work for any business, the checker, the Notion sync, the vocabulary API and MCP |
| Business | one private repository per business | Business skills, data source schemas and mappings, the glossary, output styles |

A skill starts in a business harness. It moves here once it carries no company name, no business rule, and no workspace or database name.

Start with `INSTALL.md`. Features are in `FEATURES.md`.

## License

PolyForm Noncommercial 1.0.0, in `LICENSE.md`. Commercial use needs a written license. See `COMMERCIAL.md`.
