/**
 * Brand glossary for one language of the text.
 *
 * Each language is a UTF-8 JSON file in the glossary directory of the project,
 * named with its BCP 47 tag: pt-BR.json, en.json, de.json, ja.json, and fr.json.
 * Another language is another file. A lookup opens only the file for the
 * language of the text. The directory is HARNESS_GLOSSARY_DIR, or
 * .agents/glossary/ under HARNESS_ROOT, or under the working directory.
 *
 * The file is an object. Each key is the term. Each value has state and the
 * fields of that row. The key is not repeated inside the value. The keys stay
 * in alphabetical order. A spelling may keep more than one row, one per set of
 * tags, as ADR 0017 decides: its value is then a list of rows, the row without
 * tags first. A spelling with one row stays an object, so an older file reads
 * and writes back unchanged. state is one of five levels, from the strictest:
 * forbidden, strongly_discouraged, discouraged, allowed_with_care, and
 * allowed, as ADR 0010 decides. The deprecated situationally_allowed reads as
 * allowed_with_care and stays in the file until migrate rewrites it.
 * alternative is the recommended term of an avoided row, and the
 * always-allowed term of an allowed_with_care row. An allowed row omits it.
 *
 * categories are English words. A row with the deprecated category reads it
 * as a list of one. description, reason, substitution, and when are optional
 * while a glossary migrates. examples, rejected, alternatives, and related name
 * other terms in the same file. tags say where the row exists. allowed_in and
 * forbidden_in change the level when a read carries one of those tags.
 * decided_by is who decided, as the people fields of package.json: an object
 * with name and optionally email and url. A plain string still reads as the
 * name, and the next write stores it as an object. decided_at is the day of
 * that decision, as an ISO 8601 date, YYYY-MM-DD. source is where the row
 * came from. Any row
 * may keep case_sensitive: true, for a brand spelling such as "iPhone". Its
 * key keeps that casing. A read still finds it in another case and says the
 * casing does not match.
 *
 * writeTerms searches before it writes. Only case folds: an accent is part of
 * the spelling, as ADR 0011 decides, so roles and rolês are two terms. A
 * plural, a gender, and another word for the same idea each keep their own row
 * and their own state. A row is its spelling and its set of tags: a call that
 * sends tags writes the row with that same set, and tags: [] or an insert
 * without tags writes the row without tags. An update or an upsert that omits
 * tags writes the only row of the spelling, and keeps its tags. update never
 * adds a row, so with tags that no row has, it changes the tags of the only
 * row. A new term is stored
 * in lowercase, unless it is written with case_sensitive, which keeps its
 * casing as given. insert leaves a row that is already in the file.
 * update leaves a term that is absent. An update or an upsert of a term that is
 * in the file keeps every field the call does not send, so a call that sends
 * only a reason does not erase the description or the notes. A field sent
 * empty, as "" or [], is cleared. A row whose fields already match is
 * unchanged. A failure leaves the file unchanged.
 *
 * An English word used in Portuguese is a row in pt-BR.json. Its state there
 * can differ from the row in en.json.
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import {
  EXPECTED,
  MISSING_FIELD,
  collapse,
  glossaryFileSchema,
  isLegacyState,
  levelOf,
  samePerson,
  stateSchema,
  readTermsRequest,
  termIssues,
  type AllowedRequest,
  type BulkTerm,
  type ForbiddenRequest,
  type LegacyState,
  type Migration,
  type Person,
  type Problem,
  type SituationalRequest,
  type State,
  type TermRegistration,
  type TermsWrite,
  type ExpectedField,
  type PatchableField,
  type Validation,
  type WriteMode,
} from "./schema.ts"

export type { Migration, State, TermRegistration, TermsWrite }
export { collapse }
export const STATES = new Set(stateSchema.options)
const LANGUAGE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/
export function glossaryDirectory(env: Record<string, string | undefined>, cwd: string): string {
  if (env.HARNESS_GLOSSARY_DIR) return resolve(env.HARNESS_GLOSSARY_DIR)
  return resolve(env.HARNESS_ROOT || cwd, ".agents", "glossary")
}

export const defaultDirectory = glossaryDirectory(process.env, process.cwd())

export class InvalidGlossary extends Error {}

/**
 * A batch refused for one or more reasons. message is the reason alone when
 * there is one, and a list of every reason, each with its term, when there are
 * several. problems keeps them apart for a caller that reads them.
 */
export class InvalidTerms extends InvalidGlossary {
  readonly problems: readonly Problem[]

  constructor(problems: readonly Problem[]) {
    super(describeProblems(problems))
    this.problems = problems
  }
}

function describeProblems(problems: readonly Problem[]): string {
  const [only] = problems
  if (problems.length === 1 && only !== undefined) return only.message
  const lines = problems.map(({ term, message }) =>
    term === undefined || message.includes(JSON.stringify(term)) ? `- ${message}` : `- ${JSON.stringify(term)}: ${message}`,
  )
  return [`${problems.length} problems. The batch was not written.`, ...lines].join("\n")
}

