/**
 * Brand glossary for one language of the text.
 *
 * Each language is a UTF-8 JSON file in the glossary directory of the project,
 * named with its BCP 47 tag: pt-BR.json, en.json, de.json, ja.json, and fr.json.
 * Another language is another file. A lookup opens only the file for the
 * language of the text. The directory is HARNESS_GLOSSARY_DIR, or
 * .agents/glossary/ under HARNESS_ROOT, or under the working directory.
 *
 * The file is an object. Each key is the term. Each value has state and, when
 * the row has one, alternative. The key is not repeated inside the value. The
 * keys stay in alphabetical order. state is allowed,
 * forbidden, or situationally_allowed. alternative is the recommended term
 * when the state is forbidden, and the always-allowed term when the state is
 * situationally_allowed. An allowed row omits alternative. A forbidden row
 * registered with a category also keeps category, description, substitution,
 * rejected, and alternatives. rejected and alternatives name other terms in
 * the same file. An allowed row registered with a category also keeps
 * category, description, reason, and examples. examples names other allowed
 * terms in the same file. A situationally allowed row registered with a
 * category also keeps category, description, when, and examples. when says
 * when to use the term. examples names other situationally allowed terms in
 * the same file. The row omits alternative when it has none.
 *
 * writeTerms searches before it writes. Case and an accent that does not change
 * the letter are the same term. A plural, a gender, and another word for the
 * same idea each keep their own row and their own state. A new term is stored
 * in lowercase. insert leaves a term
 * that is already in the file.
 * update leaves a term that is absent. A row whose fields already match is
 * unchanged. A failure leaves the file unchanged.
 *
 * An English word used in Portuguese is a row in pt-BR.json. Its state there
 * can differ from the row in en.json.
 */

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import {
  collapse,
  glossaryFileSchema,
  stateSchema,
  type AllowedRegistration,
  type AllowedRequest,
  type ForbiddenRegistration,
  type ForbiddenRequest,
  type BulkTerm,
  type SituationalRegistration,
  type SituationalRequest,
  type State,
  type TermsWrite,
  type WriteMode,
} from "./schema.ts"

export type { AllowedRegistration, ForbiddenRegistration, SituationalRegistration, State, TermsWrite }
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
  alternative: string | null
  order: readonly [string, string]
  category?: string
  description?: string
  substitution?: string
  rejected?: readonly string[]
  alternatives?: readonly string[]
  reason?: string
  when?: string
  examples?: readonly string[]
  related?: readonly string[]
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
    const entry = entryFrom(rawTerm, row.state, row.alternative)
    const key = matchKey(entry.term)
    if (seen.has(key)) throw new InvalidGlossary(`${JSON.stringify(entry.term)} is duplicated.`)
    if (previous !== null && compareOrder(entry.order, previous) < 0) {
      throw new InvalidGlossary(`${JSON.stringify(entry.term)} is out of alphabetical order.`)
    }
    if (row.category !== undefined) entry.category = row.category
    if (row.description !== undefined) entry.description = row.description
    if (row.substitution !== undefined) entry.substitution = row.substitution
    if (row.rejected !== undefined) entry.rejected = row.rejected
    if (row.alternatives !== undefined) entry.alternatives = row.alternatives
    if (row.reason !== undefined) entry.reason = row.reason
    if (row.when !== undefined) entry.when = row.when
    if (row.examples !== undefined) entry.examples = row.examples
    if (row.related !== undefined) entry.related = row.related
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
): ForbiddenRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(lowercaseTerm(input.term), "forbidden", undefined)
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.rejected, input.alternatives)
  const rejected = linkedTerms(entries, input.rejected, "forbidden", created.term)
  const alternatives = linkedTerms(entries, input.alternatives, "allowed", created.term)
  created.category = input.category
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
    category: input.category,
    description: input.description,
    substitution: input.substitution,
    rejected,
    alternatives,
  }
}

export function registerAllowed(
  directory: string,
  language: string,
  input: Omit<AllowedRequest, "language">,
): AllowedRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(lowercaseTerm(input.term), "allowed", undefined)
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.examples, [])
  const examples = linkedTerms(entries, input.examples, "allowed", created.term)
  created.category = input.category
  created.description = input.description
  created.reason = input.reason
  created.examples = examples
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return {
    language: tag,
    term: created.term,
    state: "allowed",
    category: input.category,
    description: input.description,
    reason: input.reason,
    examples,
  }
}

