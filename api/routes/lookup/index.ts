/**
 * POST /v1/lookup
 *
 * Read one term or expression. exists is false when that concept is absent.
 * Case and an accent that does not change the letter return the stored row.
 * A plural, a gender, and another word are their own rows. Given tags, a row
 * tagged only for another speaker, event, or channel reads as absent, and a
 * tag in allowed_in or forbidden_in changes state. base_state then keeps the
 * level of the row. A row stored with a deprecated state returns legacy_state. A row
 * with case_sensitive also returns case_matches, false when the submitted
 * casing differs from the stored term.
 *
 * Run: node api/routes/lookup/index.ts <language> <term>
 */

import { fileURLToPath } from "node:url"

import { Glossary, InvalidGlossary, applicable, caseMatches, collapse, duplicateSignal, effectiveState, findConcept, lookup, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { lookupRequest } from "../../shared/schema.ts"

export type TermLookup = {
  language: string
  submitted: string
  exists: boolean
  term?: string
  state?: Entry["state"]
  base_state?: Entry["state"]
  legacy_state?: Entry["legacyState"]
  alternative?: string
  categories?: readonly string[]
  description?: string
  substitution?: string
  rejected?: readonly string[]
  alternatives?: readonly string[]
  reason?: string
  when?: string
  examples?: readonly string[]
  related?: readonly string[]
  tags?: readonly string[]
  allowed_in?: readonly string[]
  forbidden_in?: readonly string[]
  decided_by?: string
  source?: string
  case_sensitive?: true
  case_matches?: boolean
  duplicates?: readonly string[]
  canonical?: string
}

export function lookupTerm(glossary: Glossary, language: string, submitted: string, tags: readonly string[] = []): TermLookup {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the term.")
  const { tag, entries: stored } = glossary.entries(language)
  const entries = applicable(stored, tags)
  const signal = duplicateSignal(entries, query)
  if (signal !== undefined) {
    const exact = lookup(entries, query).entry
    const reported = { language: tag, submitted: query, exists: true, ...signal }
    if (exact === undefined) return reported
    return { ...reported, ...rowOf(exact, tags), ...casingOf(exact, query) }
  }
  const found = findConcept(entries, query)
  if (found === undefined) return { language: tag, submitted: query, exists: false }
  return { language: tag, submitted: query, exists: true, ...rowOf(found, tags), ...casingOf(found, query) }
}

export const lookupRoute: Route = {
  method: "POST",
  path: "/v1/lookup",
  limit: 8192,
  emptyMessage: "Provide the term.",
  handle(glossary, record) {
    const body = parseBody(lookupRequest, record)
    return lookupTerm(glossary, body.language, body.term, body.tags)
  },
}

function rowOf(entry: Entry, tags: readonly string[]): Omit<TermLookup, "language" | "submitted" | "exists"> {
  const state = effectiveState(entry, tags)
  const row: Omit<TermLookup, "language" | "submitted" | "exists"> = { term: entry.term, state }
  if (state !== entry.state) row.base_state = entry.state
  if (entry.legacyState !== undefined) row.legacy_state = entry.legacyState
  if (entry.alternative !== null) row.alternative = entry.alternative
  if (entry.categories !== undefined && entry.categories.length > 0) row.categories = entry.categories
  if (entry.description !== undefined) row.description = entry.description
  if (entry.substitution !== undefined) row.substitution = entry.substitution
  if (entry.rejected !== undefined) row.rejected = entry.rejected
  if (entry.alternatives !== undefined) row.alternatives = entry.alternatives
  if (entry.reason !== undefined) row.reason = entry.reason
  if (entry.when !== undefined) row.when = entry.when
  if (entry.examples !== undefined) row.examples = entry.examples
  if (entry.related !== undefined && entry.related.length > 0) row.related = entry.related
  if (entry.tags !== undefined && entry.tags.length > 0) row.tags = entry.tags
  if (entry.allowedIn !== undefined && entry.allowedIn.length > 0) row.allowed_in = entry.allowedIn
  if (entry.forbiddenIn !== undefined && entry.forbiddenIn.length > 0) row.forbidden_in = entry.forbiddenIn
  if (entry.decidedBy !== undefined) row.decided_by = entry.decidedBy
  if (entry.source !== undefined) row.source = entry.source
  return row
}

function casingOf(entry: Entry, submitted: string): Pick<TermLookup, "case_sensitive" | "case_matches"> {
  if (entry.caseSensitive !== true) return {}
  return { case_sensitive: true, case_matches: caseMatches(entry, submitted) }
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