export type Entry = {
  term: string
  state: State
  legacyState?: LegacyState
  alternative: string | null
  order: readonly [string, string]
  categories?: readonly string[]
  legacyCategory?: true
  description?: string
  substitution?: string
  rejected?: readonly string[]
  alternatives?: readonly string[]
  reason?: string
  when?: string
  examples?: readonly string[]
  related?: readonly string[]
  tags?: readonly string[]
  allowedIn?: readonly string[]
  forbiddenIn?: readonly string[]
  decidedBy?: Person
  decidedAt?: string
  source?: string
  stopWord?: true
  /** A stop word stored without a level. It reads as allowed inside the engine. */
  stateless?: true
  notes?: string
  caseSensitive?: boolean
}

export function canonicalLanguage(tag: string): string {
  const raw = tag.trim()
  if (!LANGUAGE.test(raw)) throw new InvalidGlossary("Unknown language.")
  const parts = raw.split("-")
  const canonical = [parts[0].toLowerCase()]
  for (const part of parts.slice(1)) {
    if (part.length === 2 && isLetters(part)) canonical.push(part.toUpperCase())
    else if (part.length === 4 && isLetters(part)) canonical.push(part[0].toUpperCase() + part.slice(1).toLowerCase())
    else canonical.push(part.toLowerCase())
  }
  return canonical.join("-")
}

function glossaryPath(directory: string, tag: string): string {
  const root = resolve(directory)
  const path = resolve(root, `${tag}.json`)
  if (dirname(path) !== root) throw new InvalidGlossary("Unknown language.")
  return path
}

export function glossaryFile(directory: string, language: string): string {
  const tag = canonicalLanguage(language)
  const path = glossaryPath(directory, tag)
  if (!existsSync(path)) throw new InvalidGlossary(`No glossary for ${tag} yet. Create it with init.`)
  return path
}

/**
 * Create the empty glossary of one language, and its directory when missing.
 * An existing glossary stays as it is. A new language is a decision, so no
 * write creates it on the way: a typo in the tag would start a glossary.
 */
export function initGlossary(directory: string, language: string): { language: string; created: boolean } {
  const tag = canonicalLanguage(language)
  const path = glossaryPath(directory, tag)
  if (existsSync(path)) return { language: tag, created: false }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, serialize([]), { encoding: "utf8", flag: "wx" })
  return { language: tag, created: true }
}

export function load(text: string): Entry[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new InvalidGlossary("The glossary is not JSON.")
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new InvalidGlossary("The glossary is not an object.")
  }
  const result = glossaryFileSchema.safeParse(parsed)
  if (!result.success) throw new InvalidGlossary(result.error.issues[0]?.message ?? "The glossary is not an object.")
  const entries: Entry[] = []
  const seen = new Set<string>()
  let previous: readonly [string, string] | null = null
  const rows = Object.entries(result.data).flatMap(([rawTerm, list]) => list.map((row) => [rawTerm, row] as const))
  for (const [rawTerm, row] of rows) {
    const entry = entryFrom(rawTerm, row.state ?? "allowed", row.alternative, true)
    if (row.stop_word === true) entry.stopWord = true
    if (row.state === undefined) entry.stateless = true
    const key = rowKey(entry.term, row.tags)
    if (seen.has(key)) throw new InvalidGlossary(`${JSON.stringify(entry.term)} is duplicated.`)
    if (previous !== null && compareOrder(entry.order, previous) < 0) {
      throw new InvalidGlossary(`${JSON.stringify(entry.term)} is out of alphabetical order.`)
    }
    if (row.categories !== undefined) entry.categories = row.categories
    if (row.category !== undefined) {
      if (!entry.categories?.includes(row.category)) entry.categories = [row.category, ...(entry.categories ?? [])]
      entry.legacyCategory = true
    }
    if (row.description !== undefined) entry.description = row.description
    if (row.substitution !== undefined) entry.substitution = row.substitution
    if (row.rejected !== undefined) entry.rejected = row.rejected
    if (row.alternatives !== undefined) entry.alternatives = row.alternatives
    if (row.reason !== undefined) entry.reason = row.reason
    if (row.when !== undefined) entry.when = row.when
    if (row.examples !== undefined) entry.examples = row.examples
    if (row.related !== undefined) entry.related = row.related
    if (row.tags !== undefined) entry.tags = row.tags
    if (row.allowed_in !== undefined) entry.allowedIn = row.allowed_in
    if (row.forbidden_in !== undefined) entry.forbiddenIn = row.forbidden_in
    if (row.decided_by !== undefined) entry.decidedBy = row.decided_by
    if (row.decided_at !== undefined) entry.decidedAt = row.decided_at
    if (row.source !== undefined) entry.source = row.source
    if (row.notes !== undefined) entry.notes = row.notes
    if (row.case_sensitive === true) entry.caseSensitive = true
    seen.add(key)
    previous = entry.order
    entries.push(entry)
  }
  return entries
}

export function lookup(entries: readonly Entry[], submitted: string): { query: string; entry: Entry | undefined } {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the term.")
  const order = sortKey(query)
  let start = 0
  let end = entries.length
  while (start < end) {
    const middle = Math.floor((start + end) / 2)
    if (compareOrder(entries[middle].order, order) < 0) start = middle + 1
    else end = middle
  }
  const found = entries[start]
  if (found === undefined || compareOrder(found.order, order) !== 0) return { query, entry: undefined }
  // A read without tags prefers the row without tags of that spelling.
  for (let index = start; index < entries.length && compareOrder(entries[index].order, order) === 0; index++) {
    if (!hasTags(entries[index])) return { query, entry: entries[index] }
  }
  return { query, entry: found }
}

