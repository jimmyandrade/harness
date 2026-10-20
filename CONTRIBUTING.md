---
locale: en
---

# Contributing

## Commits

Subjects follow [Conventional Commits](https://www.conventionalcommits.org/): `type: description`, in English. Release Please reads them to pick the next version and write `CHANGELOG.md`.

| Type | Use |
| --- | --- |
| `feat` | A feature a person or a project uses |
| `fix` | A defect |
| `docs` | Documentation only |
| `refactor` | A behavior-preserving restructure |
| `perf` | A change that makes something faster or lighter, with no other behavior change |
| `test` | Tests only |
| `chore` | Upkeep that is none of the above |
| `ci` | The workflows under `.github/workflows/` |

Branches are named `type/short-description`, with one of these types and an ASCII kebab-case description, such as `fix/mcp-path`. A branch a tool created with another prefix, such as `claude/`, is renamed before the first push. CI fails a pull request from a branch outside that pattern.

Every change lands through a pull request. Do not push to `main`.

## CI

`.github/workflows/ci.yml` runs on every pull request and on every push to `main`, on `ubuntu-26.04`. On a pull request it first checks that the branch is `type/short-description`, skipping Renovate, Dependabot, and Release Please branches. Then it typechecks and runs `npm test`. `npm ci` builds `dist/` through `prepare`, and one test installs the commit from git and starts the MCP server from that copy. `.github/workflows/skill-check.yml` checks the skills with the harness action when a skill or `AGENTS.md` changes.

Every step in a workflow has a `name`: a short imperative phrase in English, such as `Install dependencies`.

## Hooks

`lefthook.yml` runs the skill checker of the core harness on `git commit` when a staged file is a `SKILL.md` under `.agents/skills/` or `AGENTS.md`. A skill over a limit, such as the body token limit, fails the commit before it reaches `skill-check.yml`. The checker comes from the `harness` dev dependency, pinned to the same tag as the action in `skill-check.yml`. A change to one tag changes the other in the same commit, so the local and CI limits agree.

`npm ci` installs the hook through the `postinstall` of `lefthook`, allowed in `allowScripts` of `package.json`. With install scripts off, run `npx lefthook install` once. On the first run the checker creates a Python virtual environment in `node_modules/harness/.venv` and installs `tiktoken` into it, so it needs `python3` and network access once.

## Releases

A release is a tag `vMAJOR.MINOR.PATCH` and a GitHub Release. Business harnesses pin the npm dependency to that full tag, as in `github:jimmyandrade/vocabulary#vMAJOR.MINOR.PATCH`.

Release Please owns the version. `.github/workflows/release-please.yml` runs on every push to `main` and keeps one release pull request open. That pull request bumps `version` in `package.json`, `package-lock.json`, `.claude-plugin/plugin.json`, and `.cursor-plugin/plugin.json`, and writes `CHANGELOG.md` from the Conventional Commits since the last release. Merging it creates the tag and the GitHub Release. Before the first major version, a breaking change bumps the minor version. Do not bump the version or create a tag by hand. The configuration is `release-please-config.json`, and the last released version is in `.release-please-manifest.json`.

The MCP server reads its version from `package.json`, so the release pull request does not touch `api/`.

`.claude-plugin/` is the source of truth for the plugin, as ADR 0011 of the core harness decides. `.cursor-plugin/plugin.json` repeats its shared fields: `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, and `skills`. A field added to one goes into the other in the same commit.

The release pull request is opened with `GITHUB_TOKEN`, so CI does not run on it. Every commit it describes already passed CI on its own pull request.

## Local MCP server

The plugin root is the repository root, and Claude Code starts the servers of a `.mcp.json` at a plugin root for every project that installs the plugin. So this repository keeps no `.mcp.json`: the plugin ships only the skills, and a project starts the server from its own `.agents/mcp.json`, as `docs/runbooks/mcp-hosts.md` describes. To use the server from this source tree, add it once to your local scope:

```bash
claude mcp add --scope local vocabulary -- node api/mcp/index.ts
```

`api/mcp/plugin.test.ts` fails when a `.mcp.json` comes back to the root or a plugin manifest declares `mcpServers`.

## Renovate

`renovate.json` extends the shared preset of the core harness, `github>jimmyandrade/harness`. A business harness extends the same preset. Renovate moves a pin of this repository in a business harness when the pin is a release tag and a newer tag exists. A pin to a commit does not move.

When a workflow changes, update this file from the diff.
