/**
 * POST /v1/lookup
 *
 * Read one term or expression. exists is false when that concept is absent.
 * Another case returns the stored row. An accent, a plural, a gender, and
 * another word are their own rows. Given tags, a row
 * tagged only for another speaker, event, or channel reads as absent, and a
 * tag in allowed_in or forbidden_in changes state. base_state then keeps the
 * level of the row. A spelling may keep one row per set of tags: the rows whose
 * tags meet the read win over the row without tags, and a read without tags
 * returns the row without tags. When more than one row wins, the fields are the
 * first one, and rows lists every one in the order of the file. A row stored
 * with a deprecated state returns legacy_state. A row
 * with case_sensitive also returns case_matches, false when the submitted
 * casing differs from the stored term.
 *
 * Run: node api/routes/lookup/index.ts <language> <term>
 */

import { fileURLToPath } from "node:url"

import { Glossary, InvalidGlossary, applicable, caseMatches, collapse, effectiveState, rowsFor, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { lookupRequest, type Person } from "../../shared/schema.ts"

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
  decided_by?: Person
  decided_at?: string
  source?: string
  notes?: string
  case_sensitive?: true
  stop_word?: true
  case_matches?: boolean
  rows?: readonly TermRow[]
}

/** One stored row of a spelling, as a lookup returns it. */
export type TermRow = Omit<TermLookup, "language" | "submitted" | "exists" | "rows">

export function lookupTerm(glossary: Glossary, language: string, submitted: string, tags: readonly string[] = []): TermLookup {
  const { tag, entries: stored } = glossary.entries(language)
  return lookupIn(tag, applicable(stored, tags), submitted, tags)
}

/**
 * Read several terms or expressions in one pass, in the order submitted. Each
 * result is what lookupTerm returns for that term, and a repeated term gets
 * its own result. The glossary is read once.
 */
export function lookupTerms(
  glossary: Glossary,
  language: string,
  submitted: readonly string[],
  tags: readonly string[] = [],
): { language: string; results: TermLookup[] } {
  const { tag, entries: stored } = glossary.entries(language)
  const entries = applicable(stored, tags)
  return { language: tag, results: submitted.map((term) => lookupIn(tag, entries, term, tags)) }
}

function lookupIn(tag: string, entries: readonly Entry[], submitted: string, tags: readonly string[]): TermLookup {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the term.")
  const rows = rowsFor(entries, query, tags).map((entry) => ({ ...rowOf(entry, tags), ...casingOf(entry, query) }))
  const [first] = rows
  if (first === undefined) return { language: tag, submitted: query, exists: false }
  const found: TermLookup = { language: tag, submitted: query, exists: true, ...first }
  if (rows.length > 1) found.rows = rows
  return found
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

function rowOf(entry: Entry, tags: readonly string[]): TermRow {
  const row: TermRow = { term: entry.term }
  if (entry.stateless !== true) {
    const state = effectiveState(entry, tags)
    row.state = state
    if (state !== entry.state) row.base_state = entry.state
  }
  if (entry.stopWord === true) row.stop_word = true
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
  if (entry.decidedAt !== undefined) row.decided_at = entry.decidedAt
  if (entry.source !== undefined) row.source = entry.source
  if (entry.notes !== undefined) row.notes = entry.notes
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
