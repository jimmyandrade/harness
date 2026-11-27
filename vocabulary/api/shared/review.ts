/**
 * Read-only reviews of a glossary: what changed between two files, and what a
 * file contradicts or leaves out. Neither writes anything.
 */

import { readFileSync } from "node:fs"

import { canonicalLanguage, glossaryFile, load, type Entry } from "./glossary.ts"
import { EXPECTED } from "./schema.ts"

/** A row of the glossary, named by its spelling and its set of tags. */
export type RowRef = { term: string; tags: string[] }

/** What differs between two glossaries of one language. */
export type GlossaryDiff = {
  language: string
  added: RowRef[]
  removed: RowRef[]
  changed: (RowRef & { fields: string[] })[]
  unchanged: number
}

/** One problem the audit found in a row. */
export type AuditFinding = {
  kind: "forbidden-term-in-example" | "forbidden-term-in-alternative" | "missing-field"
  term: string
  detail: string
}

export type Audit = {
  language: string
  findings: AuditFinding[]
  counts: { rows: number; without_decision: number; findings: number }
}

const FIELD_NAMES: Readonly<Record<string, string>> = {
  decidedBy: "decided_by",
  decidedAt: "decided_at",
  allowedIn: "allowed_in",
  forbiddenIn: "forbidden_in",
  stopWord: "stop_word",
  caseSensitive: "case_sensitive",
}

const IGNORED = new Set(["order", "legacyState", "legacyCategory", "alternative"])

function entriesOf(directory: string, language: string): { tag: string; entries: Entry[] } {
  const tag = canonicalLanguage(language)
  return { tag, entries: load(readFileSync(glossaryFile(directory, tag), "utf8")) }
}

function tagsOf(entry: Entry): string[] {
  return [...(entry.tags ?? [])].sort()
}

function keyOf(entry: Entry): string {
  return `${entry.term.toLocaleLowerCase()}\u0000${tagsOf(entry).join("\u0001")}`
}

function byTerm(left: RowRef, right: RowRef): number {
  return left.term.localeCompare(right.term, "pt-BR") || left.tags.join(",").localeCompare(right.tags.join(","))
}

function changedFields(before: Entry, after: Entry): string[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)].filter((name) => !IGNORED.has(name)))
  const fields: string[] = []
  for (const name of names) {
    const left = JSON.stringify((before as Record<string, unknown>)[name])
    const right = JSON.stringify((after as Record<string, unknown>)[name])
    if (left !== right) fields.push(FIELD_NAMES[name] ?? name)
  }
  return fields.sort()
}

/**
 * Compare the glossary of a language in directory with the one in against.
 * Rows are matched by spelling and set of tags, as a write matches them, and
 * each changed row lists the fields that differ.
 */
export function diffGlossaries(directory: string, language: string, against: string): GlossaryDiff {
  const { tag, entries: now } = entriesOf(directory, language)
  const { entries: before } = entriesOf(against, language)
  const old = new Map(before.map((entry) => [keyOf(entry), entry]))
  const current = new Map(now.map((entry) => [keyOf(entry), entry]))
  const added: RowRef[] = []
  const changed: (RowRef & { fields: string[] })[] = []
  let unchanged = 0
  for (const [key, entry] of current) {
    const previous = old.get(key)
    if (previous === undefined) {
      added.push({ term: entry.term, tags: tagsOf(entry) })
      continue
    }
    const fields = changedFields(previous, entry)
    if (fields.length === 0) unchanged += 1
    else changed.push({ term: entry.term, tags: tagsOf(entry), fields })
  }
  const removed = [...old].filter(([key]) => !current.has(key)).map(([, entry]) => ({ term: entry.term, tags: tagsOf(entry) }))
  return { language: tag, added: added.sort(byTerm), removed: removed.sort(byTerm), changed: changed.sort(byTerm), unchanged }
}

function escaped(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Review the glossary of one language. A row that is not forbidden is flagged
 * when an example, an alternative, or its substitution holds a term that a row
 * without tags forbids, as a whole word. A spelling that a tagged row allows is
 * left out: the context decides it, and the audit reads no context. A row is also flagged for each field
 * its level expects and lacks, unless the row records no decision: the rows the
 * glossary made on its own are incomplete by design, so they are counted and
 * not listed.
 */
export function auditGlossary(directory: string, language: string): Audit {
  const { tag, entries } = entriesOf(directory, language)
  const excepted = new Set(
    entries.filter((entry) => entry.state !== "forbidden" && (entry.tags ?? []).length > 0).map((entry) => entry.term.toLocaleLowerCase()),
  )
  const forbidden = entries
    .filter(
      (entry) =>
        entry.state === "forbidden" &&
        (entry.tags ?? []).length === 0 &&
        entry.stateless !== true &&
        !excepted.has(entry.term.toLocaleLowerCase()),
    )
    .map((entry) => ({ term: entry.term, pattern: new RegExp(`(?<![\\p{L}\\p{N}])${escaped(entry.term)}(?![\\p{L}\\p{N}])`, "iu") }))
  const findings: AuditFinding[] = []
  const hold = (entry: Entry, texts: readonly string[], kind: AuditFinding["kind"]): void => {
    for (const text of texts) {
      for (const bad of forbidden) {
        if (bad.term.toLocaleLowerCase() === entry.term.toLocaleLowerCase() || !bad.pattern.test(text)) continue
        findings.push({ kind, term: entry.term, detail: `${JSON.stringify(text)} holds the forbidden term ${JSON.stringify(bad.term)}.` })
      }
    }
  }
  for (const entry of entries) {
    if (entry.state !== "forbidden") hold(entry, entry.examples ?? [], "forbidden-term-in-example")
    hold(entry, [...(entry.alternatives ?? []), ...(entry.substitution === undefined ? [] : [entry.substitution])], "forbidden-term-in-alternative")
    if (entry.stateless === true || (entry.decidedBy === undefined && entry.decidedAt === undefined)) continue
    for (const field of EXPECTED[entry.state]) {
      const value = entry[field]
      if (value === undefined || value === "") findings.push({ kind: "missing-field", term: entry.term, detail: `The row has no ${field}.` })
    }
  }
  const without = entries.filter((entry) => entry.decidedBy === undefined && entry.decidedAt === undefined).length
  return { language: tag, findings, counts: { rows: entries.length, without_decision: without, findings: findings.length } }
}