/**
 * The rows of one spelling that a read with these tags returns. The rows whose
 * tags meet the read win over the row without tags, and more than one of them
 * come back together, in the order of the file. Without such a row, the row
 * without tags is returned. A read without tags of a spelling that only has
 * tagged rows returns every one of them, as a read that sees every row.
 */
export function rowsFor(entries: readonly Entry[], term: string, tags: readonly string[]): Entry[] {
  const rows = conceptMatches(entries, term)
  if (tags.length > 0) {
    const tagged = rows.filter((entry) => entry.tags?.some((tag) => tags.includes(tag)) === true)
    if (tagged.length > 0) return tagged
  }
  const general = rows.filter((entry) => !hasTags(entry))
  return general.length > 0 ? general : rows
}

/**
 * The level of a row for a read that carries tags. A tag in forbidden_in makes
 * it forbidden, and wins over a tag in allowed_in, which makes it allowed.
 */
export function effectiveState(entry: Entry, tags: readonly string[]): State {
  if (tags.some((tag) => entry.forbiddenIn?.includes(tag))) return "forbidden"
  if (tags.some((tag) => entry.allowedIn?.includes(tag))) return "allowed"
  return entry.state
}

/** Rows that still use a deprecated state or the deprecated category. */
export function legacyRows(entries: readonly Entry[]): Entry[] {
  return entries.filter((entry) => entry.legacyState !== undefined || entry.legacyCategory === true)
}

export function applicable(entries: readonly Entry[], tags: readonly string[]): readonly Entry[] {
  if (tags.length === 0) return entries
  return entries.filter((entry) => entry.tags === undefined || entry.tags.length === 0 || entry.tags.some((tag) => tags.includes(tag)))
}

export function register(
  directory: string,
  language: string,
  term: string,
  state: string,
  alternative?: string,
): Entry {
  const path = glossaryFile(directory, language)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(lowercaseTerm(term), state, alternative)
  if (findConcept(entries, created.term, []) !== undefined) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return created
}

export function registerForbidden(
  directory: string,
  language: string,
  input: Omit<ForbiddenRequest, "language">,
): TermRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(input.case_sensitive ? input.term : lowercaseTerm(input.term), "forbidden", undefined)
  if (input.case_sensitive) created.caseSensitive = true
  if (findConcept(entries, created.term, []) !== undefined) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.rejected, input.alternatives)
  const rejected = linkedTerms(entries, input.rejected, "forbidden", created.term)
  const alternatives = linkedTerms(entries, input.alternatives, "allowed", created.term)
  created.categories = [input.category]
  created.description = input.description
  created.substitution = input.substitution
  created.rejected = rejected
  created.alternatives = alternatives
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return {
    language: tag,
    term: created.term,
    state: "forbidden",
    categories: [input.category],
    description: input.description,
    substitution: input.substitution,
    rejected,
    alternatives,
    case_sensitive: input.case_sensitive ? true : undefined,
  }
}

export function registerAllowed(
  directory: string,
  language: string,
  input: Omit<AllowedRequest, "language">,
): TermRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(input.case_sensitive ? input.term : lowercaseTerm(input.term), "allowed", undefined)
  if (input.case_sensitive) created.caseSensitive = true
  if (findConcept(entries, created.term, []) !== undefined) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.examples, [])
  const examples = linkedTerms(entries, input.examples, "allowed", created.term)
  created.categories = [input.category]
  created.description = input.description
  created.reason = input.reason
  created.examples = examples
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return {
    language: tag,
    term: created.term,
    state: "allowed",
    categories: [input.category],
    description: input.description,
    reason: input.reason,
    examples,
    case_sensitive: input.case_sensitive ? true : undefined,
  }
}

export function registerSituational(
  directory: string,
  language: string,
  input: Omit<SituationalRequest, "language">,
): TermRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(input.case_sensitive ? input.term : lowercaseTerm(input.term), "allowed_with_care", undefined)
  if (input.case_sensitive) created.caseSensitive = true
  if (findConcept(entries, created.term, []) !== undefined) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.examples, [])
  const examples = linkedTerms(entries, input.examples, "allowed_with_care", created.term)
  created.categories = [input.category]
  created.description = input.description
  created.when = input.when
  created.examples = examples
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return {
    language: tag,
    term: created.term,
    state: "allowed_with_care",
    categories: [input.category],
    description: input.description,
    when: input.when,
    examples,
    case_sensitive: input.case_sensitive ? true : undefined,
  }
}

/** A term of the batch, and the stored row it replaces, if any. */
type Writing = BulkTerm & { previous?: Entry }

export type WriteOptions = {
  /** Validate and report what would happen, and leave the file as it is. */
  dryRun?: boolean
  /** Problems found before the call, such as a term the schema refused. */
  problems?: readonly Problem[]
}

/**
 * Write one batch to the glossary of a language. Every problem of the batch is
 * collected before anything is decided: a batch with a problem writes nothing
 * and is refused with all of them. A dry run reports instead of refusing.
 */
