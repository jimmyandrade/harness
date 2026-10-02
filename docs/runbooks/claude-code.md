---
locale: en
---

# Load the skills in Claude Code

Claude Code reads project skills only from `.claude/skills`, and follows symbolic links. The core skills come from the `harness-core` plugin, named `harness-core:<skill>`. The repository can enable the plugin, but each machine installs it once. Run this runbook from the root of the project.

Each step ends with a check.

## 1. Link the project skills

Skip this step when the project has no skills of its own.

```bash
ln -s ../.agents/skills .claude/skills
```

Commit the link.

Check: `ls .claude/skills/` lists the skills of the project.

## 2. Enable the plugin in the repository

`.claude/settings.json` names the marketplace and enables the plugin. A business harness points at its own marketplace, which brings `harness-core` too. A project that only uses the core points at this repository.

```json
{
  "extraKnownMarketplaces": {
    "harness": {
      "source": { "source": "github", "repo": "jimmyandrade/harness", "ref": "vX.Y.Z" }
    }
  },
  "enabledPlugins": { "harness-core@harness": true }
}
```

Replace `vX.Y.Z` with the tag from `business-repository.md`, step 2.

Check: `jq '.enabledPlugins' .claude/settings.json` shows `harness-core@<marketplace>` as `true`.

## 3. Install the plugin on the machine

Run this once per machine. It installs the plugin for the user, so it works in every project. In the desktop app, typing `/plugin` opens the plugin screen and does not take arguments, so use the terminal.

Find the `claude` command. When it is not on `PATH`, macOS has the copy bundled with the desktop app:

```bash
CLAUDE="$(command -v claude || find "$HOME/Library/Application Support/Claude/claude-code" -path '*/MacOS/claude' -type f | sort -V | tail -1)"
```

Add the marketplace and install the plugin. Use the marketplace name from step 2.

```bash
"$CLAUDE" plugin marketplace add jimmyandrade/harness
"$CLAUDE" plugin install harness-core@harness
```

Check: the last command prints `Successfully installed plugin: harness-core@harness`.

## 4. Confirm in a new session

Open a new Claude Code session in the project. Sessions opened before the install do not see the plugin.

Check: typing `/harness-core:` lists the core skills, and typing the start of a project skill lists it with `(project)`.

## Do not

- Do not copy core skills into `.claude/skills`. The plugin already brings them, and a copy goes stale.
