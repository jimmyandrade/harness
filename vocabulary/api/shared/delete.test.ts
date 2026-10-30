import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { InvalidTerms, deleteTerms, writeTerms } from "./glossary.ts"
import { readSchema, termsRequest } from "./schema.ts"

const ROW = { state: "allowed_with_care", description: "forma de tratar", when: "numa DM" }

const GLOSSARY = {
  casa: { state: "allowed" },
  contigo: [{ ...ROW }, { ...ROW, tags: ["canal-a"] }],
  moradia: { state: "forbidden", alternatives: ["casa"] },
  solo: { ...ROW, tags: ["canal-a"] },
}

function glossary(initial: unknown = GLOSSARY): { root: string; file: string } {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, `${JSON.stringify(initial, null, 2)}\n`)
  return { root, file }
}

function stored(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>
}

test("a delete with tags removes that row and keeps the other rows of the spelling", () => {
  const { root, file } = glossary()
  const deleted = deleteTerms(root, "pt-BR", [{ term: "contigo", tags: ["canal-a"] }])
  assert.deepEqual(deleted.deleted.map((row) => [row.term, row.tags]), [["contigo", ["canal-a"]]])
  assert.deepEqual(deleted.skipped, [])
  assert.deepEqual(stored(file).contigo, ROW)
})

test("a delete with tags sent empty removes the row without tags and keeps the tagged one", () => {
  const { root, file } = glossary()
  deleteTerms(root, "pt-BR", [{ term: "contigo", tags: [] }])
  assert.deepEqual(stored(file).contigo, { ...ROW, tags: ["canal-a"] })
})

test("a delete without tags removes the only row of a spelling, with its tags", () => {
  const { root, file } = glossary()
  const deleted = deleteTerms(root, "pt-BR", [{ term: "solo" }])
  assert.deepEqual(deleted.deleted.map((row) => row.term), ["solo"])
  assert.equal("solo" in stored(file), false)
})

test("a delete finds the spelling in any case", () => {
  const { root, file } = glossary()
  deleteTerms(root, "pt-BR", [{ term: "SOLO" }])
  assert.equal("solo" in stored(file), false)
})

test("a delete without tags of a spelling with more than one row is refused and names the rows", () => {
  const { root, file } = glossary()
  const before = readFileSync(file, "utf8")
  assert.throws(
    () => deleteTerms(root, "pt-BR", [{ term: "contigo" }]),
    (error) =>
      error instanceof InvalidTerms &&
      /"contigo" has more than one row\. Send its tags to choose one: \[\], \["canal-a"\]\./.test(error.message),
  )
  assert.equal(readFileSync(file, "utf8"), before)
})

test("a spelling or tags that no row has are skipped and write nothing", () => {
  const { root, file } = glossary()
  const before = readFileSync(file, "utf8")
  const result = deleteTerms(root, "pt-BR", [{ term: "ausente" }, { term: "contigo", tags: ["outra"] }])
  assert.deepEqual(result.deleted, [])
  assert.deepEqual(result.skipped, [
    { term: "ausente", reason: "Not in the glossary." },
    { term: "contigo", reason: "Not in the glossary with these tags." },
  ])
  assert.equal(readFileSync(file, "utf8"), before)
})

test("a delete of the last row of a spelling that another row names is refused", () => {
  const { root, file } = glossary()
  const before = readFileSync(file, "utf8")
  assert.throws(
    () => deleteTerms(root, "pt-BR", [{ term: "casa" }]),
    (error) => error instanceof InvalidTerms && /"casa" is still named by "moradia" \(alternatives\)\./.test(error.message),
  )
  assert.equal(readFileSync(file, "utf8"), before)
})

test("a delete passes when the rows that name the spelling go in the same batch", () => {
  const { root, file } = glossary()
  deleteTerms(root, "pt-BR", [{ term: "casa" }, { term: "moradia" }])
  assert.deepEqual(Object.keys(stored(file)), ["contigo", "solo"])
})

test("a delete passes when another row of the spelling stays for the rows that name it", () => {
  const { root, file } = glossary({
    casa: [{ state: "allowed" }, { state: "allowed", tags: ["canal-a"] }],
    moradia: { state: "forbidden", alternatives: ["casa"] },
  })
  deleteTerms(root, "pt-BR", [{ term: "casa", tags: ["canal-a"] }])
  assert.deepEqual(stored(file).casa, { state: "allowed" })
})

test("a dry run reports what a delete would do and leaves the file as it is", () => {
  const { root, file } = glossary()
  const before = readFileSync(file, "utf8")
  const ok = deleteTerms(root, "pt-BR", [{ term: "solo" }], { dryRun: true })
  assert.equal(ok.dry_run, true)
  assert.deepEqual(ok.deleted.map((row) => row.term), ["solo"])
  assert.deepEqual(ok.refused, [])
  const refused = deleteTerms(root, "pt-BR", [{ term: "casa" }, { term: "solo" }], { dryRun: true })
  assert.deepEqual(refused.deleted, [])
  assert.equal(refused.refused?.[0]?.term, "casa")
  assert.equal(readFileSync(file, "utf8"), before)
})

test("a batch that names a row twice is refused and writes nothing", () => {
  const { root, file } = glossary()
  const before = readFileSync(file, "utf8")
  assert.throws(
    () => deleteTerms(root, "pt-BR", [{ term: "solo" }, { term: "Solo" }]),
    (error) => error instanceof InvalidTerms && /"Solo" is duplicated\./.test(error.message),
  )
  assert.equal(readFileSync(file, "utf8"), before)
})

test("the last row of the file leaves an empty glossary", () => {
  const { root, file } = glossary({ solo: { ...ROW } })
  deleteTerms(root, "pt-BR", [{ term: "solo" }])
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("an update with tags sent empty removes the tags of the only row of a spelling", () => {
  const { root, file } = glossary()
  const item = readSchema(termsRequest, {
    language: "pt-BR",
    mode: "update",
    terms: [{ state: "allowed_with_care", term: "solo", tags: [] }],
  }).terms
  const written = writeTerms(root, "pt-BR", "update", item)
  assert.equal(written.updated.length, 1)
  assert.deepEqual(stored(file).solo, { ...ROW, examples: [] })
})