export function writeTerms(
  directory: string,
  language: string,
  mode: WriteMode,
  terms: readonly BulkTerm[],
  validation: Validation = "warn",
  options: WriteOptions = {},
): TermsWrite {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const loaded = load(readFileSync(path, "utf8"))
  const problems: Problem[] = [...(options.problems ?? [])]
  const items = terms.map((term) => {
    const { item, issues } = withStored(loaded, term, mode)
    for (const message of issues) problems.push({ term: term.term, message })
    return item
  })
  const batch: BulkTerm[] = []
  const missing = new Map<string, ExpectedField[]>()
  for (const item of items) {
    if (batch.some((previous) => rowKey(previous.term, previous.tags) === rowKey(item.term, item.tags))) {
      problems.push({ term: item.term, message: `${JSON.stringify(item.term)} is duplicated.` })
    }
    if (item.source !== undefined && batch.some((previous) => previous.source === item.source)) {
      problems.push({ term: item.term, message: `The source of ${JSON.stringify(item.term)} is duplicated.` })
    }
    batch.push(item)
    for (const message of exampleIssues(item.term, [...item.examples, ...item.rejected], item.alternatives)) {
      problems.push({ term: item.term, message })
    }
    const absent = item.stateless ? [] : EXPECTED[item.state].filter((field) => item[field] === undefined)
    if (absent.length === 0 || validation === "optional") continue
    if (validation === "enforce") {
      for (const field of absent) {
        problems.push({ term: item.term, message: `${MISSING_FIELD[field].slice(0, -1)} of ${JSON.stringify(item.term)}.` })
      }
      continue
    }
    missing.set(item.term, absent)
  }
  const writing = new Map<string, Writing>()
  const unchanged: TermsWrite["unchanged"] = []
  const skipped: TermsWrite["skipped"] = []
  for (const item of items) {
    const found = targetRow(loaded, item, mode)
    if (found !== undefined) {
      const reason =
        matchKey(found.term) === matchKey(item.term)
          ? "Already in the glossary."
          : `Already in the glossary as ${JSON.stringify(found.term)}.`
      if (mode === "insert" || sameFields(found, item)) {
        unchanged.push({ term: item.term, reason })
        continue
      }
      const spelling = item.case_sensitive && matchKey(found.term) === matchKey(item.term) ? item.term : found.term
      writing.set(rowKey(spelling, item.tags), { ...item, term: spelling, previous: found })
      continue
    }
    const spelling = item.case_sensitive ? item.term : lowercaseTerm(item.term)
    const spelled = conceptMatches(loaded, item.term).length > 0
    const origin = item.source === undefined || spelled ? undefined : loaded.find((entry) => entry.source === item.source)
    if (origin !== undefined) {
      if (mode === "insert") {
        unchanged.push({ term: item.term, reason: `Already in the glossary as ${JSON.stringify(origin.term)}.` })
        continue
      }
      writing.set(rowKey(spelling, item.tags), { ...item, term: spelling, previous: origin })
      continue
    }
    if (mode === "update") {
      skipped.push({ term: item.term, reason: spelled ? "Not in the glossary with these tags." : "Not in the glossary." })
      continue
    }
    writing.set(rowKey(spelling, item.tags), { ...item, term: spelling })
  }
  const working = [...loaded]
  for (const item of writing.values()) {
    for (const link of referencedTerms(item)) {
      const text = collapse(link)
      if ([...writing.values()].some((entry) => sameConcept(entry.term, text))) continue
      if (working.some((entry) => sameConcept(entry.term, text))) continue
      if (batch.some((entry) => sameConcept(entry.term, text))) {
        problems.push({ term: item.term, message: `${JSON.stringify(text)} is not in the glossary.` })
      }
    }
  }
  const shells = new Map<string, Entry>()
  for (const [key, item] of writing) {
    const shell = entryFrom(item.term, item.state, undefined)
    const previous = item.previous
    const index = previous === undefined ? -1 : working.indexOf(previous)
    if (previous === undefined || index === -1) working.push(shell)
    else {
      if (previous.alternative !== null && item.state !== "allowed") shell.alternative = previous.alternative
      // A link names a spelling, so it follows a rename only when no other row keeps the old one.
      if (!working.some((entry) => entry !== previous && sameConcept(entry.term, previous.term))) renameLinks(working, previous.term, item.term)
      working[index] = shell
    }
    shells.set(key, shell)
  }
  const inserted: TermsWrite["inserted"] = []
  const updated: TermsWrite["updated"] = []
  for (const [key, item] of writing) {
    const shell = shells.get(key)
    if (shell === undefined) continue
    try {
      fillTerm(shell, item, working, writing)
    } catch (error) {
      if (!(error instanceof InvalidGlossary)) throw error
      problems.push({ term: item.term, message: error.message })
      continue
    }
    const registration = registrationOf(tag, shell)
    if (item.previous !== undefined) updated.push(registration)
    else inserted.push(registration)
  }
  const unique = problems.filter((problem, index) => problems.findIndex((other) => other.term === problem.term && other.message === problem.message) === index)
  if (unique.length > 0 && options.dryRun !== true) throw new InvalidTerms(unique)
  if (shells.size > 0 && unique.length === 0 && options.dryRun !== true) writeFileSync(path, serialize(working), "utf8")
  const skippedTerms = new Set(skipped.map((item) => item.term))
  const incomplete = [...missing]
    .filter(([term]) => !skippedTerms.has(term))
    .map(([term, fields]) => ({ term: writtenSpelling(writing, term), missing: [...fields] }))
  const written: TermsWrite = { language: tag, mode, inserted, updated, unchanged, skipped, incomplete, warnings: warningsFor(items, working) }
  if (options.dryRun !== true) return written
  const refused = unique.map(({ term, message }) => (term === undefined ? { reason: message } : { term, reason: message }))
  return {
    ...written,
    inserted: unique.length === 0 ? inserted : [],
    updated: unique.length === 0 ? updated : [],
    dry_run: true,
    refused,
  }
}

