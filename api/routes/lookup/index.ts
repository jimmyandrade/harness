/**
 * POST /v1/lookup
 *
 * Read one term or expression. exists is false when that concept is absent.
 * Case and an accent that does not change the letter return the stored row.
 * A plural, a gender, and another word are their own rows.
 *
 * Run: node api/routes/lookup/index.ts <language> <term>
 */

import { fileURLToPath } from "node:url"

import { Glossary, InvalidGlossary, collapse, duplicateSignal, findConcept, lookup, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { classifyRequest } from "../../shared/schema.ts"

export type TermLookup = {
  language: string
  submitted: string
  exists: boolean
  term?: string
  state?: Entry["state"]
  alternative?: string
  category?: string
  description?: string
  substitution?: string
  rejected?: readonly string[]
  alternatives?: readonly string[]
  reason?: string
  when?: string
  examples?: readonly string[]
  related?: readonly string[]
  duplicates?: readonly string[]
  canonical?: string
}

export function lookupTerm(glossary: Glossary, language: string, submitted: string): TermLookup {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the term.")
  const { tag, entries } = glossary.entries(language)
  const signal = duplicateSignal(entries, query)
  if (signal !== undefined) {
    const exact = lookup(entries, query).entry
    const reported = { language: tag, submitted: query, exists: true, ...signal }
    if (exact === undefined) return reported
    return { ...reported, ...rowOf(exact) }
  }
  const found = findConcept(entries, query)
  if (found === undefined) return { language: tag, submitted: query, exists: false }
  return { language: tag, submitted: query, exists: true, ...rowOf(found) }
}

export const lookupRoute: Route = {
  method: "POST",
  path: "/v1/lookup",
  limit: 8192,
  emptyMessage: "Provide the term.",
  handle(glossary, record) {
    const body = parseBody(classifyRequest, record)
    return lookupTerm(glossary, body.language, body.term)
  },
}

function rowOf(entry: Entry): Omit<TermLookup, "language" | "submitted" | "exists"> {
  const row: Omit<TermLookup, "language" | "submitted" | "exists"> = { term: entry.term, state: entry.state }
  if (entry.alternative !== null) row.alternative = entry.alternative
  if (entry.category !== undefined) row.category = entry.category
  if (entry.description !== undefined) row.description = entry.description
  if (entry.substitution !== undefined) row.substitution = entry.substitution
  if (entry.rejected !== undefined) row.rejected = entry.rejected
  if (entry.alternatives !== undefined) row.alternatives = entry.alternatives
  if (entry.reason !== undefined) row.reason = entry.reason
  if (entry.when !== undefined) row.when = entry.when
  if (entry.examples !== undefined) row.examples = entry.examples
  if (entry.related !== undefined && entry.related.length > 0) row.related = entry.related
  return row
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, term] = args
    if (language === undefined || term === undefined) throw new InvalidGlossary("Provide the term.")
    console.log(JSON.stringify(lookupTerm(new Glossary(glossary), language, term)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
