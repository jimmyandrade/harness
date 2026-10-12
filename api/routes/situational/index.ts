/**
 * POST /v1/situational
 *
 * Register one situationally allowed term in the glossary of the text
 * language. category is an English word, such as punctuation. description is
 * the short name. when says when to use it. examples are situationally
 * allowed terms in the same file. A missing example is created as
 * situationally allowed.
 *
 * Run: node api/routes/situational/index.ts '{"language":"pt-BR","term":"…","category":"punctuation","description":"reticências","when":"...","examples":[]}'
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, registerSituational } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { situationalRequest } from "../../shared/schema.ts"

export const situationalRoute: Route = {
  method: "POST",
  path: "/v1/situational",
  limit: 65536,
  emptyMessage: "Provide the term.",
  handle(glossary, record) {
    const body = parseBody(situationalRequest, record)
    return registerSituational(glossary.directory, body.language, body)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const raw = args[0]
    if (raw === undefined) throw new InvalidGlossary("Provide the term.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
    const body = parseBody(situationalRequest, parsed)
    const registration = registerSituational(glossary, body.language, body)
    console.log(JSON.stringify(registration))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