/**
 * Read a batch from a request body and write it. The terms the schema refuses
 * join the problems of the write, so one call lists every reason at once.
 */
export function writeBatch(directory: string, body: unknown): TermsWrite {
  let request: ReturnType<typeof readTermsRequest>
  try {
    request = readTermsRequest(body)
  } catch (error) {
    throw new InvalidGlossary(error instanceof Error ? error.message : "Invalid value.")
  }
  return writeTerms(directory, request.language, request.mode, request.terms, request.validation, {
    dryRun: request.dry_run,
    problems: request.problems,
  })
}

/**
 * Rewrite the rows that still use a deprecated state or the deprecated
 * category. Without write, only report what would change.
 */
export function migrate(directory: string, language: string, write = false): Migration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const states: Migration["states"] = []
  const categories: Migration["categories"] = []
  for (const entry of legacyRows(entries)) {
    if (entry.legacyState !== undefined) states.push({ term: entry.term, from: entry.legacyState, to: entry.state })
    if (entry.legacyCategory === true) categories.push({ term: entry.term, from: entry.categories?.[0] ?? "" })
    if (!write) continue
    delete entry.legacyState
    delete entry.legacyCategory
  }
  const written = write && states.length + categories.length > 0
  if (written) writeFileSync(path, serialize(entries), "utf8")
  return { language: tag, written, states, categories }
}

/**
 * The term as an update or an upsert writes it: the fields the call sent, and
 * for every other field the value already stored. The merged row is checked as
 * a whole, so a call that moves a row to a level that refuses a stored field is
 * refused until it clears that field.
 */
function withStored(entries: readonly Entry[], item: BulkTerm, mode: WriteMode): { item: BulkTerm; issues: string[] } {
  if (mode === "insert") return { item, issues: [] }
  const spelled = conceptMatches(entries, item.term).length > 0
  const stored =
    targetRow(entries, item, mode) ?? (item.source === undefined || spelled ? undefined : entries.find((entry) => entry.source === item.source))
  if (stored === undefined) return { item, issues: [] }
  const keeps = (field: PatchableField): boolean => !item.given.includes(field)
  const merged: BulkTerm = {
    ...item,
    categories: keeps("categories") ? [...(stored.categories ?? [])] : item.categories,
    description: keeps("description") ? stored.description : item.description,
    reason: keeps("reason") ? stored.reason : item.reason,
    substitution: keeps("substitution") ? stored.substitution : item.substitution,
    when: keeps("when") ? stored.when : item.when,
    examples: keeps("examples") ? [...(stored.examples ?? [])] : item.examples,
    rejected: keeps("rejected") ? [...(stored.rejected ?? [])] : item.rejected,
    alternatives: keeps("alternatives") ? [...(stored.alternatives ?? [])] : item.alternatives,
    related: keeps("related") ? [...(stored.related ?? [])] : item.related,
    tags: keeps("tags") ? [...(stored.tags ?? [])] : item.tags,
    allowed_in: keeps("allowed_in") ? [...(stored.allowedIn ?? [])] : item.allowed_in,
    forbidden_in: keeps("forbidden_in") ? [...(stored.forbiddenIn ?? [])] : item.forbidden_in,
    decided_by: keeps("decided_by") ? stored.decidedBy : item.decided_by,
    decided_at: keeps("decided_at") ? stored.decidedAt : item.decided_at,
    source: keeps("source") ? stored.source : item.source,
    notes: keeps("notes") ? stored.notes : item.notes,
    case_sensitive: keeps("case_sensitive") ? stored.caseSensitive === true : item.case_sensitive,
    stop_word: keeps("stop_word") ? stored.stopWord === true : item.stop_word,
    // A call without a state keeps the stored level, or the stored absence of one.
    state: item.stateless ? stored.state : item.state,
    stateless: item.stateless ? stored.stateless === true : false,
  }
  return { item: merged, issues: termIssues(merged).map((issue) => `${JSON.stringify(item.term)}: ${issue}`) }
}

/**
 * The stored row a write of this term replaces: the row with the same set of
 * tags, where tags: [] is the row without tags. An insert without tags is the
 * row without tags. An update or an upsert that omits tags keeps the stored
 * fields, so it takes the only row of the spelling when there is one. update
 * never adds a row: when no row has the tags of the call and the spelling has
 * one row, it takes that row and changes its tags.
 */
function targetRow(entries: readonly Entry[], item: BulkTerm, mode: WriteMode): Entry | undefined {
  const rows = conceptMatches(entries, item.term)
  const sent = mode === "insert" || item.given.includes("tags")
  if (!sent && rows.length === 1) return rows[0]
  const exact = rows.find((entry) => rowKey(entry.term, entry.tags) === rowKey(item.term, item.tags))
  if (exact !== undefined || mode !== "update") return exact
  return rows.length === 1 ? rows[0] : undefined
}

