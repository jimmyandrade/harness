---
locale: en
---

# Security Policy

## Supported Versions

Only the latest release receives security fixes.

The scripts and the actions run on Node.js 24 and Python 3.14. Continuous integration runs on the GitHub-hosted `ubuntu-26.04` image.

| Runtime | Supported |
| --- | --- |
| Node.js 24.x | :white_check_mark: |
| Node.js 22.x and older | :x: |
| Python 3.14 | :white_check_mark: |

## Secrets

This repository never stores a token, a workspace id, or a database id. A business harness passes its Notion token to `sync-skill-pages` as a secret and keeps its data source id in its own mapping.

## Reporting a Vulnerability

Report a vulnerability through GitHub private vulnerability reporting on this repository. Do not open a public issue for an undisclosed vulnerability.
