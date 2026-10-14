---
locale: en
---

# Vocabulary

API, command line, MCP server, and skills that read and write the brand glossary of the project that is open, and that write in that project's voice.

This repository holds the engine and the two skills, `definir-vocabulario` and `redigir-com-tom-de-voz`. Each project keeps its own glossary, one UTF-8 JSON file per language in `.agents/glossary/`, named with a BCP 47 tag such as `pt-BR.json`. `HARNESS_GLOSSARY_DIR` points the server at another directory. The files are not a translation memory: a term keeps a state for the language of the text. What still differs between projects stays in that project's instructions.

The engine moved out of [jimmyandrade/harness](https://github.com/jimmyandrade/harness) so that repository can stay focused on the other skills. The decisions are `docs/adr/0003-store-the-brand-glossary-as-json.md` and `docs/adr/0004-validate-the-api-with-zod.md`. The map of files is `ARCHITECTURE.md`. Setup for an agent host is `docs/runbooks/mcp-hosts.md`. The skill check uses the harness action pinned in `.github/workflows/skill-check.yml`.

## Use it

From the project that holds the glossary:

```bash
npm install --save-dev github:jimmyandrade/vocabulary
```

To pin a release, add its tag: `github:jimmyandrade/vocabulary#vMAJOR.MINOR.PATCH`. The releases are on the GitHub Releases page of this repository, and `CONTRIBUTING.md` explains how they are made.

Check: `node node_modules/vocabulary/dist/mcp/index.js < /dev/null && echo ok` prints `ok`.

Add the skills for Cursor, Codex, or GitHub Copilot:

```bash
npx skills add jimmyandrade/vocabulary
```

Check: `test -f .agents/skills/definir-vocabulario/SKILL.md && echo ok` prints `ok`.

## Work in this repository

```bash
npm ci
npx tsc --noEmit
npm run build
npm test
```

Check: every command exits 0, and `git status --porcelain dist` prints nothing after you commit. `npm run build` writes `dist/` from `api/`. Commit `dist/` with the source change, as `docs/adr/0006-ship-compiled-javascript.md` decides.

## License

PolyForm Noncommercial 1.0.0, in `LICENSE.md`. Commercial use needs a written license. See `COMMERCIAL.md`.