function writtenSpelling(writing: ReadonlyMap<string, Writing>, term: string): string {
  return [...writing.values()].find((item) => sameConcept(item.term, term))?.term ?? term
}

function warningsFor(terms: readonly BulkTerm[], entries: readonly Entry[]): string[] {
  const warnings: string[] = []
  const legacy = terms.filter((item) => item.legacy_state !== undefined).map((item) => JSON.stringify(item.term))
  if (legacy.length > 0) {
    warnings.push(`situationally_allowed is deprecated and was written as allowed_with_care: ${legacy.join(", ")}.`)
  }
  if (terms.some((item) => item.legacy_category)) warnings.push("category is deprecated. Send categories.")
  const rows = legacyRows(entries).length
  if (rows > 0) warnings.push(`${rows} ${rows === 1 ? "row still uses" : "rows still use"} a deprecated state or category. Run migrate.`)
  return warnings
}

export class Glossary {
  readonly directory: string
  private readonly cache = new Map<string, { mtimeMs: number; entries: Entry[] }>()

  constructor(directory: string) {
    this.directory = directory
  }

  entries(language: string): { tag: string; entries: Entry[] } {
    const tag = canonicalLanguage(language)
    const path = glossaryFile(this.directory, tag)
    const mtimeMs = statSync(path).mtimeMs
    const cached = this.cache.get(tag)
    if (cached === undefined || cached.mtimeMs !== mtimeMs) {
      const entries = load(readFileSync(path, "utf8"))
      this.cache.set(tag, { mtimeMs, entries })
      return { tag, entries }
    }
    return { tag, entries: cached.entries }
  }
}

function entryFrom(term: string, raw: string, alternative: string | undefined, keepLegacy = false): Entry {
  const text = collapse(term)
  if (text === "") throw new InvalidGlossary("The term is empty.")
  const state = levelOf(raw)
  if (state === undefined) throw new InvalidGlossary(`Unknown state for ${JSON.stringify(text)}: ${JSON.stringify(raw)}.`)
  let replacement = alternative === undefined ? null : collapse(alternative)
  if (replacement === "") replacement = null
  if (state === "allowed" && replacement !== null) {
    throw new InvalidGlossary(`${JSON.stringify(text)} is allowed and takes no alternative.`)
  }
  if (replacement !== null && matchKey(replacement) === matchKey(text)) {
    throw new InvalidGlossary(`${JSON.stringify(text)} cannot be its own alternative.`)
  }
  const entry: Entry = { term: text, state, alternative: replacement, order: sortKey(text) }
  if (keepLegacy && isLegacyState(raw)) entry.legacyState = raw
  return entry
}

function serialize(entries: readonly Entry[]): string {
  const file: Record<string, object[]> = {}
  const sorted = [...entries].sort((left, right) => compareOrder(left.order, right.order) || compareText(tagKey(left.tags), tagKey(right.tags)))
  for (const entry of sorted) {
    const row: Record<string, unknown> = entry.stateless ? {} : { state: entry.legacyState ?? entry.state }
    if (entry.stopWord === true) row.stop_word = true
    if (entry.alternative !== null) row.alternative = entry.alternative
    if (entry.categories !== undefined && entry.categories.length > 0) {
      if (entry.legacyCategory === true && entry.categories.length === 1) row.category = entry.categories[0]
      else row.categories = entry.categories
    }
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
    if (entry.caseSensitive === true) row.case_sensitive = true
    file[entry.term] = [...(file[entry.term] ?? []), row]
  }
  // One row stays an object, as every file kept before a spelling could have more than one.
  const written = Object.fromEntries(Object.entries(file).map(([term, rows]) => [term, rows.length === 1 ? rows[0] : rows]))
  return `${JSON.stringify(written, null, 2)}\n`
}

function referencedTerms(item: BulkTerm): readonly string[] {
  return [...item.examples, ...item.rejected, ...item.alternatives]
}

const AVOIDED_LISTS: ReadonlySet<State> = new Set(["forbidden", "strongly_discouraged"])

function fillTerm(shell: Entry, item: BulkTerm, entries: Entry[], writing: ReadonlyMap<string, BulkTerm>): void {
  if (item.categories.length > 0) shell.categories = item.categories
  if (item.description !== undefined) shell.description = item.description
  if (item.reason !== undefined) shell.reason = item.reason
  if (item.substitution !== undefined) shell.substitution = item.substitution
  if (item.when !== undefined) shell.when = item.when
  if (item.decided_by !== undefined) shell.decidedBy = item.decided_by
  if (item.decided_at !== undefined) shell.decidedAt = item.decided_at
  if (item.stop_word === true) shell.stopWord = true
  if (item.stateless) shell.stateless = true
  if (item.source !== undefined) shell.source = item.source
  if (item.notes !== undefined) shell.notes = item.notes
  if (item.case_sensitive) shell.caseSensitive = true
  const related = resolveRegistered(entries, item.related, item.term, writing)
  if (related.length > 0) shell.related = related
  const examples = resolveLinks(entries, item.examples, item.state, writing, item.tags)
  const rejected = resolveLinks(entries, item.rejected, "forbidden", writing)
  const alternatives = resolveLinks(entries, item.alternatives, "allowed", writing)
  if (AVOIDED_LISTS.has(item.state)) {
    shell.rejected = rejected
    shell.alternatives = alternatives
  } else {
    if (!item.stateless || examples.length > 0) shell.examples = examples
    if (rejected.length > 0) shell.rejected = rejected
    if (alternatives.length > 0) shell.alternatives = alternatives
  }
  if (item.tags.length > 0) shell.tags = item.tags
  if (item.allowed_in.length > 0) shell.allowedIn = item.allowed_in
  if (item.forbidden_in.length > 0) shell.forbiddenIn = item.forbidden_in
}

