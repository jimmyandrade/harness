import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { existsPhrase } from "../routes/exists/index.ts"
import { lookupTerm, lookupTerms } from "../routes/lookup/index.ts"
import { Glossary, InvalidGlossary, load, writeTerms } from "./glossary.ts"
import { readSchema, termsRequest } from "./schema.ts"

function glossary(initial: unknown = {}): { root: string; file: string; text: string } {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  const text = typeof initial === "string" ? initial : `${JSON.stringify(initial, null, 2)}\n`
  writeFileSync(file, text)
  return { root, file, text }
}

function terms(items: unknown[]) {
  return readSchema(termsRequest, { language: "pt-BR", mode: "upsert", terms: items }).terms
}

function stored(file: string): unknown {
  return JSON.parse(readFileSync(file, "utf8"))
}

const TAGGED = {
  "bom dia": { state: "allowed_with_care", description: "saudação", when: "na abertura do canal", tags: ["canal-a"] },
}

const greeting = (tags?: string[]) => ({
  state: "allowed_with_care",
  term: "bom dia",
  description: "saudação",
  when: "na abertura",
  ...(tags === undefined ? {} : { tags }),
})

test("an insert without tags of a spelling with a tagged row adds the row without tags", () => {
  const { root, file } = glossary(TAGGED)
  const written = writeTerms(root, "pt-BR", "insert", terms([greeting()]))
  assert.equal(written.inserted.length, 1)
  assert.deepEqual(written.unchanged, [])
  assert.deepEqual(stored(file), {
    "bom dia": [
      { state: "allowed_with_care", description: "saudação", when: "na abertura", examples: [] },
      TAGGED["bom dia"],
    ],
  })
})

test("an insert with another tag adds a second row, and the same tags stay one row", () => {
  const { root, file } = glossary(TAGGED)
  const written = writeTerms(root, "pt-BR", "insert", terms([greeting(["canal-b"]), { ...greeting(["canal-a"]), description: "outra" }]))
  assert.deepEqual(written.inserted.map((row) => row.tags), [["canal-b"]])
  assert.deepEqual(written.unchanged, [{ term: "bom dia", reason: "Already in the glossary." }])
  const rows = stored(file) as Record<string, { tags: string[]; description: string }[]>
  assert.deepEqual(rows["bom dia"].map((row) => row.tags), [["canal-a"], ["canal-b"]])
  assert.equal(rows["bom dia"][0].description, "saudação")
})

test("the same set of tags in another order is the same row", () => {
  const { root } = glossary({ "bom dia": { ...TAGGED["bom dia"], tags: ["canal-a", "palco"] } })
  const written = writeTerms(root, "pt-BR", "insert", terms([greeting(["palco", "canal-a"])]))
  assert.equal(written.inserted.length, 0)
  assert.equal(written.unchanged.length, 1)
})

test("a batch with two rows of the same spelling and tags is refused", () => {
  const { root } = glossary()
  assert.throws(() => writeTerms(root, "pt-BR", "insert", terms([greeting(["canal-a"]), greeting(["canal-a"])])), /is duplicated/)
})

test("terms of the same source are all written, in one batch and in later calls", () => {
  const { root, file } = glossary()
  const page = "https://example.com/page"
  const first = writeTerms(root, "pt-BR", "insert", terms([{ ...greeting(), source: page }, { ...greeting(), term: "boa tarde", source: page }]))
  assert.equal(first.inserted.length, 2)
  const later = writeTerms(root, "pt-BR", "upsert", terms([{ ...greeting(), term: "boa noite", source: page }]))
  assert.deepEqual(later.inserted.map((row) => row.term), ["boa noite"])
  const rows = stored(file) as Record<string, { source: string }[] | { source: string }>
  assert.equal(Object.keys(rows).length, 3)
})

test("a batch may write the rows of one spelling with different tags together", () => {
  const { root, file } = glossary()
  const written = writeTerms(root, "pt-BR", "insert", terms([greeting(), greeting(["canal-a"]), greeting(["canal-b"])]))
  assert.equal(written.inserted.length, 3)
  assert.equal((stored(file) as Record<string, unknown[]>)["bom dia"].length, 3)
})

test("an upsert with tags writes the row with those tags and leaves the others", () => {
  const { root, file } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([greeting(), greeting(["canal-a"])]))
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ ...greeting(["canal-a"]), notes: "revisto" }]))
  assert.deepEqual(written.updated.map((row) => [row.tags, row.notes]), [[["canal-a"], "revisto"]])
  const rows = (stored(file) as Record<string, { notes?: string }[]>)["bom dia"]
  assert.deepEqual(rows.map((row) => row.notes), [undefined, "revisto"])
})

test("an upsert that omits tags writes the only row of a spelling and keeps its tags", () => {
  const { root, file } = glossary(TAGGED)
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed_with_care", term: "bom dia", notes: "revisto" }]))
  assert.equal(written.updated.length, 1)
  assert.deepEqual(stored(file), { "bom dia": { ...TAGGED["bom dia"], examples: [], notes: "revisto" } })
})

