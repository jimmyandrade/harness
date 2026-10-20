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
 * in alphabetical order. state is one of five levels, from the strictest:
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
 * name, and the next write stores it as an object. source is where the row
 * came from. Any row
 * may keep case_sensitive: true, for a brand spelling such as "iPhone". Its
 * key keeps that casing. A read still finds it in another case and says the
 * casing does not match.
 *
 * writeTerms searches before it writes. Only case folds: an accent is part of
 * the spelling, as ADR 0011 decides, so roles and rolês are two terms. A
 * plural, a gender, and another word for the same idea each keep their own row
 * and their own state. A new term is stored
 * in lowercase, unless it is written with case_sensitive, which keeps its
 * casing as given. insert leaves a term that is already in the file.
 * update leaves a term that is absent. A row whose fields already match is
 * unchanged. A failure leaves the file unchanged.
 *
 * An English word used in Portuguese is a row in pt-BR.json. Its state there
 * can differ from the row in en.json.
 */

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
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
  type AllowedRequest,
  type BulkTerm,
  type ForbiddenRequest,
  type LegacyState,
  type Migration,
  type Person,
  type SituationalRequest,
  type State,
  type TermRegistration,
  type TermsWrite,
  type ExpectedField,
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
  source?: string
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

export function glossaryFile(directory: string, language: string): string {
  const tag = canonicalLanguage(language)
  const root = resolve(directory)
  const path = resolve(root, `${tag}.json`)
  if (dirname(path) !== root || !existsSync(path)) throw new InvalidGlossary("Unknown language.")
  return path
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
  for (const [rawTerm, row] of Object.entries(result.data)) {
    const entry = entryFrom(rawTerm, row.state, row.alternative, true)
    const key = matchKey(entry.term)
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
    if (row.source !== undefined) entry.source = row.source
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
  return { query, entry: found }
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
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
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
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
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
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
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
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
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

type Writing = BulkTerm & { previous?: string }

export function writeTerms(
  directory: string,
  language: string,
  mode: WriteMode,
  terms: readonly BulkTerm[],
  validation: Validation = "warn",
): TermsWrite {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const loaded = load(readFileSync(path, "utf8"))
  const existed = new Set(loaded.map((entry) => matchKey(entry.term)))
  const batch: BulkTerm[] = []
  const missing = new Map<string, ExpectedField[]>()
  for (const item of terms) {
    if (batch.some((previous) => sameConcept(previous.term, item.term))) {
      throw new InvalidGlossary(`${JSON.stringify(item.term)} is duplicated.`)
    }
    if (item.source !== undefined && batch.some((previous) => previous.source === item.source)) {
      throw new InvalidGlossary(`The source of ${JSON.stringify(item.term)} is duplicated.`)
    }
    batch.push(item)
    assertExamples(item.term, [...item.examples, ...item.rejected], item.alternatives)
    const absent = EXPECTED[item.state].filter((field) => item[field] === undefined)
    const first = absent[0]
    if (first === undefined || validation === "optional") continue
    if (validation === "enforce") {
      throw new InvalidGlossary(`${MISSING_FIELD[first].slice(0, -1)} of ${JSON.stringify(item.term)}.`)
    }
    missing.set(item.term, absent)
  }
  const writing = new Map<string, Writing>()
  const unchanged: TermsWrite["unchanged"] = []
  const skipped: TermsWrite["skipped"] = []
  for (const item of terms) {
    const found = findConcept(loaded, item.term)
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
      writing.set(matchKey(found.term), { ...item, term: spelling })
      continue
    }
    const spelling = item.case_sensitive ? item.term : lowercaseTerm(item.term)
    const origin = item.source === undefined ? undefined : loaded.find((entry) => entry.source === item.source)
    if (origin !== undefined) {
      if (mode === "insert") {
        unchanged.push({ term: item.term, reason: `Already in the glossary as ${JSON.stringify(origin.term)}.` })
        continue
      }
      writing.set(matchKey(spelling), { ...item, term: spelling, previous: origin.term })
      continue
    }
    if (mode === "update") {
      skipped.push({ term: item.term, reason: "Not in the glossary." })
      continue
    }
    writing.set(matchKey(spelling), { ...item, term: spelling })
  }
  const working = [...loaded]
  for (const item of writing.values()) {
    for (const link of referencedTerms(item)) {
      const text = collapse(link)
      if ([...writing.values()].some((entry) => sameConcept(entry.term, text))) continue
      if (working.some((entry) => sameConcept(entry.term, text))) continue
      if (batch.some((entry) => sameConcept(entry.term, text))) {
        throw new InvalidGlossary(`${JSON.stringify(text)} is not in the glossary.`)
      }
    }
  }
  const shells = new Map<string, Entry>()
  for (const item of writing.values()) {
    const key = matchKey(item.term)
    const shell = entryFrom(item.term, item.state, undefined)
    const index = working.findIndex((entry) => matchKey(entry.term) === matchKey(item.previous ?? item.term))
    if (index === -1) working.push(shell)
    else {
      const previous = working[index]
      if (previous !== undefined && previous.alternative !== null && item.state !== "allowed") shell.alternative = previous.alternative
      renameLinks(working, previous?.term ?? item.term, item.term)
      working[index] = shell
    }
    shells.set(key, shell)
  }
  const inserted: TermsWrite["inserted"] = []
  const updated: TermsWrite["updated"] = []
  for (const item of writing.values()) {
    const shell = shells.get(matchKey(item.term))
    if (shell === undefined) continue
    fillTerm(shell, item, working, writing)
    const registration = registrationOf(tag, shell)
    if (existed.has(matchKey(item.previous ?? item.term))) updated.push(registration)
    else inserted.push(registration)
  }
  if (shells.size > 0) writeFileSync(path, serialize(working), "utf8")
  const skippedTerms = new Set(skipped.map((item) => item.term))
  const incomplete = [...missing]
    .filter(([term]) => !skippedTerms.has(term))
    .map(([term, fields]) => ({ term: writtenSpelling(writing, term), missing: [...fields] }))
  return { language: tag, mode, inserted, updated, unchanged, skipped, incomplete, warnings: warningsFor(terms, working) }
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
  const file: Record<string, object> = {}
  for (const entry of [...entries].sort((left, right) => compareOrder(left.order, right.order))) {
    const row: Record<string, unknown> = { state: entry.legacyState ?? entry.state }
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
    if (entry.source !== undefined) row.source = entry.source
    if (entry.caseSensitive === true) row.case_sensitive = true
    file[entry.term] = row
  }
  return `${JSON.stringify(file, null, 2)}\n`
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
  if (item.source !== undefined) shell.source = item.source
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
    shell.examples = examples
    if (rejected.length > 0) shell.rejected = rejected
    if (alternatives.length > 0) shell.alternatives = alternatives
  }
  if (item.tags.length > 0) shell.tags = item.tags
  if (item.allowed_in.length > 0) shell.allowedIn = item.allowed_in
  if (item.forbidden_in.length > 0) shell.forbiddenIn = item.forbidden_in
}

