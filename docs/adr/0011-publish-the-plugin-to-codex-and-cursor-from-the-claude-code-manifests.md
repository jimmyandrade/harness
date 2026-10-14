---
locale: en
---

# Publish the plugin to Codex and Cursor from the Claude Code manifests

## Status

Accepted

## Context

A business harness publishes its skills as a Claude Code plugin marketplace in `.claude-plugin/`. The marketplace lists the business plugin, with source `.`, and `core`, pinned to a tag of this repository. Codex and Cursor read plugin marketplaces too. The table in issue 139 came from a sample of another vendor, so each format was checked against the client's own documentation and, for Codex, against its source code:

- Codex reads `.agents/plugins/marketplace.json` first, and also `.claude-plugin/marketplace.json` and `.cursor-plugin/marketplace.json` at the root of a marketplace. For a plugin root it reads a root `plugin.json` in the Agent Plugins format, else `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, or `.cursor-plugin/plugin.json`, in that order. The legacy manifests take a `skills` path. A marketplace entry accepts a `./` path, `.`, or a `url`, `git-subdir`, or `npm` object; `url` and `git-subdir` take `ref` or `sha`. It skips an entry with any other source, such as `github`, without an error. Sources: the Codex plugin build guide, and `codex-rs/core-plugins/src/marketplace.rs`, `codex-rs/core-plugins/src/manifest.rs`, and `codex-rs/exec-server-protocol/src/protocol.rs` in openai/codex.
- Claude Code accepts a `url` plugin source, a git URL with `ref` or `sha`, as well as `github`. It reads a marketplace at `.claude-plugin/marketplace.json`; a file elsewhere in the repository loads only when each project declares its `path` in `extraKnownMarketplaces`, because `claude plugin marketplace add` has no option for it. Source: the Claude Code marketplace reference.
- Cursor reads `.cursor-plugin/plugin.json`, whose `skills` field takes a path, or a root `plugin.json` in the Agent Plugins format. A repository with one plugin keeps only `.cursor-plugin/plugin.json`; `.cursor-plugin/marketplace.json` is for several plugins in one repository, and its entries are paths inside that repository. Cursor documents no source in another repository and no pin to a tag; a team marketplace follows a branch. Sources: the Cursor plugins reference, the Cursor plugins guide, and the cursor/plugin-template repository.
- The Agent Plugins standard reads skills only from a root `skills/` directory, and its `plugin.json` cannot move it. It defines no marketplace format. Source: the Agent Plugins specification.

No marketplace location is shared by all three clients. `.agents/plugins/marketplace.json` looks neutral because of the `.agents/` prefix, but it is the Codex location and format, with Codex fields such as `policy`; neither Claude Code nor Cursor reads it on its own.

## Decision

`.claude-plugin/` stays the source of truth, read by Claude Code and Codex. This is a practical choice, not a preference for one vendor: it is the only location that two of the three clients read without configuration, the only format of the three that lists the core from another repository at a tag, and the one every business harness already has.

Making `.agents/plugins/marketplace.json` the source instead would not make the list neutral. Codex alone would read it as it is. Claude Code would need its `path` in the settings of every project, and would still need `.claude-plugin/plugin.json`. Cursor would still need its own manifest.

The `core` entry of a business marketplace uses a `url` source, `https://github.com/jimmyandrade/harness.git` at the release tag, instead of `github`, because Codex skips a `github` source and Claude Code reads both.

Each repository that publishes a plugin, this one and every business harness, adds `.cursor-plugin/plugin.json`. It repeats the fields that mean the same in both formats: `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, and `skills`. It has no Cursor marketplace, because the repository holds one plugin and a Cursor marketplace cannot list the core from another repository. A team imports the business repository and this repository as two Cursor marketplaces.

`run-check.sh` runs `.agents/scripts/plugin-manifests/plugin-manifests.py`, which fails when the Cursor manifest disagrees with the Claude Code manifest on one of those fields, and when a plugin source in `.claude-plugin/marketplace.json` is one that Codex skips.

No repository adds `.agents/plugins/marketplace.json`, `.codex-plugin/plugin.json`, or a root `plugin.json`. Codex does not need the first two. A root `plugin.json` would make Codex and Cursor look for skills in `skills/`, and the skills live in `.agents/skills/`.

## Consequences

Codex installs the business plugin and `core` from the same marketplace as Claude Code, with `core` pinned to the same tag. Renovate reads the `url` pin with a second regex in `default.json`.

Cursor installs the business plugin and `core` from two team marketplaces. `core` follows the default branch of this repository, not the tag the business pins. A project that needs the pinned core in Cursor keeps the link to `node_modules/harness/.agents/skills` from the Cursor runbook.

`.agents/plugins/` would not conflict with the harness: the checker, the skill graph, the folder icon, and the sync read only `.agents/skills/` and the files they name. It is left out because it would be a third copy of the plugin list, or, as the source, a Codex-first one.

Revisit this decision when Codex stops reading `.claude-plugin/marketplace.json`, when Claude Code or Cursor reads `.agents/plugins/marketplace.json`, or when the Agent Plugins standard defines a marketplace. In the first case, add `.agents/plugins/marketplace.json` and have the check compare it with `.claude-plugin/marketplace.json`. In the others, consider moving the source of truth to the shared location.

A field added to `.claude-plugin/plugin.json` that Cursor shares goes into `.cursor-plugin/plugin.json` in the same commit, or the check fails. Release Please bumps `version` in both manifests of this repository.