export function registerSituational(
  directory: string,
  language: string,
  input: Omit<SituationalRequest, "language">,
): SituationalRegistration {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const entries = load(readFileSync(path, "utf8"))
  const created = entryFrom(lowercaseTerm(input.term), "situationally_allowed", undefined)
  if (entries.some((item) => matchKey(item.term) === matchKey(created.term))) {
    throw new InvalidGlossary(`${JSON.stringify(created.term)} is already in the glossary.`)
  }
  assertExamples(created.term, input.examples, [])
  const examples = linkedTerms(entries, input.examples, "situationally_allowed", created.term)
  created.category = input.category
  created.description = input.description
  created.when = input.when
  created.examples = examples
  entries.push(created)
  writeFileSync(path, serialize(entries), "utf8")
  return {
    language: tag,
    term: created.term,
    state: "situationally_allowed",
    category: input.category,
    description: input.description,
    when: input.when,
    examples,
  }
}

export function writeTerms(directory: string, language: string, mode: WriteMode, terms: readonly BulkTerm[]): TermsWrite {
  const tag = canonicalLanguage(language)
  const path = glossaryFile(directory, tag)
  const loaded = load(readFileSync(path, "utf8"))
  const existed = new Set(loaded.map((entry) => matchKey(entry.term)))
  const batch: BulkTerm[] = []
  for (const item of terms) {
    if (batch.some((previous) => sameConcept(previous.term, item.term))) {
      throw new InvalidGlossary(`${JSON.stringify(item.term)} is duplicated.`)
    }
    batch.push(item)
    if (item.state === "forbidden") assertExamples(item.term, item.rejected, item.alternatives)
    else assertExamples(item.term, item.examples, [])
  }
  const writing = new Map<string, BulkTerm>()
  const unchanged: TermsWrite["unchanged"] = []
  const skipped: TermsWrite["skipped"] = []
  for (const item of terms) {
    refuseDuplicates(loaded, item.term)
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
      writing.set(matchKey(found.term), { ...item, term: found.term })
      continue
    }
    if (mode === "update") {
      skipped.push({ term: item.term, reason: "Not in the glossary." })
      continue
    }
    writing.set(matchKey(item.term), { ...item, term: lowercaseTerm(item.term) })
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
    const index = working.findIndex((entry) => matchKey(entry.term) === key)
    if (index === -1) working.push(shell)
    else {
      const previous = working[index]
      if (previous !== undefined && previous.alternative !== null) shell.alternative = previous.alternative
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
    const links = fillTerm(shell, item, working, writing)
    const registration = registrationFrom(tag, item, links)
    if (existed.has(matchKey(item.term))) updated.push(registration)
    else inserted.push(registration)
  }
  if (shells.size > 0) writeFileSync(path, serialize(working), "utf8")
  return { language: tag, mode, inserted, updated, unchanged, skipped }
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

function entryFrom(term: string, state: string, alternative: string | undefined): Entry {
  const text = collapse(term)
  if (text === "") throw new InvalidGlossary("The term is empty.")
  if (!isState(state)) throw new InvalidGlossary(`Unknown state for ${JSON.stringify(text)}: ${JSON.stringify(state)}.`)
  let replacement = alternative === undefined ? null : collapse(alternative)
  if (replacement === "") replacement = null
  if (state === "allowed" && replacement !== null) {
    throw new InvalidGlossary(`${JSON.stringify(text)} is allowed and takes no alternative.`)
  }
  if (replacement !== null && matchKey(replacement) === matchKey(text)) {
    throw new InvalidGlossary(`${JSON.stringify(text)} cannot be its own alternative.`)
  }
  return { term: text, state, alternative: replacement, order: sortKey(text) }
}

function serialize(entries: readonly Entry[]): string {
  const file: Record<string, object> = {}
  for (const entry of [...entries].sort((left, right) => compareOrder(left.order, right.order))) {
    const row: {
      state: State
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
    } = { state: entry.state }
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
    file[entry.term] = row
  }
  return `${JSON.stringify(file, null, 2)}\n`
}

function referencedTerms(item: BulkTerm): readonly string[] {
  if (item.state === "forbidden") return [...item.rejected, ...item.alternatives]
  return item.examples
}

function fillTerm(
  shell: Entry,
  item: BulkTerm,
  entries: Entry[],
  writing: ReadonlyMap<string, BulkTerm>,
): { rejected?: string[]; alternatives?: string[]; examples?: string[]; related?: string[] } {
  shell.category = item.category
  shell.description = item.description
  const related = resolveRegistered(entries, item.related, item.term, writing)
  if (related.length > 0) shell.related = related
  if (item.state === "forbidden") {
    const rejected = resolveLinks(entries, item.rejected, "forbidden", writing)
    const alternatives = resolveLinks(entries, item.alternatives, "allowed", writing)
    shell.substitution = item.substitution
    shell.rejected = rejected
    shell.alternatives = alternatives
    return { rejected, alternatives, related }
  }
  const examples = resolveLinks(entries, item.examples, item.state, writing)
  if (item.state === "allowed") shell.reason = item.reason
  else shell.when = item.when
  shell.examples = examples
  return { examples, related }
}

function registrationFrom(
  language: string,
  item: BulkTerm,
  links: { rejected?: string[]; alternatives?: string[]; examples?: string[]; related?: string[] },
): TermsWrite["inserted"][number] {
  const related = links.related !== undefined && links.related.length > 0 ? links.related : undefined
  if (item.state === "forbidden") {
    return {
      language,
      term: item.term,
      state: "forbidden",
      category: item.category,
      description: item.description,
      substitution: item.substitution,
      rejected: links.rejected ?? [],
      alternatives: links.alternatives ?? [],
      related,
    }
  }
  if (item.state === "allowed") {
    return {
      language,
      term: item.term,
      state: "allowed",
      category: item.category,
      description: item.description,
      reason: item.reason,
      examples: links.examples ?? [],
      related,
    }
  }
  return {
    language,
    term: item.term,
    state: "situationally_allowed",
    category: item.category,
    description: item.description,
    when: item.when,
    examples: links.examples ?? [],
    related,
  }
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
    entries.push(entryFrom(text, state, undefined))
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

function conceptKey(term: string): string {
  return [...matchKey(term).normalize("NFD")].filter((character) => !isCombining(character)).join("")
}

function sameConcept(left: string, right: string): boolean {
  return conceptKey(left) === conceptKey(right)
}

export function hasConcept(entries: readonly Entry[], term: string): boolean {
  return entries.some((entry) => sameConcept(entry.term, term))
}

export function duplicateSignal(entries: readonly Entry[], term: string): { duplicates: string[]; canonical: string } | undefined {
  const matches = entries.filter((entry) => sameConcept(entry.term, term))
  if (matches.length < 2) return undefined
  const canonical = [...matches].sort(byCanonical)[0]
  if (canonical === undefined) return undefined
  return { duplicates: matches.map((entry) => entry.term), canonical: canonical.term }
}

export function findConcept(entries: readonly Entry[], term: string): Entry | undefined {
  const exact = entries.find((entry) => matchKey(entry.term) === matchKey(term))
  if (exact !== undefined) return exact
  const matches = entries.filter((entry) => sameConcept(entry.term, term))
  if (matches.length > 1) refuseDuplicates(entries, term)
  return matches[0]
}

function refuseDuplicates(entries: readonly Entry[], term: string): void {
  const signal = duplicateSignal(entries, term)
  if (signal === undefined) return
  const names = signal.duplicates.map((item) => JSON.stringify(item)).join(", ")
  throw new InvalidGlossary(`${JSON.stringify(term)} matches ${names}. Keep ${JSON.stringify(signal.canonical)}.`)
}

function byCanonical(left: Entry, right: Entry): number {
  const guidance = guidanceOf(right) - guidanceOf(left)
  if (guidance !== 0) return guidance
  return left.term < right.term ? -1 : left.term > right.term ? 1 : 0
}

function guidanceOf(entry: Entry): number {
  return Number(Boolean(entry.description)) + Number(entry.examples !== undefined && entry.examples.length > 0)
}

function sameFields(entry: Entry, item: BulkTerm): boolean {
  if (entry.state !== item.state) return false
  if ((entry.category ?? "") !== item.category) return false
  if ((entry.description ?? "") !== item.description) return false
  if (!sameList(entry.related, item.related)) return false
  if (item.state === "forbidden") {
    return (entry.substitution ?? "") === item.substitution
      && sameList(entry.rejected, item.rejected)
      && sameList(entry.alternatives, item.alternatives)
  }
  if (item.state === "allowed") {
    return (entry.reason ?? "") === item.reason && sameList(entry.examples, item.examples)
  }
  return (entry.when ?? "") === item.when && sameList(entry.examples, item.examples)
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

function isState(value: string): value is State {
  return stateSchema.safeParse(value).success
}
