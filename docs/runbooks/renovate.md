---
locale: en
---

# Keep the core current with Renovate

Renovate is optional. With it, each release of this repository opens one pull request in the business repository that moves every pin of the core at once: the workflows, `package.json`, `.claude-plugin/marketplace.json`, and `.claude/settings.json`. For a minor or patch release, Renovate merges that pull request by itself once its checks pass. Without it, someone moves those pins by hand, and the `core-pins` check of `run-check.sh` fails, on commit and in the pull request, at the line of each pin left on another tag. Run this runbook once per repository, after `business-repository.md`.

Each step ends with a check.

## Extend the preset

[Copy the example files and the instructions template](business-repository.md#copy-the-example-files-and-the-instructions-template), in `business-repository.md`, already copied `renovate.json`, which extends the preset of this repository. Another project copies it.

```bash
cp -n node_modules/harness/examples/business-harness/renovate.json renovate.json
```

The preset moves the core at any time and waits until Monday morning for every other dependency. A major update of any other dependency waits for approval on the Dependency Dashboard.

Check: `jq -r '.extends[]' renovate.json` prints `github>jimmyandrade/harness`.

## Install the app

Install the Renovate GitHub app (github.com/apps/renovate) on the account or organization that owns the repository. With "Only select repositories", add this one. A personal account and each organization are separate installations.

Check: the repository shows under the app in the account or organization settings, in Applications.

## Turn off silent mode

Open the repository in the Mend portal (developer.mend.io/github/<owner>/<repository>). Dependency Updates must say Interactive. Silent mode runs Renovate but opens no pull request and no dashboard. In Settings, Dependencies, turn Silent mode off for the repository, or for the whole organization when every repository shows Silent.

Check: the portal shows Dependency Updates as Interactive.

## Run it once

In the portal, use Actions, then Run Renovate scan. Saving a setting also starts a job. The hosted app works through a queue, so a scheduled run can take hours; the Dependency Dashboard issue has a checkbox that asks for a new run too.

Check: the repository has a Dependency Dashboard issue, and its detected dependencies list `jimmyandrade/harness` in each file that pins it. When a newer release exists, a `core harness` pull request is open, or already merged after its checks passed.
