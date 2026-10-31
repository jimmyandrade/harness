---
locale: en
---

# Load the skills in Codex

Codex reads the same `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` as Claude Code, as `docs/adr/0011-publish-the-plugin-to-codex-and-cursor-from-the-claude-code-manifests.md` decides. A business marketplace lists the business plugin and `core`, pinned to the same tag. A project that only uses the core adds the marketplace of this repository. Each machine adds the marketplace and installs the plugins once. Run this runbook from the root of the project.

Read `Forma do harness`, `Papel do repositório atual`, and `Instalação do harness`. `INSTALL.md` has the table. Stop when the install is `global` or `Harness no repositório atual` is `não`: this repository does not receive another install, and `não` does not mean the install is global. When the form is `repositório próprio` and the role is `projeto`, the install is `global`. When the form is `repositório existente`, continue and install the core in this repository. When the form is `próprio e repositórios` and the role is `projeto`, continue and install the business harness as well as the core. When the form, the role, or the install is absent, ask once and stop. Do not create the files below.

Each step ends with a check.

## Add the marketplace

A business harness: add its own repository. Codex accepts `owner/repo`, an HTTPS URL, or an SSH URL, so a private repository works with the git credentials of the machine.

```bash
codex plugin marketplace add "$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
```

A project that only uses the core: add this repository at the release tag.

```bash
TAG="$(gh release view --repo jimmyandrade/harness --json tagName --jq .tagName)"
codex plugin marketplace add jimmyandrade/harness --ref "$TAG"
```

Check: `codex plugin marketplace list` shows the marketplace, named after the `name` in `.claude-plugin/marketplace.json`: the business name, or `harness`.

## Install the plugins

```bash
MARKETPLACE="$(jq -r .name .claude-plugin/marketplace.json)"
jq -r '.plugins[].name' .claude-plugin/marketplace.json | while read -r plugin; do codex plugin add "$plugin@$MARKETPLACE"; done
```

A project that only uses the core runs `codex plugin add core@harness` instead.

Check: `codex plugin list --marketplace "$MARKETPLACE"` shows every plugin as `installed, enabled`, and `core` comes from the tag in `.claude-plugin/marketplace.json`.

## Confirm in a new session

Open a new Codex session in the project. Sessions opened before the install do not see the plugins.

Check: `/skills` lists the project skills and the core skills, such as `criar-commit`.

## Do not

- Do not change the `core` source back to `github`. Codex skips it without an error, and the checker fails.
- Do not add `.agents/plugins/marketplace.json`. Codex reads it first, and it would be a second list of plugins to keep in sync.
