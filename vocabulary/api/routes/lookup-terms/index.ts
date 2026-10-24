/**
 * POST /v1/lookup-terms
 *
 * Read several terms or expressions in one call, so a plan of many terms is
 * checked without one request per term. A term of more than one word is read
 * as a whole, as in /v1/lookup. The response is the language and the results,
 * one per submitted term and in that order, each exactly what /v1/lookup
 * returns for it: exists is false when that concept is absent, and a stored
 * row comes back whole. Tags filter every term the way they do in /v1/lookup.
 * At most 100 terms.
 *
 * Run: node api/routes/lookup-terms/index.ts <language> <term>...
 */

import { fileURLToPath } from "node:url"

import { Glossary, InvalidGlossary } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { lookupTermsRequest } from "../../shared/schema.ts"
import { lookupTerms } from "../lookup/index.ts"

export const lookupTermsRoute: Route = {
  method: "POST",
  path: "/v1/lookup-terms",
  limit: 65536,
  emptyMessage: "Provide the terms.",
  handle(glossary, record) {
    const body = parseBody(lookupTermsRequest, record)
    return lookupTerms(glossary, body.language, body.terms, body.tags)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, ...terms] = args
    if (language === undefined || terms.length === 0) throw new InvalidGlossary("Provide the terms.")
    console.log(JSON.stringify(lookupTerms(new Glossary(glossary), language, terms)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
