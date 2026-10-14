# Changelog

## [0.28.0](https://github.com/jimmyandrade/harness/compare/v0.27.0...v0.28.0) (2026-10-14)


### Features

* **definir-ativo-imobilizado:** move the skill to the core ([#174](https://github.com/jimmyandrade/harness/issues/174)) ([620de08](https://github.com/jimmyandrade/harness/commit/620de083565bf1fb871ebcf61fb00b45673c50a1))
* **definir-lancamento:** move the skill to the core ([#172](https://github.com/jimmyandrade/harness/issues/172)) ([5624d9d](https://github.com/jimmyandrade/harness/commit/5624d9dc2e0d8480083a20d41f4616cfc0f3beb5))
* **definir-planejamento-financeiro:** move the skill to the core ([#177](https://github.com/jimmyandrade/harness/issues/177)) ([4bb4301](https://github.com/jimmyandrade/harness/commit/4bb43018b50d3c7c47afa8288974589153b53dc8))
* **gerenciar-estoque:** move the skill to the core ([#173](https://github.com/jimmyandrade/harness/issues/173)) ([8af3d08](https://github.com/jimmyandrade/harness/commit/8af3d087be78888d50c5be1f373d29ee790720fa))
* **lancar-despesa:** move the skill to the core ([#171](https://github.com/jimmyandrade/harness/issues/171)) ([89fb55c](https://github.com/jimmyandrade/harness/commit/89fb55c8e313dda2ea1df148486738c2aa2b7db2))
* **registrar-ciclo-do-ativo:** move the skill to the core ([#175](https://github.com/jimmyandrade/harness/issues/175)) ([ddd7d54](https://github.com/jimmyandrade/harness/commit/ddd7d5404c91858a5bc6e7e40996011915f14bc2))
* **revisar-financas:** move the skill to the core ([#179](https://github.com/jimmyandrade/harness/issues/179)) ([b1309f0](https://github.com/jimmyandrade/harness/commit/b1309f0a5e574cf0103d7af425c6a78d391ad858))

## [0.27.0](https://github.com/jimmyandrade/harness/compare/v0.26.0...v0.27.0) (2026-10-14)


### Features

* **criar-ideia-de-conteudo:** move the skill to the core ([#169](https://github.com/jimmyandrade/harness/issues/169)) ([691ebec](https://github.com/jimmyandrade/harness/commit/691ebeca6415c0f5881113a0a81b119ebe0170b2))
* **reconhecer-imagem:** move the skill to the core ([#168](https://github.com/jimmyandrade/harness/issues/168)) ([8adad0e](https://github.com/jimmyandrade/harness/commit/8adad0ea66fe5fdedcab4997d0d204de97ebe745))

## [0.26.0](https://github.com/jimmyandrade/harness/compare/v0.25.0...v0.26.0) (2026-10-14)


### Features

* check that every pin of the core names the same tag ([#166](https://github.com/jimmyandrade/harness/issues/166)) ([01a7757](https://github.com/jimmyandrade/harness/commit/01a7757a928d6cfb2b4c498646ad164cf4f3ddd5))

## [0.25.0](https://github.com/jimmyandrade/harness/compare/v0.24.0...v0.25.0) (2026-10-14)


### ⚠ BREAKING CHANGES

* URL do calendário, País do calendário, and Uso da URL do calendário are gone. A project sets Fontes de calendário instead, with "URL" and "Código do país" in each item, and Uso das fontes de calendário when it differs from the default.

### Features

* list calendar sources, each with its own country code ([#164](https://github.com/jimmyandrade/harness/issues/164)) ([8ef5866](https://github.com/jimmyandrade/harness/commit/8ef58666a76c47bef0ede0a89f9eaea4884b1aaf))

## [0.24.0](https://github.com/jimmyandrade/harness/compare/v0.23.1...v0.24.0) (2026-10-14)


### ⚠ BREAKING CHANGES

* **criar-oportunidade:** criar-oportunidade 0.15.0 no longer rejects dates before a fixed year. A harness that wants a cutoff sets "Ano mínimo da edição" in its project instructions.
* **procurar-oportunidade:** procurar-oportunidade 0.5.0 no longer hands a confirmed order to a registration skill by default. A harness that wants it sets "Habilidade do pedido confirmado" in its project instructions.

### Features

* add the Considerar grupos de oportunidades parameter ([#147](https://github.com/jimmyandrade/harness/issues/147)) ([98c2feb](https://github.com/jimmyandrade/harness/commit/98c2feb6776dc86616ca799ff9574ebdda2ba8a4))
* **criar-oportunidade:** move the skill to the core ([#148](https://github.com/jimmyandrade/harness/issues/148)) ([9a33119](https://github.com/jimmyandrade/harness/commit/9a33119cc5bd6e2c5af3b6b1677a2862189ab18b))
* **criar-oportunidade:** set the cutoff by date, after the business founding date ([9a33119](https://github.com/jimmyandrade/harness/commit/9a33119cc5bd6e2c5af3b6b1677a2862189ab18b))
* **definir-data-significativa:** move the skill to the core ([#155](https://github.com/jimmyandrade/harness/issues/155)) ([f38fc76](https://github.com/jimmyandrade/harness/commit/f38fc761c8b2ffdae328f31d7d517110779da451))
* **definir-empresa:** move the skill to the core ([#158](https://github.com/jimmyandrade/harness/issues/158)) ([74857bb](https://github.com/jimmyandrade/harness/commit/74857bb66f2cd4b64285c8eefe41446b26d3953e))
* **definir-grafia:** move the skill to the core ([#161](https://github.com/jimmyandrade/harness/issues/161)) ([dd05b06](https://github.com/jimmyandrade/harness/commit/dd05b06b80226b31d3c0f34cf5474691e29479ff))
* **definir-grupo-de-oportunidades:** move the skill to the core ([#146](https://github.com/jimmyandrade/harness/issues/146)) ([a2d2c0f](https://github.com/jimmyandrade/harness/commit/a2d2c0f0289703839b98c908839deb40f666029a))
* **definir-inscricao:** move the skill to the core ([#149](https://github.com/jimmyandrade/harness/issues/149)) ([e96c2e0](https://github.com/jimmyandrade/harness/commit/e96c2e0d07f1f4e57eb0b1555a740ffb5c37d75a))
* **definir-perfil-social:** move the skill to the core ([#159](https://github.com/jimmyandrade/harness/issues/159)) ([1195b70](https://github.com/jimmyandrade/harness/commit/1195b70b5668c1edb34502036039e9257996ab7c))
* **definir-pessoa:** move the skill to the core ([#160](https://github.com/jimmyandrade/harness/issues/160)) ([abfd925](https://github.com/jimmyandrade/harness/commit/abfd92529acf3c9c22946d901a214ec6284babc1))
* **definir-tarefa:** move the skill to the core ([183b7a3](https://github.com/jimmyandrade/harness/commit/183b7a31c2fcd02eab3b5aa02cf1a7e65f631420))
* **definir-tarefa:** move the skill to the core ([#153](https://github.com/jimmyandrade/harness/issues/153)) ([183b7a3](https://github.com/jimmyandrade/harness/commit/183b7a31c2fcd02eab3b5aa02cf1a7e65f631420))
* **definir-tarefa:** read the RACI roles of the task list ([183b7a3](https://github.com/jimmyandrade/harness/commit/183b7a31c2fcd02eab3b5aa02cf1a7e65f631420))
* **identificar-duplicata:** move the skill to the core ([#156](https://github.com/jimmyandrade/harness/issues/156)) ([fad1716](https://github.com/jimmyandrade/harness/commit/fad1716c352c0ccee907bb478fd5e84a71fdb920))
* **mesclar-registro:** move the skill to the core ([#157](https://github.com/jimmyandrade/harness/issues/157)) ([be3f98a](https://github.com/jimmyandrade/harness/commit/be3f98aed41eb667b9cb42c31b20bb834fd369f5))
* **procurar-data-significativa:** move the skill to the core ([#154](https://github.com/jimmyandrade/harness/issues/154)) ([05cb01b](https://github.com/jimmyandrade/harness/commit/05cb01bf71d6c3f2c57be1efbc4b5f3436ba9295))
* **procurar-email:** move the skill to the core ([#151](https://github.com/jimmyandrade/harness/issues/151)) ([9221947](https://github.com/jimmyandrade/harness/commit/92219471e3d495decb9c0dfee230e770caa6420f))
* **procurar-inscricao:** move the skill to the core ([#150](https://github.com/jimmyandrade/harness/issues/150)) ([dc2eafd](https://github.com/jimmyandrade/harness/commit/dc2eafdad3b8cddb7009d9047e21ba7df6555709))
* **procurar-oportunidade:** move the skill to the core ([#145](https://github.com/jimmyandrade/harness/issues/145)) ([bbd3dbe](https://github.com/jimmyandrade/harness/commit/bbd3dbe0207f281863d04b4f4e1335ea71dc28d5))
* **procurar-tarefa:** move the skill to the core ([#152](https://github.com/jimmyandrade/harness/issues/152)) ([347874f](https://github.com/jimmyandrade/harness/commit/347874f2ffb85046336660261470aac8a533027b))

## [0.23.1](https://github.com/jimmyandrade/harness/compare/v0.23.0...v0.23.1) (2026-10-14)


### Bug Fixes

* do not crash check-skill on a staged binary file ([#143](https://github.com/jimmyandrade/harness/issues/143)) ([71f9df3](https://github.com/jimmyandrade/harness/commit/71f9df3754b4bc97cf93cb4000ccd21caef812ee))

## [0.23.0](https://github.com/jimmyandrade/harness/compare/v0.22.0...v0.23.0) (2026-10-14)


### Features

* publish the plugin to Codex and Cursor ([#140](https://github.com/jimmyandrade/harness/issues/140)) ([4a7cacb](https://github.com/jimmyandrade/harness/commit/4a7cacb87637a64374863058148b92dadb3ae688))

## [0.22.0](https://github.com/jimmyandrade/harness/compare/v0.21.0...v0.22.0) (2026-10-14)


### Features

* leave skills with metadata.internal true out of the Notion sync ([#134](https://github.com/jimmyandrade/harness/issues/134)) ([9f83005](https://github.com/jimmyandrade/harness/commit/9f83005f14b6c7cadcdb45650f78d1bde43a89fc))

## [0.21.0](https://github.com/jimmyandrade/harness/compare/v0.20.0...v0.21.0) (2026-10-14)


### Features

* name branches after the Conventional Commits type ([#131](https://github.com/jimmyandrade/harness/issues/131)) ([d36c0d5](https://github.com/jimmyandrade/harness/commit/d36c0d5af6c23fca731b398aa7e6909b4dbfdad2))

## [0.20.0](https://github.com/jimmyandrade/harness/compare/v0.19.0...v0.20.0) (2026-10-14)


### Features

* move vocabulary pins with Renovate as soon as a release exists ([#129](https://github.com/jimmyandrade/harness/issues/129)) ([7a6a1b0](https://github.com/jimmyandrade/harness/commit/7a6a1b0c0db2f8523c1f08be2eec9f449cdb5b9f))

## [0.19.0](https://github.com/jimmyandrade/harness/compare/v0.18.2...v0.19.0) (2026-10-13)


### ⚠ BREAKING CHANGES

* the vocabulary API, CLI, and MCP server are no longer part of this package or the core plugin. Install jimmyandrade/vocabulary and point the host at its server.

### Features

* move the vocabulary API to its own repository ([#123](https://github.com/jimmyandrade/harness/issues/123)) ([8ddd2eb](https://github.com/jimmyandrade/harness/commit/8ddd2eb457d171bcab8cfc60b864268b260387d3))

## [0.18.2](https://github.com/jimmyandrade/harness/compare/v0.18.1...v0.18.2) (2026-10-13)


### Bug Fixes

* **deps:** update dependency @notionhq/client to v5.27.0 ([#122](https://github.com/jimmyandrade/harness/issues/122)) ([6f05001](https://github.com/jimmyandrade/harness/commit/6f05001bbb01412e1bcae791c3bb12377a07765a))

## [0.18.1](https://github.com/jimmyandrade/harness/compare/v0.18.0...v0.18.1) (2026-10-13)


### Bug Fixes

* **deps:** update dependency zod to v4.6.7 ([#120](https://github.com/jimmyandrade/harness/issues/120)) ([c2d88ca](https://github.com/jimmyandrade/harness/commit/c2d88ca22800147c131de2609566a5d269319d40))

## [0.18.0](https://github.com/jimmyandrade/harness/compare/v0.17.1...v0.18.0) (2026-10-13)


### Features

* evolve and describe the project instructions like a skill ([#117](https://github.com/jimmyandrade/harness/issues/117)) ([53341fb](https://github.com/jimmyandrade/harness/commit/53341fbc8088bb78b16c0aa50189e2a3a8c409cc))

## [0.17.1](https://github.com/jimmyandrade/harness/compare/v0.17.0...v0.17.1) (2026-10-13)


### Bug Fixes

* run the folder icon hook in the harness virtual environment ([#124](https://github.com/jimmyandrade/harness/issues/124)) ([8c5fb5d](https://github.com/jimmyandrade/harness/commit/8c5fb5d5da344cb55610c5c65e50f0d89deae5a7))
* write the Notion notice of the instructions template as a heading ([#116](https://github.com/jimmyandrade/harness/issues/116)) ([9c43111](https://github.com/jimmyandrade/harness/commit/9c43111dde0820467d45c7b59a45aa91b20ff4cd))

## [0.17.0](https://github.com/jimmyandrade/harness/compare/v0.16.0...v0.17.0) (2026-10-06)


### ⚠ BREAKING CHANGES

* move the parameters of each AGENTS.md from the yaml block under "## Parâmetros das habilidades" to metadata.parameters in its frontmatter, indented under metadata, and add description and metadata.version to the frontmatter of a business harness.

### Features

* publish the project instructions to Notion from the AGENTS.md frontmatter ([#114](https://github.com/jimmyandrade/harness/issues/114)) ([4be623e](https://github.com/jimmyandrade/harness/commit/4be623ecc19a115b38b9fb351f5cfb288030d681))

## [0.16.0](https://github.com/jimmyandrade/harness/compare/v0.15.0...v0.16.0) (2026-10-06)


### Features

* **project-parameters:** let a skill script read its own parameters ([#112](https://github.com/jimmyandrade/harness/issues/112)) ([c782340](https://github.com/jimmyandrade/harness/commit/c782340c5f3b1bb7446ad093e77d3f6d97f08d83))

## [0.15.0](https://github.com/jimmyandrade/harness/compare/v0.14.0...v0.15.0) (2026-10-06)


### ⚠ BREAKING CHANGES

* .agents/config.yml is no longer read. Move its values to the Global entry of the parameter block in AGENTS.md, under these keys: limits.skill_words -> "Palavras", limits.skill_lines -> "Linhas", limits.skill_catalog_tokens -> "Tokens do catálogo", limits.skill_body_tokens -> "Tokens do corpo", organization.name -> "Organização", license.required -> "Licença obrigatória" ("sim" or "não"), locale.gherkin -> "Idioma do Gherkin", mermaid.flowchart_direction -> "Direção dos fluxogramas", notion.page_icon_name -> "Ícone das páginas no Notion", notion.page_icon_color -> "Cor do ícone das páginas no Notion", macos.folder_icon_symbol -> "Símbolo da pasta no macOS". locale.skill, locale.commit_subject, and recognition.languages are dropped; the commit language is "Idioma da mensagem de commit". A harness needs the parameter block, or the check fails.

### Features

* **definir-instrucoes-do-projeto:** learn from the first real run ([#107](https://github.com/jimmyandrade/harness/issues/107)) ([7be2952](https://github.com/jimmyandrade/harness/commit/7be2952afe2949caabaf5487a768387f41b2fc41))
* read every harness setting from the AGENTS.md parameter block ([#109](https://github.com/jimmyandrade/harness/issues/109)) ([45e0c1d](https://github.com/jimmyandrade/harness/commit/45e0c1d259cd37394514a4f243b7675ce674d9f5))

## [0.14.0](https://github.com/jimmyandrade/harness/compare/v0.13.1...v0.14.0) (2026-10-06)


### Features

* **definir-instrucoes-do-projeto:** write and review the project instructions ([#104](https://github.com/jimmyandrade/harness/issues/104)) ([49da52c](https://github.com/jimmyandrade/harness/commit/49da52c9d655457b8bb49db796f4a29f3e58266a))

## [0.13.1](https://github.com/jimmyandrade/harness/compare/v0.13.0...v0.13.1) (2026-10-06)


### Bug Fixes

* **check-skill:** run the instructions tests and measure an unclosed frontmatter ([#102](https://github.com/jimmyandrade/harness/issues/102)) ([0fb555d](https://github.com/jimmyandrade/harness/commit/0fb555d5a7fdc740701e8a145be1ca2d9ffe2c81))

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
