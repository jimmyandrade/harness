# Changelog

## [0.13.0](https://github.com/jimmyandrade/harness/compare/v0.12.0...v0.13.0) (2026-10-06)


### ⚠ BREAKING CHANGES

* rename these parameter keys in the project instructions:
    - criar-commit: "Idioma da mensagem" is now "Idioma da mensagem de commit",
      and "Padrão da mensagem" is now "Padrão da mensagem de commit".
    - criar-pull-request: "Merge" is now "Tipo de merge".
    - resolver-comentarios-de-revisao: "Idioma da resposta" is now
      "Idioma da resposta à revisão".
    A project that keeps an old key falls back to the default of the skill.

### Features

* **check-skill:** measure AGENTS.md with the skill body limits ([#101](https://github.com/jimmyandrade/harness/issues/101)) ([169f0a8](https://github.com/jimmyandrade/harness/commit/169f0a8e92e5edb197de74f62426bc0f6a181600))
* read skill parameters from a tree with unambiguous keys ([#99](https://github.com/jimmyandrade/harness/issues/99)) ([bdaacf8](https://github.com/jimmyandrade/harness/commit/bdaacf848026e087e297f1cf6f85b893d8338e58))

## [0.12.0](https://github.com/jimmyandrade/harness/compare/v0.11.1...v0.12.0) (2026-10-04)


### Features

* **check-skill:** comment the skill table on the pull request ([#94](https://github.com/jimmyandrade/harness/issues/94)) ([3d20650](https://github.com/jimmyandrade/harness/commit/3d2065030e7e717faf117f4ed3a325626f6e1aa2))

## [0.11.1](https://github.com/jimmyandrade/harness/compare/v0.11.0...v0.11.1) (2026-10-04)


### Bug Fixes

* **sync-skill-pages:** skip files at the root of the skills folder ([#92](https://github.com/jimmyandrade/harness/issues/92)) ([a9489f7](https://github.com/jimmyandrade/harness/commit/a9489f737fca2cb7dc7f57f4ff14ce934edffa10))

## [0.11.0](https://github.com/jimmyandrade/harness/compare/v0.10.0...v0.11.0) (2026-10-04)


### ⚠ BREAKING CHANGES

* the plugin harness-core is now core. Replace harness-core@<marketplace> with core@<marketplace> in enabledPlugins and in each business marketplace, then install core@<marketplace>.

### Features

* rename the Claude Code plugin to core ([#88](https://github.com/jimmyandrade/harness/issues/88)) ([5a7c2f6](https://github.com/jimmyandrade/harness/commit/5a7c2f6e136ad4d5dc8a2223b17deea4fb22acf7))

## [0.10.0](https://github.com/jimmyandrade/harness/compare/v0.9.1...v0.10.0) (2026-10-04)


### Features

* **criar-pull-request:** announce product news after each merge ([#85](https://github.com/jimmyandrade/harness/issues/85)) ([f1034b4](https://github.com/jimmyandrade/harness/commit/f1034b4f52521115775c582dada0031609f9725d))


### Bug Fixes

* **criar-pull-request:** respect the opt-out in the merge flowchart ([#87](https://github.com/jimmyandrade/harness/issues/87)) ([54a20f0](https://github.com/jimmyandrade/harness/commit/54a20f0e0377e901d3b8529450bf9e11539788b0))

## [0.9.1](https://github.com/jimmyandrade/harness/compare/v0.9.0...v0.9.1) (2026-10-04)


### Bug Fixes

* **comunicar-novidade-do-produto:** resolve the base branch and pull request links ([#83](https://github.com/jimmyandrade/harness/issues/83)) ([c59bd4b](https://github.com/jimmyandrade/harness/commit/c59bd4b8053564136cd2695f556adc5ce3bbb673))

## [0.9.0](https://github.com/jimmyandrade/harness/compare/v0.8.0...v0.9.0) (2026-10-03)


### Features

* **comunicar-novidade-do-produto:** communicate product news to non-technical readers ([#80](https://github.com/jimmyandrade/harness/issues/80)) ([b3be67f](https://github.com/jimmyandrade/harness/commit/b3be67f6b24325f617b3dee3c84269184f95f8e0))
* **comunicar-novidade-do-produto:** read the sources from a parameter ([#82](https://github.com/jimmyandrade/harness/issues/82)) ([879334b](https://github.com/jimmyandrade/harness/commit/879334b064c00e8a27aae648881a471a16955d9d))

## [0.8.0](https://github.com/jimmyandrade/harness/compare/v0.7.3...v0.8.0) (2026-10-03)


### Features

* add a learning mode at the end of every core skill ([#78](https://github.com/jimmyandrade/harness/issues/78)) ([15ce741](https://github.com/jimmyandrade/harness/commit/15ce741142e603e1b1a4acdacd2afe7ff829c90c))

## [0.7.3](https://github.com/jimmyandrade/harness/compare/v0.7.2...v0.7.3) (2026-10-03)


### Bug Fixes

* **skill-graph:** keep business graphs stable across core releases ([#73](https://github.com/jimmyandrade/harness/issues/73)) ([2eb208a](https://github.com/jimmyandrade/harness/commit/2eb208a9c96550e4a16bb7010f09fd8fb554cbbe))

## [0.7.2](https://github.com/jimmyandrade/harness/compare/v0.7.1...v0.7.2) (2026-10-03)


### Bug Fixes

* **check-skill:** compare the skill version with the base commit ([#71](https://github.com/jimmyandrade/harness/issues/71)) ([c7f278a](https://github.com/jimmyandrade/harness/commit/c7f278ad49dda68760efd833857920c9422ab258)), closes [#70](https://github.com/jimmyandrade/harness/issues/70)

## [0.7.1](https://github.com/jimmyandrade/harness/compare/v0.7.0...v0.7.1) (2026-10-03)


### Bug Fixes

* **avaliar-atualizacoes-de-dependencia:** lessons from the Renovate queue ([#65](https://github.com/jimmyandrade/harness/issues/65)) ([c6fe09d](https://github.com/jimmyandrade/harness/commit/c6fe09d190ad46318912b1ac05d19df29c74bd8f))

## [0.7.0](https://github.com/jimmyandrade/harness/compare/v0.6.2...v0.7.0) (2026-10-03)


### Features

* **avaliar-atualizacoes-de-dependencia:** apply the lessons of the first real run ([#63](https://github.com/jimmyandrade/harness/issues/63)) ([b11e238](https://github.com/jimmyandrade/harness/commit/b11e23898df7bca6412a5a08dfd13b6df5344208))

## [0.6.2](https://github.com/jimmyandrade/harness/compare/v0.6.1...v0.6.2) (2026-10-03)


### Documentation

* add an optional Renovate runbook ([#60](https://github.com/jimmyandrade/harness/issues/60)) ([c3633c0](https://github.com/jimmyandrade/harness/commit/c3633c08eba2be05c2e4309aaeb36b5b0505ddb5))

## [0.6.1](https://github.com/jimmyandrade/harness/compare/v0.6.0...v0.6.1) (2026-10-03)


### Continuous Integration

* **sync-skill-pages:** fail fast when the Notion token is missing ([#54](https://github.com/jimmyandrade/harness/issues/54)) ([f926758](https://github.com/jimmyandrade/harness/commit/f926758d7f1cc2247cf5cd5f379794f89ff57831))

## [0.6.0](https://github.com/jimmyandrade/harness/compare/v0.5.0...v0.6.0) (2026-10-03)


### Features

* move the core pin in .claude/settings.json with Renovate ([#52](https://github.com/jimmyandrade/harness/issues/52)) ([3f7f033](https://github.com/jimmyandrade/harness/commit/3f7f033ba46fd85173d6bb317c9c768cfd6c5647))

## [0.5.0](https://github.com/jimmyandrade/harness/compare/v0.4.0...v0.5.0) (2026-10-03)


### Features

* **avaliar-atualizacoes-de-dependencia:** work through dependency update pull requests ([#50](https://github.com/jimmyandrade/harness/issues/50)) ([831551d](https://github.com/jimmyandrade/harness/commit/831551d0541278565bb1780345f5223fa9f51f96))

## [0.4.0](https://github.com/jimmyandrade/harness/compare/v0.3.5...v0.4.0) (2026-10-03)


### Features

* **criar-pull-request:** check comments and checks before merging ([#48](https://github.com/jimmyandrade/harness/issues/48)) ([056beb7](https://github.com/jimmyandrade/harness/commit/056beb77fa29e2924ad19c35f8bb77b55289ee66))

## [0.3.5](https://github.com/jimmyandrade/harness/compare/v0.3.4...v0.3.5) (2026-10-03)


### Bug Fixes

* **resolver-comentarios-de-revisao:** push the branch before replying ([#46](https://github.com/jimmyandrade/harness/issues/46)) ([e839c8b](https://github.com/jimmyandrade/harness/commit/e839c8b70fd71d7bcc81448f1acdaebfcf483346))

## [0.3.4](https://github.com/jimmyandrade/harness/compare/v0.3.3...v0.3.4) (2026-10-03)


### Bug Fixes

* install the core plugin per project in the Claude Code runbook ([#43](https://github.com/jimmyandrade/harness/issues/43)) ([7cf3478](https://github.com/jimmyandrade/harness/commit/7cf3478c29db8fea4d6d5869f01684677500fbb7))

## [0.3.3](https://github.com/jimmyandrade/harness/compare/v0.3.2...v0.3.3) (2026-10-03)


### Bug Fixes

* keep the MCP server list out of the plugin root ([#41](https://github.com/jimmyandrade/harness/issues/41)) ([ea1d499](https://github.com/jimmyandrade/harness/commit/ea1d499fcdffa0ef025a6b098d3cbdb2830814e4))

## [0.3.2](https://github.com/jimmyandrade/harness/compare/v0.3.1...v0.3.2) (2026-10-03)


### Documentation

* add a runbook to connect MCP hosts to the project servers ([#38](https://github.com/jimmyandrade/harness/issues/38)) ([fcdf720](https://github.com/jimmyandrade/harness/commit/fcdf720f0fb6027f47ed771598ad45a5e33106cc))

## [0.3.1](https://github.com/jimmyandrade/harness/compare/v0.3.0...v0.3.1) (2026-10-03)


### Miscellaneous Chores

* release the setup runbooks ([#36](https://github.com/jimmyandrade/harness/issues/36)) ([0bd089f](https://github.com/jimmyandrade/harness/commit/0bd089fee0d64666c988abe9d6560726fe6ac139))

## [0.3.0](https://github.com/jimmyandrade/harness/compare/v0.2.0...v0.3.0) (2026-10-02)


### ⚠ BREAKING CHANGES

* **publicar-habilidade:** publicar-habilidade 0.5.0 no longer commits on the main branch by default in a repository session. A harness that wants that sets "Commit direto na base": "sim" in its project instructions.

### Features

* **check-skill:** check the language and the Given of Gherkin files ([#31](https://github.com/jimmyandrade/harness/issues/31)) ([1bbff88](https://github.com/jimmyandrade/harness/commit/1bbff88a78859b52d475bd356ac323db443d941a))
* **criar-habilidade:** move the skill to the core ([#22](https://github.com/jimmyandrade/harness/issues/22)) ([02493eb](https://github.com/jimmyandrade/harness/commit/02493eb5150102589fce81ea5e5ddf7cea7212f0))
* **descrever-habilidade-ou-schema:** move the skill to the core ([#20](https://github.com/jimmyandrade/harness/issues/20)) ([6ebcfa9](https://github.com/jimmyandrade/harness/commit/6ebcfa9c2a43fe8332615c7fca1f0baab765a27c))
* **evoluir-habilidade:** move the skill to the core ([#21](https://github.com/jimmyandrade/harness/issues/21)) ([a7c69be](https://github.com/jimmyandrade/harness/commit/a7c69beb0f010ed89bf65e14afa5ffb3d96e0389))
* **medir-habilidade:** move the skill to the core ([#23](https://github.com/jimmyandrade/harness/issues/23)) ([df2a0b8](https://github.com/jimmyandrade/harness/commit/df2a0b89ec3bb67811fb8b6c65b9154f0c412483))
* **publicar-habilidade:** move the skill to the core ([#24](https://github.com/jimmyandrade/harness/issues/24)) ([b4c6834](https://github.com/jimmyandrade/harness/commit/b4c6834a58c9f04885b2837a6a9e65a27babcf81))
* **resolver-comentarios-de-revisao:** handle the review comments of a pull request ([#28](https://github.com/jimmyandrade/harness/issues/28)) ([35f5144](https://github.com/jimmyandrade/harness/commit/35f5144a0d46ae32908a2d0379e8053aee8e5569))
* **revisar-habilidade:** move the skill to the core ([#18](https://github.com/jimmyandrade/harness/issues/18)) ([fc24a09](https://github.com/jimmyandrade/harness/commit/fc24a09a792a8abf0f9526c4d265de0816df2ab2))


### Bug Fixes

* **criar-habilidade:** keep diacritics and sentence case in the skill title ([#29](https://github.com/jimmyandrade/harness/issues/29)) ([af5b75e](https://github.com/jimmyandrade/harness/commit/af5b75e5ab0cfbbf11a88c5f7a7f7e9f96454fe6))
* **skill-graph:** keep only the graph in .agents/skills/README.md ([#25](https://github.com/jimmyandrade/harness/issues/25)) ([c459092](https://github.com/jimmyandrade/harness/commit/c4590922c9cc58edbef2b51e0adc436d20e04e54))
* start every Gherkin Given with "Dado que" ([#30](https://github.com/jimmyandrade/harness/issues/30)) ([2021751](https://github.com/jimmyandrade/harness/commit/202175119a6275a89ddada31a32606003c68876b))

## [0.2.0](https://github.com/jimmyandrade/harness/compare/v0.1.1...v0.2.0) (2026-10-02)


### Features

* **check-skill:** check the skills a skill relates to ([#14](https://github.com/jimmyandrade/harness/issues/14)) ([7dc69ec](https://github.com/jimmyandrade/harness/commit/7dc69ecdc0953aad1abe6e68d85ddb3bafe4694e))
* **skill-graph:** draw how skills relate in .agents/skills/README.md ([#17](https://github.com/jimmyandrade/harness/issues/17)) ([49bff62](https://github.com/jimmyandrade/harness/commit/49bff62d7e30b4935d58eb10bcdbeefef42618e2))

## [0.1.1](https://github.com/jimmyandrade/harness/compare/v0.1.0...v0.1.1) (2026-10-02)


### Bug Fixes

* **check-skill:** check only skills under .agents/skills ([#12](https://github.com/jimmyandrade/harness/issues/12)) ([813dbc9](https://github.com/jimmyandrade/harness/commit/813dbc98d1c95026f2ad8b7263e222d4b0f0779c))

## 0.1.0 (2026-10-02)


### Features

* add a shared Renovate preset ([#5](https://github.com/jimmyandrade/harness/issues/5)) ([14bd280](https://github.com/jimmyandrade/harness/commit/14bd280adf8ca484349b44a4849eceaffbc81bf8))
* add criar-commit and criar-pull-request as core skills ([#3](https://github.com/jimmyandrade/harness/issues/3)) ([2ca4e17](https://github.com/jimmyandrade/harness/commit/2ca4e1741bd7807790d938fd9016bc9cc969783f))
* add the core harness shared by every business ([c535dc3](https://github.com/jimmyandrade/harness/commit/c535dc305a34fe22936606612b89600e90d4fc50))
