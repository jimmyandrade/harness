---
locale: en
---

# Troubleshooting

Failure diagnosis belongs here. A usage tip belongs in `INSTALL.md`. CI and actions belong in `CONTRIBUTING.md`.

## The checker asks for tiktoken

The message names `.agents/scripts/check-skill/requirements.txt`.

1. Run `.agents/scripts/check-skill/run-check.sh` from the project root.
2. The script creates `.venv` inside this harness when it is missing and installs the dependency. `HARNESS_VENV` points it at another directory.
3. Run it again. Exit code 0 closes the case.

## The folder icon hook cannot import yaml

The Lefthook `skill-folder-icon` command fails on checkout or commit with `ModuleNotFoundError: No module named 'yaml'`, raised from `project-parameters.py`.

1. The hook ran `set-folder-icon.py` with the system `python3`, which has no PyYAML. In a business harness, `lefthook.yml` still calls `python3 node_modules/harness/.agents/scripts/skill-folder-icon/set-folder-icon.py`.
2. Update the harness dependency, then replace that command, under `pre-commit` and `post-checkout`, with `node_modules/harness/.agents/scripts/skill-folder-icon/run-folder-icon.sh`, as in `examples/business-harness/lefthook.yml`. The script uses the virtual environment of the checker and installs PyYAML in it when it is missing. `HARNESS_VENV` points it at another directory.
3. When the message is `skill folder symbol is missing` instead, `node_modules/harness` is older than the version `package.json` pins, and reads a configuration file that no longer exists. Run `npm ci`.
4. Run `npx lefthook run post-checkout`. Exit code 0 closes the case.

## The checker or the sync reads the wrong project

The message names a skill, a config key, or a mapping that belongs to another repository.

1. A script reads the project in `HARNESS_ROOT`, or the working directory when it is unset.
2. Run it from the project root, or set `HARNESS_ROOT` to that root.

## A setting is missing or invalid

The message is `"<key>" is missing from metadata.parameters of AGENTS.md`, or a finding on `AGENTS.md` such as `"<key>" is not a parameter of any skill nor a script setting`.

1. A missing setting is absent from the project and from the core. Update the harness dependency or the action tag, or add the key under `metadata.parameters.Global` in the frontmatter of the project `AGENTS.md`.
2. An unknown key is usually misspelled. Copy the key from the skill's `Parâmetros de configuração` block, or from the core `AGENTS.md` for a script setting.

## The plugin manifests disagree

The checker prints a line that starts with `.cursor-plugin/plugin.json` or `.claude-plugin/marketplace.json`.

1. `.claude-plugin/` is the source of truth. A line on `.cursor-plugin/plugin.json` names the field and both values. Copy the value from `.claude-plugin/plugin.json`.
2. A line that names a plugin `source` Codex skips is usually the `core` entry of a marketplace copied before Codex support. Replace it with the `core` entry of `examples/business-harness/.claude-plugin/marketplace.json`, with `vX.Y.Z` replaced by the tag the other pins use.
3. Run `run-check.sh` again. Exit code 0 closes the case.

## The Renovate `core harness` pull request fails the check

In a business harness, the `check` job of a `core harness` pull request opened by Renovate fails, while `main` passed with the previous release. Renovate does not merge it by itself while the check fails.

1. Renovate only moves the pins: the workflows, `package.json`, `package-lock.json`, and `.claude-plugin/marketplace.json`. The workflow runs the checker of the new release, so a release that adds a rule fails on a file the rule now refuses, until that file changes too. The message names the file and the rule.
2. Read `CHANGELOG.md` of this repository from the pinned release up to the new one. A breaking change or a feature that changes a file the runbooks copy names what the business harness needs. Compare its files with `examples/business-harness/` at the new tag.
3. Commit the fix on the Renovate branch, or open a pull request from a `chore/` branch with the same pins and the fix. With the second, merge it and leave the Renovate pull request open: Renovate closes it on its next run, because the pins already match.
4. A failure after the fix is a single transition. Later Renovate pull requests only move the tags, and pass while no rule changes again. For example, the release that publishes the plugin to Codex refuses a `github` plugin source; once the `core` entry uses a `url` source, Renovate moves its `ref` with the second regex of `default.json`, as in "The plugin manifests disagree".
5. Run `run-check.sh` on the branch. Exit code 0, and a passing `check` job, close the case.

## Renovate opens no pull request after a release

The release exists, but the Dependency Dashboard of a business harness still lists the previous tag under the detected dependencies, after a run.

1. Renovate caches the list of tags for a while. A run in the first minutes after a release can miss the new tag.
2. Check the box at the end of the Dependency Dashboard issue to ask for another run, later. The `renovate.md` runbook, step 4, covers a run from the Mend portal.
3. To move the pins now, open the pull request by hand, as in the previous section, step 3.
4. The dashboard listing the new tag, or a `core harness` pull request, closes the case.

## npm refuses a pin of the core with EALLOWGIT

Moving a pin by hand, `npm install -D "harness@github:jimmyandrade/harness#vX.Y.Z"` stops with `npm error code EALLOWGIT` and `Refusing to fetch`.

1. `allow-git` is `root`: npm 11.17 uses that value by default, and `~/.npmrc` can set it too. `npm config get allow-git` prints it. With that value, npm refuses to resolve a new git dependency, even one listed in `package.json`.
2. Allow it for that one command: `npm install -D "harness@github:jimmyandrade/harness#vX.Y.Z" --allow-git=all`. The setting in `~/.npmrc` stays as it is.
3. `npm ci` installs from `package-lock.json` and does not need the flag. With npm 11.17 or later and `allow-scripts` set in `~/.npmrc`, it can stop with `EALLOWSCRIPTS` instead: see the next section. Renovate does not read `~/.npmrc` and needs neither.
4. `package.json` and `package-lock.json` naming the new tag, and `run-check.sh` exiting 0, close the case.

