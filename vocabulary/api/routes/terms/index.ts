/**
 * POST /v1/terms
 *
 * Insert and update glossary rows for one language in a single write.
 * mode is insert, update, or upsert. insert writes a term that is absent and
 * leaves a term that is already in the file. update changes a term that is
 * present and leaves a term that is absent. upsert writes every term. An update
 * or an upsert of a stored term keeps every field the call does not send, and a
 * field sent empty, as "" or [], is cleared. A term not found by its spelling
 * is found by its source. Each term carries state
 * and the fields of that level. validation is optional, warn, or enforce: warn
 * writes a term without an expected field and lists it in incomplete, and
 * enforce refuses it. One failure leaves the file unchanged, and a refusal
 * lists every problem of the batch with its term, not only the first. With
 * dry_run true nothing is written: the response lists what would be inserted,
 * updated, left unchanged, skipped, or incomplete, and what would be refused.
 *
 * Run: node api/routes/terms/index.ts '{"language":"pt-BR","mode":"upsert","terms":[]}'
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, writeBatch } from "../../shared/glossary.ts"
import type { Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"

export const termsRoute: Route = {
  method: "POST",
  path: "/v1/terms",
  limit: 1048576,
  emptyMessage: "Provide the terms.",
  handle(glossary, record) {
    return writeBatch(glossary.directory, record)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const raw = args[0]
    if (raw === undefined) throw new InvalidGlossary("Provide the terms.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
    console.log(JSON.stringify(writeBatch(glossary, parsed)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
