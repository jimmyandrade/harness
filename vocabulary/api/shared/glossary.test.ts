import assert from "node:assert/strict"
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import test from "node:test"

import { InvalidGlossary, canonicalLanguage, glossaryDirectory, initGlossary, load, register } from "./glossary.ts"
import { FORMAT_VERSION, formatAddress, glossaryRowSchema } from "./schema.ts"

const GLOSSARY = `{
  "açúcar": { "state": "allowed" },
  "baratinho": { "state": "forbidden", "alternative": "acessível" },
  "ça": { "state": "allowed" },
  "caça": { "state": "allowed" },
  "casa": { "state": "allowed" },
  "em mãos": { "state": "situationally_allowed", "alternative": "entrega" },
  "promo": { "state": "forbidden" }
}
`

const EMPTY = "{}\n"

test("cedilla and accent stay on the base letter", () => {
  const terms = load(GLOSSARY).map((entry) => entry.term)
  assert.deepEqual(terms, ["açúcar", "baratinho", "ça", "caça", "casa", "em mãos", "promo"])
})

test("out of order fails", () => {
  assert.throws(
    () => load('{ "zebra": { "state": "allowed" }, "abacate": { "state": "allowed" } }'),
    InvalidGlossary,
  )
})

test("allowed with an alternative fails", () => {
  assert.throws(
    () => load('{ "abacate": { "state": "allowed", "alternative": "fruta" } }'),
    InvalidGlossary,
  )
})

test("a file that is not an object fails", () => {
  assert.deepEqual(load("{}"), [])
  assert.throws(() => load("[]"), InvalidGlossary)
})

test("a region tag is written in uppercase", () => {
  assert.equal(canonicalLanguage("pt-br"), "pt-BR")
})

test("an unknown language fails", () => {
  assert.throws(() => canonicalLanguage("../pt-BR"), InvalidGlossary)
})

test("register inserts in the middle and keeps order", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), EMPTY)
  writeFileSync(join(root, "en.json"), EMPTY)
  register(root, "pt-br", "casa", "allowed")
  register(root, "pt-BR", "açúcar", "allowed")
  register(root, "pt-BR", "baratinho", "forbidden", "acessível")
  assert.equal(
    readFileSync(join(root, "pt-BR.json"), "utf8"),
    `{
  "açúcar": {
    "state": "allowed"
  },
  "baratinho": {
    "state": "forbidden",
    "alternative": "acessível"
  },
  "casa": {
    "state": "allowed"
  }
}
`,
  )
  assert.equal(readFileSync(join(root, "en.json"), "utf8"), EMPTY)
})

test("the glossary lives in the project unless HARNESS_GLOSSARY_DIR names another directory", () => {
  assert.equal(glossaryDirectory({}, "/work/site"), resolve("/work/site/.agents/glossary"))
  assert.equal(glossaryDirectory({ HARNESS_ROOT: "/work/brand" }, "/work/site"), resolve("/work/brand/.agents/glossary"))
  assert.equal(glossaryDirectory({ HARNESS_GLOSSARY_DIR: "/data/terms", HARNESS_ROOT: "/work/brand" }, "/work/site"), resolve("/data/terms"))
})

test("init creates an empty glossary for a new language, with its directory", () => {
  const root = join(mkdtempSync(join(tmpdir(), "glossary-")), "nested", "glossary")
  assert.deepEqual(initGlossary(root, "es"), { language: "es", created: true })
  assert.equal(readFileSync(join(root, "es.json"), "utf8"), EMPTY)
  register(root, "es", "casa", "allowed")
  assert.deepEqual(load(readFileSync(join(root, "es.json"), "utf8")).map((entry) => entry.term), ["casa"])
})

test("init leaves an existing glossary as it is", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, GLOSSARY)
  assert.deepEqual(initGlossary(root, "pt-br"), { language: "pt-BR", created: false })
  assert.equal(readFileSync(file, "utf8"), GLOSSARY)
})

test("init refuses an invalid tag and creates nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  assert.throws(() => initGlossary(root, "pt_BR!"), { message: "Unknown language." })
  assert.throws(() => initGlossary(root, "../es"), { message: "Unknown language." })
  assert.equal(existsSync(join(root, "pt_BR!.json")), false)
})

test("a valid language without a glossary points to init", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  assert.throws(
    () => register(root, "es", "casa", "allowed"),
    { message: "No glossary for es yet. Create it with init." },
  )
  assert.equal(existsSync(join(root, "es.json")), false)
})

const V1 = formatAddress(1)

test("a file with $schema reads its rows and $schema is not a term", () => {
  const entries = load(`{\n  "$schema": "${V1}",\n  "casa": { "state": "allowed" }\n}\n`)
  assert.deepEqual(entries.map((entry) => entry.term), ["casa"])
})

test("a file of a newer format is refused and names the update", () => {
  assert.throws(
    () => load(`{ "$schema": "${formatAddress(FORMAT_VERSION + 1)}", "casa": { "state": "allowed" } }`),
    /newer than this engine.*Update the plugin or the dependency/,
  )
})

test("a $schema that is not a glossary format is refused", () => {
  assert.throws(() => load('{ "$schema": "https://example.com/other.json", "casa": { "state": "allowed" } }'), InvalidGlossary)
})

test("a write keeps the $schema of the file as its first key", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, `{\n  "$schema": "${V1}",\n  "casa": {\n    "state": "allowed"\n  }\n}\n`)
  register(root, "pt-BR", "açúcar", "allowed")
  assert.deepEqual(Object.keys(JSON.parse(readFileSync(file, "utf8")) as object), ["$schema", "açúcar", "casa"])
})

test("the schema of format 1 names the row fields the engine reads", () => {
  const schema = JSON.parse(readFileSync(new URL("../../schemas/glossary-v1.schema.json", import.meta.url), "utf8")) as {
    $id: string
    $defs: { row: { properties: Record<string, unknown> } }
  }
  assert.equal(schema.$id, V1)
  assert.deepEqual(Object.keys(schema.$defs.row.properties).sort(), Object.keys(glossaryRowSchema.shape).sort())
})

test("register refuses a real link in the term or the alternative", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), EMPTY)
  assert.throws(() => register(root, "pt-BR", "https://example.com/tarefa", "allowed"), /A term or an example takes no real link/)
  assert.throws(() => register(root, "pt-BR", "promo", "forbidden", "https://example.com/promocao"), /A term or an example takes no real link/)
  assert.equal(readFileSync(join(root, "pt-BR.json"), "utf8"), EMPTY)
})
