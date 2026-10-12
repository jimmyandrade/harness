/**
 * POST /v1/classify
 *
 * Classify one word or expression. The lookup starts at query and moves once,
 * to allowed, forbidden, situationally_allowed, or not_registered.
 *
 * Run: node api/routes/classify/index.ts <language> <term>
 */

import { fileURLToPath } from "node:url"

import { Glossary, InvalidGlossary, lookup, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { classifyRequest, type Classification } from "../../shared/schema.ts"

export type { Classification }

export function classify(entries: readonly Entry[], submitted: string, language: string): Classification {
  const found = lookup(entries, submitted)
  const response: Classification = { from: "query", language, submitted: found.query, to: "not_registered" }
  if (found.entry === undefined) return response
  response.to = found.entry.state
  response.term = found.entry.term
  if (found.entry.state === "forbidden" && found.entry.alternative !== null) response.recommended = found.entry.alternative
  if (found.entry.state === "situationally_allowed" && found.entry.alternative !== null) {
    response.always_allowed = found.entry.alternative
  }
  return response
}

export function classifyTerm(glossary: Glossary, language: string, submitted: string): Classification {
  const { tag, entries } = glossary.entries(language)
  return classify(entries, submitted, tag)
}

export const classifyRoute: Route = {
  method: "POST",
  path: "/v1/classify",
  limit: 8192,
  emptyMessage: "Provide the term.",
  handle(glossary, record) {
    const body = parseBody(classifyRequest, record)
    return classifyTerm(glossary, body.language, body.term)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, term] = args
    if (language === undefined || term === undefined) throw new InvalidGlossary("Provide the term.")
    console.log(JSON.stringify(classifyTerm(new Glossary(glossary), language, term)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
