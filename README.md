---
locale: en
---

# Vocabulary

API, command line, and MCP server that read and write the brand glossary of the project that is open.

This repository holds the engine. Each project keeps its own glossary, one UTF-8 JSON file per language in `.agents/glossary/`, named with a BCP 47 tag such as `pt-BR.json`. `HARNESS_GLOSSARY_DIR` points the server at another directory. The files are not a translation memory: a term keeps a state for the language of the text.

The engine moved out of [jimmyandrade/harness](https://github.com/jimmyandrade/harness) so that repository can stay focused on skills. The decisions are `docs/adr/0003-store-the-brand-glossary-as-json.md` and `docs/adr/0004-validate-the-api-with-zod.md`. The map of files is `ARCHITECTURE.md`. Setup for an agent host is `docs/runbooks/mcp-hosts.md`.

## Use it

From the project that holds the glossary:

```bash
npm install --save-dev github:jimmyandrade/vocabulary
```

Check: `test -f node_modules/vocabulary/api/mcp/index.ts && echo ok` prints `ok`.

## Work in this repository

```bash
npm ci
npx tsc --noEmit
npm test
```

Check: both commands exit 0.

## License

PolyForm Noncommercial 1.0.0, in `LICENSE.md`. Commercial use needs a written license. See `COMMERCIAL.md`.
