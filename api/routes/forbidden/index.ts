/**
 * POST /v1/forbidden
 *
 * Register one forbidden term in the glossary of the text language. category
 * is an English word, such as punctuation. description is the short name.
 * substitution says what to use instead. rejected and alternatives are terms
 * in the same file. A missing rejected example is created as forbidden. A
 * missing alternative is created as allowed.
 *
 * Run: node api/routes/forbidden/index.ts '{"language":"pt-BR","term":"—","category":"punctuation","description":"Travessão","substitution":"...","rejected":[],"alternatives":[]}'
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, registerForbidden } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { forbiddenRequest } from "../../shared/schema.ts"

export const forbiddenRoute: Route = {
  method: "POST",
  path: "/v1/forbidden",
  limit: 65536,
  emptyMessage: "Provide the term.",
  handle(glossary, record) {
    const body = parseBody(forbiddenRequest, record)
    return registerForbidden(glossary.directory, body.language, body)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const raw = args[0]
    if (raw === undefined) throw new InvalidGlossary("Provide the term.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
    const body = parseBody(forbiddenRequest, parsed)
    const registration = registerForbidden(glossary, body.language, body)
    console.log(JSON.stringify(registration))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