export function registrationOf(language: string, entry: Entry): TermRegistration {
  const registration: TermRegistration = entry.stateless ? { language, term: entry.term } : { language, term: entry.term, state: entry.state }
  if (entry.stopWord === true) registration.stop_word = true
  if (entry.categories !== undefined && entry.categories.length > 0) registration.categories = [...entry.categories]
  if (entry.description !== undefined) registration.description = entry.description
  if (entry.reason !== undefined) registration.reason = entry.reason
  if (entry.substitution !== undefined) registration.substitution = entry.substitution
  if (entry.when !== undefined) registration.when = entry.when
  if (entry.examples !== undefined) registration.examples = [...entry.examples]
  if (entry.rejected !== undefined) registration.rejected = [...entry.rejected]
  if (entry.alternatives !== undefined) registration.alternatives = [...entry.alternatives]
  if (entry.related !== undefined && entry.related.length > 0) registration.related = [...entry.related]
  if (entry.tags !== undefined && entry.tags.length > 0) registration.tags = [...entry.tags]
  if (entry.allowedIn !== undefined && entry.allowedIn.length > 0) registration.allowed_in = [...entry.allowedIn]
  if (entry.forbiddenIn !== undefined && entry.forbiddenIn.length > 0) registration.forbidden_in = [...entry.forbiddenIn]
  if (entry.decidedBy !== undefined) registration.decided_by = entry.decidedBy
  if (entry.decidedAt !== undefined) registration.decided_at = entry.decidedAt
  if (entry.source !== undefined) registration.source = entry.source
  if (entry.notes !== undefined) registration.notes = entry.notes
  if (entry.caseSensitive === true) registration.case_sensitive = true
  return registration
}

function resolveRegistered(
  entries: readonly Entry[],
  submitted: readonly string[],
  owner: string,
  writing: ReadonlyMap<string, BulkTerm>,
): string[] {
  const linked: string[] = []
  const seen: string[] = []
  for (const item of submitted) {
    const text = collapse(item)
    if (text === "") throw new InvalidGlossary("Provide the related terms.")
    if (sameConcept(owner, text)) throw new InvalidGlossary(`${JSON.stringify(owner)} cannot be its own related term.`)
    if (seen.some((previous) => sameConcept(previous, text))) {
      throw new InvalidGlossary(`${JSON.stringify(text)} is duplicated.`)
    }
    seen.push(text)
    const batch = [...writing.values()].find((entry) => sameConcept(entry.term, text))
    if (batch !== undefined) {
      linked.push(batch.term)
      continue
    }
    const found = findConcept(entries, text)
    if (found !== undefined) {
      linked.push(found.term)
      continue
    }
    throw new InvalidGlossary(`${JSON.stringify(text)} is not in the glossary.`)
  }
  return linked
}

function resolveLinks(
  entries: Entry[],
  submitted: readonly string[],
  state: State,
  writing: ReadonlyMap<string, BulkTerm>,
  tags: readonly string[] = [],
): string[] {
  const linked: string[] = []
  for (const item of submitted) {
    const text = collapse(item)
    const batch = [...writing.values()].find((entry) => sameConcept(entry.term, text))
    if (batch !== undefined) {
      linked.push(batch.term)
      continue
    }
    const found = findConcept(entries, text)
    if (found !== undefined) {
      linked.push(found.term)
      continue
    }
    const created = entryFrom(text, state, undefined)
    if (tags.length > 0) created.tags = tags
    entries.push(created)
    linked.push(text)
  }
  return linked
}

function renameLinks(entries: readonly Entry[], previous: string, next: string): void {
  if (previous === next) return
  const key = matchKey(previous)
  for (const entry of entries) {
    if (entry.alternative !== null && matchKey(entry.alternative) === key) entry.alternative = next
    entry.rejected = renameList(entry.rejected, key, next)
    entry.alternatives = renameList(entry.alternatives, key, next)
    entry.examples = renameList(entry.examples, key, next)
    entry.related = renameList(entry.related, key, next)
  }
}

function renameList(list: readonly string[] | undefined, key: string, next: string): string[] | undefined {
  if (list === undefined) return undefined
  return list.map((item) => (matchKey(item) === key ? next : item))
}

function assertExamples(owner: string, rejected: readonly string[], alternatives: readonly string[]): void {
  const [issue] = exampleIssues(owner, rejected, alternatives)
  if (issue !== undefined) throw new InvalidGlossary(issue)
}

