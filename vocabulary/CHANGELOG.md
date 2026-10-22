# Changelog

## [0.11.0](https://github.com/jimmyandrade/vocabulary/compare/v0.10.0...v0.11.0) (2026-10-22)


### ⚠ BREAKING CHANGES

* an update or an upsert that omits a field no longer clears it. Send the field empty to clear it.

### Features

* keep notes on a term ([#41](https://github.com/jimmyandrade/vocabulary/issues/41)) ([a9a7495](https://github.com/jimmyandrade/vocabulary/commit/a9a7495020c2a3fc6a6dba251382fdbcb737399f))


### Bug Fixes

* keep the stored fields on an update or an upsert ([#43](https://github.com/jimmyandrade/vocabulary/issues/43)) ([ad4c418](https://github.com/jimmyandrade/vocabulary/commit/ad4c418c52f755fbe8c0c1dbd2533e84832e84fc))

## [0.10.0](https://github.com/jimmyandrade/vocabulary/compare/v0.9.0...v0.10.0) (2026-10-20)


### ⚠ BREAKING CHANGES

* lookup, write results and stored rows return decided_by as an object { name, email?, url? } instead of a string.

### Features

* store decided_by as the people object of package.json ([#39](https://github.com/jimmyandrade/vocabulary/issues/39)) ([6147efc](https://github.com/jimmyandrade/vocabulary/commit/6147efca62064196c7af6eb3db496cd66e3d24af))

## [0.9.0](https://github.com/jimmyandrade/vocabulary/compare/v0.8.0...v0.9.0) (2026-10-20)


### ⚠ BREAKING CHANGES

* a write of a form that differs from a stored row only by an accent inserts a new row instead of updating the stored one, and lookup no longer returns duplicates or canonical.

### Features

* tell glossary terms apart by accents ([#37](https://github.com/jimmyandrade/vocabulary/issues/37)) ([3575ed7](https://github.com/jimmyandrade/vocabulary/commit/3575ed754fa7e9328d966cfc803154a8c02b28f4))

## [0.8.0](https://github.com/jimmyandrade/vocabulary/compare/v0.7.0...v0.8.0) (2026-10-20)


### ⚠ BREAKING CHANGES

* classify and lookup return one of five levels, so a stored situationally_allowed row reads as allowed_with_care with legacy_state. Registrations and new rows carry categories instead of category. The refusal messages for when and tags on a general rule changed. Run migrate to rewrite an existing glossary.

### Features

* rate glossary terms on five levels ([#34](https://github.com/jimmyandrade/vocabulary/issues/34)) ([8484226](https://github.com/jimmyandrade/vocabulary/commit/84842263d14ca924cb8409e92e23f45e019647bd))

## [0.7.0](https://github.com/jimmyandrade/vocabulary/compare/v0.6.2...v0.7.0) (2026-10-20)


### Features

* **redigir-com-tom-de-voz:** keep internal context out of messages and close with the next step ([#30](https://github.com/jimmyandrade/vocabulary/issues/30)) ([cc86054](https://github.com/jimmyandrade/vocabulary/commit/cc860544cadcfb7ccb6b137a4aff38c615c43ce9))

## [0.6.2](https://github.com/jimmyandrade/vocabulary/compare/v0.6.1...v0.6.2) (2026-10-20)


### Bug Fixes

* stop the plugin from starting a server that cannot run ([#31](https://github.com/jimmyandrade/vocabulary/issues/31)) ([9b71226](https://github.com/jimmyandrade/vocabulary/commit/9b712261fdde5f90ba3649e9a4e232da5a6fff88))

## [0.6.1](https://github.com/jimmyandrade/vocabulary/compare/v0.6.0...v0.6.1) (2026-10-18)


### Bug Fixes

* **redigir-com-tom-de-voz:** use the MCP tools when the CLI is not available ([#27](https://github.com/jimmyandrade/vocabulary/issues/27)) ([477e77d](https://github.com/jimmyandrade/vocabulary/commit/477e77decefd62e7883233a8649dbc50b7cfd0f9))

## [0.6.0](https://github.com/jimmyandrade/vocabulary/compare/v0.5.0...v0.6.0) (2026-10-18)


### Features

* mark case-sensitive terms and report casing mismatches ([#22](https://github.com/jimmyandrade/vocabulary/issues/22)) ([7b140ef](https://github.com/jimmyandrade/vocabulary/commit/7b140ef9964ef3a471d49fd64fae56e59e484314))

## [0.5.0](https://github.com/jimmyandrade/vocabulary/compare/v0.4.0...v0.5.0) (2026-10-15)


### Features

* tag situational terms and filter reads by tag ([#20](https://github.com/jimmyandrade/vocabulary/issues/20)) ([ace3f9b](https://github.com/jimmyandrade/vocabulary/commit/ace3f9b7736344ed2f0b88cbe437e731e006fd06))

## [0.4.0](https://github.com/jimmyandrade/vocabulary/compare/v0.3.1...v0.4.0) (2026-10-15)


### Features

* ship the voice skills as a Claude Code and Cursor plugin ([#18](https://github.com/jimmyandrade/vocabulary/issues/18)) ([039e164](https://github.com/jimmyandrade/vocabulary/commit/039e1643f4645166720ba52905548fcf3c4ebf2f))

## [0.3.1](https://github.com/jimmyandrade/vocabulary/compare/v0.3.0...v0.3.1) (2026-10-14)


### Bug Fixes

* **deps:** update dependency zod to v4.6.7 ([#15](https://github.com/jimmyandrade/vocabulary/issues/15)) ([6705cdf](https://github.com/jimmyandrade/vocabulary/commit/6705cdf4847d9827cf27285e65bbe036e9e3bee5))

## [0.3.0](https://github.com/jimmyandrade/vocabulary/compare/v0.2.0...v0.3.0) (2026-10-14)


### Features

* build dist on install instead of committing it ([#11](https://github.com/jimmyandrade/vocabulary/issues/11)) ([3ecd54e](https://github.com/jimmyandrade/vocabulary/commit/3ecd54ee58f4a513e02227246e08fe45451445a9))
* read the glossary from the command line and prefer it in the skills ([#12](https://github.com/jimmyandrade/vocabulary/issues/12)) ([1560123](https://github.com/jimmyandrade/vocabulary/commit/1560123339fb8aa6f9b50aaee1895e6aededd248))

## [0.2.0](https://github.com/jimmyandrade/vocabulary/compare/v0.1.0...v0.2.0) (2026-10-14)


### Features

* add the skills that register terms and write in the project voice ([#2](https://github.com/jimmyandrade/vocabulary/issues/2)) ([21d68c3](https://github.com/jimmyandrade/vocabulary/commit/21d68c3694d149fdc5da47df2c56b49f934764dc))
* extract the vocabulary API from jimmyandrade/harness ([08c8d3a](https://github.com/jimmyandrade/vocabulary/commit/08c8d3ae784b34c771783227ebac62763047694b))
* typecheck with TypeScript 7 ([#4](https://github.com/jimmyandrade/vocabulary/issues/4)) ([9c0596c](https://github.com/jimmyandrade/vocabulary/commit/9c0596ce013f628eec38a79b8618712a990652af))


### Bug Fixes

* start the MCP server from an installed copy ([#5](https://github.com/jimmyandrade/vocabulary/issues/5)) ([5e8511e](https://github.com/jimmyandrade/vocabulary/commit/5e8511ee192773c774a78948d3f3e2a1b7950704))