## npm lists the core install script as not reviewed

`npm install` or `npm ci` in a business harness ends with `npm warn allow-scripts   harness@X.Y.Z (prepare: npm run build)` and `Run npm approve-scripts --allow-scripts-pending to review`.

1. The core is a git dependency, and its `prepare` script builds the vocabulary in `node_modules/harness/vocabulary/dist`. From npm 11.17, `allowScripts` in the project `package.json` records which dependencies may run install scripts. In that release a script missing from it still runs, and npm only warns. A later release will block it, and the vocabulary will be left without `dist`.
2. Approve it once, by name and without a version, in the project folder: `npm approve-scripts --no-allow-scripts-pin harness`. npm writes `"allowScripts": { "github:jimmyandrade/harness": true }` in `package.json`. The entry names the source and holds for every tag, so the next `core harness` pull request of Renovate needs no new approval. A pinned entry, the default of `npm approve-scripts`, would have to be approved again on every pin move.
3. Commit `package.json`.
4. `npm approve-scripts --allow-scripts-pending` printing `No packages with unreviewed install scripts.`, and `npm ci` with no `allow-scripts` warning, close the case.

## npm warns EBADENGINE for the core

An install of a project that depends on the core, often a build on a host such as Vercel, prints `npm warn EBADENGINE Unsupported engine`, with `package: 'harness@X.Y.Z'`, `required: { node: '>=24.22.1' }`, and an older `current` version, such as Node.js 22.

1. `engines.node` of the core asks for Node.js 24.22.1 or newer, because the vocabulary MCP server needs it. npm only warns: the install and the build go on, unless `engine-strict` is set.
2. In a project where the core is only a development dependency, such as a website that its agents work on, the warning does not break the build, and the vocabulary server does not run there. It still means the host builds on a Node.js version that the core does not support.
3. Set the Node.js version of the project to 24: `"engines": { "node": "24.x" }` in `package.json`, and the same field in the root package of `package-lock.json`. Vercel and most hosts read it, and it also sets the Node.js version that the functions run on, so check the preview build before merging.
4. A build with no `EBADENGINE` line closes the case.

## npm stops a git dependency with EALLOWSCRIPTS

`npm ci` or `npm install` in a business harness stops with `npm error code EALLOWSCRIPTS` and `--allow-scripts is not allowed in project-scoped installs`, printed twice, once by a second npm process. `node_modules` is left empty.

1. The core is a git dependency. To prepare one, npm runs a second `npm install` in the cloned folder and passes its own settings down as environment variables. From npm 11.17, a project install refuses `allow-scripts` given on the command line, and the second npm reads the setting it inherited from `~/.npmrc` as if it came from the command line. `npm -v` prints the version, and `npm config get allow-scripts` prints the setting.
2. Run the install ignoring the user configuration for that one command, in the project folder: `npm_config_userconfig=/dev/null npm ci`. To move a pin, add both: `npm_config_userconfig=/dev/null npm install -D "harness@github:jimmyandrade/harness#vX.Y.Z" --allow-git=all`. Ignoring `~/.npmrc` does not lift `allow-git`, because `root` is also the npm default. The file stays as it is.
3. Without `~/.npmrc`, the command also loses the tokens it holds. Git dependencies over SSH and public packages do not need them; a package from a private registry does.
4. `node_modules/harness` and `node_modules/vocabulary` present, and `run-check.sh` exiting 0, close the case.

## Cursor shows an old core

Customize, or a plugin page named `core` or `harness-core`, lists skills from a commit older than the default branch. Enable Auto Refresh is not on the page. The dashboard lists the repository under Your Marketplaces, with only Remove, and has no Team Marketplaces section.

1. Your Marketplaces is a personal install. It has no Enable Auto Refresh. Cursor keeps the commit from when the repository was added. Removing the repository and adding it again installs that same commit. The steps that do move are in `docs/runbooks/cursor.md`.
2. The account menu in Cursor, and Get Grok Bot in that menu, do not open the dashboard. The dashboard is [cursor.com/dashboard](https://cursor.com/dashboard). Enable Auto Refresh is under Plugins & MCPs, Team Marketplaces, the imported marketplace, Marketplace Settings, Plugin Repository. Team Marketplaces exists on a Teams or Enterprise plan, for an admin. When the account belongs to a team and the page still shows only Your Marketplaces, switch to that team in the dashboard header.
3. On that team marketplace, turn Enable Auto Refresh on. The Cursor GitHub App must be installed on the repository and allowed to read it. Cursor re-indexes at most once every 10 minutes and keeps the latest commit of the default branch. Refresh in Plugin Repository re-indexes once, without the app. Restart Cursor, or focus the window. A Cloud Agent that is already running keeps the version it started with. The import follows the default branch, not the tag in `package.json`.
4. A project that needs the tag in `package.json` keeps the links in `docs/runbooks/cursor.md`, steps 1 to 3. Renovate moves that pin, as `docs/runbooks/renovate.md` describes. Remove the personal marketplace so the same skill is not listed twice.
5. Grok Bot does not read those links or this plugin. Connect apps lists apps from the Cursor Marketplace. A skill a Bot saves belongs to that Bot. There is no install of this repository in Grok Bot.
6. Customize listing the skills of the indexed commit, or `ls` of the project link after `npm ci` listing the skills under `node_modules/harness/.agents/skills`, closes the case.