export function registrationOf(language: string, entry: Entry): TermRegistration {
  const registration: TermRegistration = { language, term: entry.term, state: entry.state }
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
  if (entry.source !== undefined) registration.source = entry.source
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
  const seen = [owner]
  for (const item of [...rejected, ...alternatives]) {
    const text = collapse(item)
    if (text === "") throw new InvalidGlossary("The term is empty.")
    if (sameConcept(owner, text)) throw new InvalidGlossary(`${JSON.stringify(owner)} cannot be its own example.`)
    if (seen.some((previous) => sameConcept(previous, text))) {
      throw new InvalidGlossary(`${JSON.stringify(text)} is duplicated.`)
    }
    seen.push(text)
  }
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

export function findConcept(entries: readonly Entry[], term: string): Entry | undefined {
  return entries.find((entry) => sameConcept(entry.term, term))
}

function sameFields(entry: Entry, item: BulkTerm): boolean {
  if (entry.state !== item.state) return false
  if ((entry.caseSensitive === true) !== item.case_sensitive) return false
  if (item.case_sensitive && matchKey(entry.term) === matchKey(item.term) && entry.term !== item.term) return false
  return sameList(entry.categories, item.categories)
    && entry.description === item.description
    && entry.reason === item.reason
    && entry.substitution === item.substitution
    && entry.when === item.when
    && samePerson(entry.decidedBy, item.decided_by)
    && entry.source === item.source
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
