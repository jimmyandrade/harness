---
locale: en
---

# Test with the Node.js test runner

## Status

Accepted

## Context

The TypeScript tests of this repository run with `node --test`, through `npm test`. There are 12 test files with 83 tests, for the vocabulary API, its CLI and MCP server, the glossary, and the Notion sync. Each one imports `test` from `node:test` and asserts with `node:assert`. None of them mocks a module: the tests build a temporary glossary or repository and call the code, or run the script, against it.

Node.js 24, the runtime of the scripts and the actions, runs the TypeScript files by stripping their types, so the tests need no build step and no transpiler. Its test runner has suites, hooks, function and timer mocks, watch mode, and coverage behind `--experimental-test-coverage`. Mocking a whole module is behind `--experimental-test-module-mocks`.

Vitest is the common choice for TypeScript tests. It adds module mocking, coverage thresholds and reports, a watch interface, and DOM environments.

Every business harness installs this repository as a development dependency, so each package here lengthens its `npm ci` and adds Renovate pull requests. The checker and the skill graph are Python, tested by their own scripts, so a JavaScript test runner would not cover them either way.

## Decision

Test the TypeScript code with the Node.js test runner. Do not add Vitest or another test framework.

A test file is `<name>.test.ts` next to the code it tests, imports from `node:test` and `node:assert`, and is picked up by the `npm test` glob. Prefer a temporary directory or a dependency passed in over mocking a module.

The Python scripts keep their `test_*.py` files.

## Consequences

`npm test` needs no package. `typescript` and `@types/node` stay only for the type check.

Coverage is not enforced. A report is available with `node --test --experimental-test-coverage`.

Revisit this decision when one of these becomes true: tests need to mock whole modules often, CI must fail below a coverage threshold, or a test needs a DOM. The `test` and `describe` calls of `node:test` map closely to Vitest, so a move is mechanical.