function exampleIssues(owner: string, rejected: readonly string[], alternatives: readonly string[]): string[] {
  const issues: string[] = []
  const seen = [owner]
  for (const item of [...rejected, ...alternatives]) {
    const text = collapse(item)
    if (text === "") issues.push("The term is empty.")
    else if (sameConcept(owner, text)) issues.push(`${JSON.stringify(owner)} cannot be its own example.`)
    else if (seen.some((previous) => sameConcept(previous, text))) issues.push(`${JSON.stringify(text)} is duplicated.`)
    seen.push(text)
  }
  return issues
}

function linkedTerms(entries: Entry[], submitted: readonly string[], state: State, owner: string): string[] {
  const seen = new Set<string>([matchKey(owner)])
  const linked: string[] = []
  for (const item of submitted) {
    const text = collapse(item)
    if (text === "") throw new InvalidGlossary("The term is empty.")
    const key = matchKey(text)
    if (sameConcept(owner, text)) throw new InvalidGlossary(`${JSON.stringify(owner)} cannot be its own example.`)
    if (seen.has(key) || [...seen].some((previous) => sameConcept(previous, text))) {
      throw new InvalidGlossary(`${JSON.stringify(text)} is duplicated.`)
    }
    seen.add(key)
    const found = findConcept(entries, text)
    if (found !== undefined) {
      linked.push(found.term)
      continue
    }
    entries.push(entryFrom(text, state, undefined))
    linked.push(text)
  }
  return linked
}

function lowercaseTerm(term: string): string {
  return term.toLowerCase()
}

function caseFold(value: string): string {
  return value.toLowerCase().replaceAll("ß", "ss")
}

function matchKey(term: string): string {
  return caseFold(collapse(term)).normalize("NFC")
}

function sameConcept(left: string, right: string): boolean {
  return matchKey(left) === matchKey(right)
}

export function conceptMatches(entries: readonly Entry[], term: string): Entry[] {
  return entries.filter((entry) => sameConcept(entry.term, term))
}

/**
 * Whether the submitted form keeps the casing of a case-sensitive row. A row
 * without case_sensitive always matches.
 */
export function caseMatches(entry: Entry, submitted: string): boolean {
  if (entry.caseSensitive !== true) return true
  return collapse(submitted).normalize("NFC") === entry.term.normalize("NFC")
}

/**
 * A row of that spelling. With tags, only the row with that same set of tags,
 * and an empty list is the row without tags. Without tags, any row of the
 * spelling, the row without tags first: a link names a spelling, not a row.
 */
export function findConcept(entries: readonly Entry[], term: string, tags?: readonly string[]): Entry | undefined {
  const rows = conceptMatches(entries, term)
  if (tags !== undefined) return rows.find((entry) => tagKey(entry.tags) === tagKey(tags))
  return rows.find((entry) => !hasTags(entry)) ?? rows[0]
}

/** What makes a row one row: its spelling and its set of tags. */
function rowKey(term: string, tags: readonly string[] | undefined): string {
  return `${matchKey(term)}\u0000${tagKey(tags)}`
}

function tagKey(tags: readonly string[] | undefined): string {
  return [...new Set(tags ?? [])].sort().join(",")
}

function hasTags(entry: Entry): boolean {
  return entry.tags !== undefined && entry.tags.length > 0
}

function compareText(left: string, right: string): number {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

function sameFields(entry: Entry, item: BulkTerm): boolean {
  if (entry.state !== item.state) return false
  if ((entry.stateless === true) !== item.stateless) return false
  if ((entry.stopWord === true) !== (item.stop_word === true)) return false
  if ((entry.caseSensitive === true) !== item.case_sensitive) return false
  if (item.case_sensitive && matchKey(entry.term) === matchKey(item.term) && entry.term !== item.term) return false
  return sameList(entry.categories, item.categories)
    && entry.description === item.description
    && entry.reason === item.reason
    && entry.substitution === item.substitution
    && entry.when === item.when
    && samePerson(entry.decidedBy, item.decided_by)
    && entry.decidedAt === item.decided_at
    && entry.source === item.source
    && entry.notes === item.notes
    && sameList(entry.examples, item.examples)
    && sameList(entry.rejected, item.rejected)
    && sameList(entry.alternatives, item.alternatives)
    && sameList(entry.related, item.related)
    && sameList(entry.tags, item.tags)
    && sameList(entry.allowedIn, item.allowed_in)
    && sameList(entry.forbiddenIn, item.forbidden_in)
}

function sameList(stored: readonly string[] | undefined, incoming: readonly string[]): boolean {
  const left = stored ?? []
  if (left.length !== incoming.length) return false
  return left.every((item, index) => matchKey(item) === matchKey(incoming[index] ?? ""))
}

function sortKey(term: string): readonly [string, string] {
  const folded = matchKey(term).normalize("NFD")
  const base = [...folded].filter((character) => !isCombining(character)).join("")
  return [base, folded]
}

function compareOrder(left: readonly [string, string], right: readonly [string, string]): number {
  if (left[0] < right[0]) return -1
  if (left[0] > right[0]) return 1
  if (left[1] < right[1]) return -1
  if (left[1] > right[1]) return 1
  return 0
}

function isCombining(character: string): boolean {
  return /\p{M}/u.test(character)
}

function isLetters(value: string): boolean {
  return /^[A-Za-z]+$/.test(value)
}
