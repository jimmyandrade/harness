---
locale: en
---

# Typecheck with TypeScript 7

## Status

Accepted.

## Context

`typescript` is a development dependency. `tsc --noEmit` is the type check. The tests run with `node --test`, which strips types itself, so they do not use this package. Application code does not import it.

The repository started on the TypeScript 5.9 line. TypeScript 6 deprecates the options the native compiler will not carry, and TypeScript 7 removes them. TypeScript 7 is that native compiler. The language checks match TypeScript 6. The stable programmatic API of the compiler is not part of this release.

This `tsconfig.json` already sets `target` to ES2022, `module` and `moduleResolution` to NodeNext, `strict` and `verbatimModuleSyntax` to true, `noEmit` to true, and `types` to `node`. It does not set the options TypeScript 7 rejects, such as an ES5 target, `baseUrl`, or the old `node` module resolution.

## Decision

Typecheck this repository with TypeScript 7. The exact release is the `typescript` pin in `package.json`.

Do not import the `typescript` package from application code. The type check stays `tsc --noEmit`. The tests stay on the Node.js test runner.

Keep `types` set to `node`. TypeScript 7 otherwise loads no `@types` packages by default.

## Consequences

A pull request that moves the `typescript` pin runs `tsc --noEmit` and `npm test`. The tests do not prove the type check.

An option TypeScript 7 removed is a hard error. There is no `ignoreDeprecations` switch for those options.

The next major of TypeScript still waits for approval on the Dependency Dashboard, like every other major.
