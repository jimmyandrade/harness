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
 * enforce refuses it. One failure leaves the file unchanged.
 *
 * Run: node api/routes/terms/index.ts '{"language":"pt-BR","mode":"upsert","terms":[]}'
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, writeTerms } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { termsRequest } from "../../shared/schema.ts"

export const termsRoute: Route = {
  method: "POST",
  path: "/v1/terms",
  limit: 1048576,
  emptyMessage: "Provide the terms.",
  handle(glossary, record) {
    const body = parseBody(termsRequest, record)
    return writeTerms(glossary.directory, body.language, body.mode, body.terms, body.validation)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const raw = args[0]
    if (raw === undefined) throw new InvalidGlossary("Provide the terms.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
    const body = parseBody(termsRequest, parsed)
    const written = writeTerms(glossary, body.language, body.mode, body.terms, body.validation)
    console.log(JSON.stringify(written))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
