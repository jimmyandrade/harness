---
locale: en
---

# Vocabulary

API, command line, MCP server, and skills that read and write the brand glossary of the project that is open, and that write in that project's voice.

This folder holds the engine. The skills that use it, `definir-vocabulario`, `procurar-variacao-de-termo`, `redigir-com-tom-de-voz` and `perfilar-tom-de-voz`, are in `.agents/skills/` at the root of the repository. Each project keeps its own glossary, one UTF-8 JSON file per language in `.agents/glossary/`, named with a BCP 47 tag such as `pt-BR.json`. `HARNESS_GLOSSARY_DIR` points the server at another directory. The files are not a translation memory: a term keeps a state for the language of the text. What still differs between projects stays in that project's instructions.

Each term has one of five levels, from `forbidden` through `strongly_discouraged`, `discouraged`, and `allowed_with_care` to `allowed`, as `docs/adr/0010-rate-terms-on-five-levels.md` decides. The older `situationally_allowed` still reads as `allowed_with_care` until the project migrates its glossary with `docs/runbooks/migrate-glossary.md`, which also covers importing a glossary from another tool in one batch.

A term is read in any casing. A name whose casing is part of the spelling, such as `iPhone`, keeps `case_sensitive: true` on its row: the write keeps that casing as the key, and `lookup` and `exists` say when the submitted casing does not match, as `docs/adr/0009-mark-case-sensitive-terms.md` decides.

The engine lived in its own repository, jimmyandrade/vocabulary, from ADR 0010 until ADR 0015 brought it back here. That repository is archived, and its history is in the history of this one. The decisions are `docs/adr/0003-store-the-brand-glossary-as-json.md` and `docs/adr/0004-validate-the-api-with-zod.md`. The map of files is `ARCHITECTURE.md`. Setup for an agent host is `docs/runbooks/mcp-hosts.md`. The skill check uses the harness action pinned in `.github/workflows/skill-check.yml`.

## Use it

From the project that holds the glossary:

```bash
npm install --save-dev github:jimmyandrade/harness
```

To pin a release, add its tag: `github:jimmyandrade/harness#vMAJOR.MINOR.PATCH`. The releases are on the GitHub Releases page of this repository.

Check: `node node_modules/harness/vocabulary/dist/mcp/index.js < /dev/null && echo ok` prints `ok`.

The skills ship in the `core` plugin, which a business harness lists in its own marketplace at a release tag, as the root `README.md` explains. The plugin ships only the skills. The MCP server comes from the npm dependency, as `docs/runbooks/mcp-hosts.md` explains.

Add the skills for GitHub Copilot, or to a project without the plugin:

```bash
npx skills add jimmyandrade/harness
```

Check: `test -f .agents/skills/definir-vocabulario/SKILL.md && echo ok` prints `ok`.

## Work in this repository

```bash
npm ci
npx tsc --noEmit
npm run build
npm test
```

Check: every command exits 0. `npm ci` already runs `npm run build` through `prepare`, which writes `dist/` from `api/`. `dist/` is not committed, as `docs/adr/0007-build-on-install.md` decides.

## License

PolyForm Noncommercial 1.0.0, in `LICENSE.md` at the root of the repository. Commercial use needs a written license. See `COMMERCIAL.md` at the root.