test("an upsert that omits tags writes the row without tags once the spelling has more than one", () => {
  const { root, file } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([greeting(), greeting(["canal-a"])]))
  writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed_with_care", term: "bom dia", notes: "geral" }]))
  const rows = (stored(file) as Record<string, { notes?: string }[]>)["bom dia"]
  assert.deepEqual(rows.map((row) => row.notes), ["geral", undefined])
})

test("an upsert with tags sent empty adds the row without tags", () => {
  const { root, file } = glossary(TAGGED)
  const written = writeTerms(root, "pt-BR", "upsert", terms([greeting([])]))
  assert.equal(written.inserted.length, 1)
  assert.equal((stored(file) as Record<string, unknown[]>)["bom dia"].length, 2)
})

test("an update of tags that no row has skips a spelling with more than one row", () => {
  const { root, text, file } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([greeting(["canal-a"]), greeting(["canal-b"])]))
  const before = readFileSync(file, "utf8")
  const written = writeTerms(root, "pt-BR", "update", terms([greeting(["canal-c"])]))
  assert.deepEqual(written.skipped, [{ term: "bom dia", reason: "Not in the glossary with these tags." }])
  assert.equal(readFileSync(file, "utf8"), before)
  assert.notEqual(before, text)
})

test("a lookup with the tag of a row returns that row, and one without it returns the row without tags", () => {
  const { root } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([
    { state: "allowed", term: "olá", description: "saudação", reason: "acolhe" },
    { state: "discouraged", term: "olá", description: "saudação", when: "só no fim", tags: ["canal-a"] },
  ]))
  const reader = new Glossary(root)
  const tagged = lookupTerm(reader, "pt-BR", "olá", ["canal-a"])
  assert.equal(tagged.state, "discouraged")
  assert.deepEqual(tagged.tags, ["canal-a"])
  assert.equal(tagged.rows, undefined)
  const other = lookupTerm(reader, "pt-BR", "olá", ["canal-b"])
  assert.equal(other.state, "allowed")
  assert.equal(other.tags, undefined)
  const untagged = lookupTerm(reader, "pt-BR", "olá")
  assert.equal(untagged.state, "allowed")
  const { results } = lookupTerms(reader, "pt-BR", ["olá", "olá"], ["canal-a"])
  assert.deepEqual(results.map((result) => result.state), ["discouraged", "discouraged"])
})

test("a lookup that meets two tagged rows returns both, in the order of the file", () => {
  const { root } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([greeting(), { ...greeting(["canal-b"]), notes: "b" }, { ...greeting(["canal-a"]), notes: "a" }]))
  const found = lookupTerm(new Glossary(root), "pt-BR", "bom dia", ["canal-a", "canal-b"])
  assert.equal(found.notes, "a")
  assert.deepEqual(found.rows?.map((row) => row.notes), ["a", "b"])
})

test("a lookup without tags of a spelling with only tagged rows returns every one", () => {
  const { root } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([greeting(["canal-a"]), greeting(["canal-b"])]))
  const found = lookupTerm(new Glossary(root), "pt-BR", "bom dia")
  assert.deepEqual(found.tags, ["canal-a"])
  assert.deepEqual(found.rows?.map((row) => row.tags), [["canal-a"], ["canal-b"]])
})

test("exists finds a spelling by any row that applies", () => {
  const { root } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([{ ...greeting(["canal-a"]), term: "oi" }]))
  const reader = new Glossary(root)
  assert.deepEqual(existsPhrase(reader, "pt-BR", "oi", ["canal-a"]), { oi: true })
  assert.deepEqual(existsPhrase(reader, "pt-BR", "oi", ["canal-b"]), { oi: false })
})

test("a file in the older format reads and writes back unchanged", () => {
  const { root, file, text } = glossary({
    "bom dia": TAGGED["bom dia"],
    casa: { state: "allowed", description: "lugar", reason: "acolhe", examples: [] },
  })
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed", term: "lar", description: "lugar", reason: "acolhe" }]))
  assert.equal(written.inserted.length, 1)
  const after = stored(file) as Record<string, unknown>
  assert.deepEqual(after["bom dia"], TAGGED["bom dia"])
  assert.equal(Array.isArray(after.casa), false)
  writeFileSync(file, text)
  writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed", term: "casa", description: "lugar", reason: "acolhe" }]))
  assert.equal(readFileSync(file, "utf8"), text)
})

test("a list of rows reads as rows of one spelling", () => {
  const entries = load(`{ "bom dia": [{ "state": "allowed" }, { "state": "discouraged", "tags": ["canal-a"] }] }`)
  assert.deepEqual(entries.map((entry) => [entry.term, entry.state, entry.tags]), [
    ["bom dia", "allowed", undefined],
    ["bom dia", "discouraged", ["canal-a"]],
  ])
})

test("two rows of one spelling with the same tags, or an empty list of rows, are refused", () => {
  assert.throws(() => load(`{ "bom dia": [{ "state": "allowed" }, { "state": "discouraged" }] }`), InvalidGlossary)
  assert.throws(
    () => load(`{ "bom dia": [{ "state": "discouraged", "tags": ["a", "b"] }, { "state": "discouraged", "tags": ["b", "a"] }] }`),
    InvalidGlossary,
  )
  assert.throws(() => load(`{ "bom dia": [] }`), /empty list of rows/)
})
