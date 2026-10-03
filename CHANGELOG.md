# Changelog

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
