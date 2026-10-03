---
locale: en
---

# Load the skills in Claude Code

Claude Code reads project skills only from `.claude/skills`, and follows symbolic links. The core skills come from the `harness-core` plugin, named `harness-core:<skill>`. The repository can enable the plugin, but each machine installs it once. Run this runbook from the root of the project.

Each step ends with a check.

## 1. Link the project skills

Skip this step when the project has no skills of its own.

```bash
mkdir -p .claude
ln -s ../.agents/skills .claude/skills
```

Commit the link.

Check: `ls .claude/skills/` lists the skills of the project.

## 2. Enable the plugin in the repository

`.claude/settings.json` names the marketplace and enables `harness-core`. A business harness already has it from `business-repository.md`, step 3, pointing at its own marketplace. A project that only uses the core copies the example that points at this repository.

```bash
TAG="$(gh release view --repo jimmyandrade/harness --json tagName --jq .tagName)"
cp -Rn node_modules/harness/examples/project/. .
perl -pi -e "s/vX\.Y\.Z/$TAG/g" .claude/settings.json
```

Check: `jq '.enabledPlugins' .claude/settings.json` shows `harness-core@<marketplace>` as `true`.

## 3. Install the plugin for the project

Run this once per machine, from the root of each project that enables the plugin. Install it with `--scope project`: a user install enables the plugin in every project, including one that already gets the core skills through a link, where each skill then shows twice. In the desktop app, typing `/plugin` opens the plugin screen and does not take arguments, so use the terminal.

Find the `claude` command. When it is not on `PATH`, macOS has the copy bundled with the desktop app.

```bash
CLAUDE="$(command -v claude || find "$HOME/Library/Application Support/Claude/claude-code" -path '*/MacOS/claude' -type f | sort -V | tail -1)"
```

Read the marketplace from `.claude/settings.json`, add it, and install the plugin.

```bash
MARKETPLACE="$(jq -r '.extraKnownMarketplaces | keys | first' .claude/settings.json)"
REPO="$(jq -r --arg m "$MARKETPLACE" '.extraKnownMarketplaces[$m].source.repo' .claude/settings.json)"
"$CLAUDE" plugin marketplace add "$REPO"
"$CLAUDE" plugin install "harness-core@$MARKETPLACE" --scope project
```

Check: the last command prints `Successfully installed plugin: harness-core@<marketplace> (scope: project)`. When `.claude/settings.json` only changes in formatting, discard that change.

## 4. Confirm in a new session

Open a new Claude Code session in the project. Sessions opened before the install do not see the plugin.

Check: typing `/harness-core:` lists the core skills, and typing the start of a project skill lists it with `(project)`.

## Do not

- Do not copy core skills into `.claude/skills`. The plugin already brings them, and a copy goes stale.
