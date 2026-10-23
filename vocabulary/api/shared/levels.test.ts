import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { lookupTerm } from "../routes/lookup/index.ts"
import { Glossary, InvalidGlossary, InvalidTerms, load, migrate, writeBatch, writeTerms } from "./glossary.ts"
import { LEVELS, bulkTermSchema, rating, readSchema, termsRequest } from "./schema.ts"

function glossary(initial = "{}\n"): { root: string; file: string } {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, initial)
  return { root, file }
}

function terms(items: unknown[]) {
  return readSchema(termsRequest, { language: "pt-BR", mode: "upsert", terms: items }).terms
}

test("the five levels are ordered as a rating from forbidden to allowed", () => {
  assert.deepEqual(LEVELS, ["forbidden", "strongly_discouraged", "discouraged", "allowed_with_care", "allowed"])
  assert.deepEqual(LEVELS.map(rating), [1, 2, 3, 4, 5])
})

test("each of the five levels is written and read back", () => {
  const { root, file } = glossary()
  const written = writeTerms(root, "pt-BR", "insert", terms([
    { state: "forbidden", term: "baratinho", description: "barato demais", substitution: "acessível" },
    { state: "strongly_discouraged", term: "promo", description: "soa a liquidação", substitution: "condição especial", when: "só quando a pessoa pedir" },
    { state: "discouraged", term: "imperdível", description: "promessa vaga", when: "com a cena que prova", examples: ["um encontro imperdível na praça"] },
    { state: "allowed_with_care", term: "leve também", description: "convite", when: "depois da escolha principal", tags: ["loja"] },
    { state: "allowed", term: "casa", description: "lugar", reason: "acolhe" },
  ]))
  assert.equal(written.inserted.length, 5)
  assert.deepEqual(written.incomplete, [])
  const states = Object.fromEntries(load(readFileSync(file, "utf8")).map((entry) => [entry.term, entry.state]))
  assert.deepEqual(states, {
    baratinho: "forbidden",
    casa: "allowed",
    imperdível: "discouraged",
    "leve também": "allowed_with_care",
    promo: "strongly_discouraged",
    "um encontro imperdível na praça": "discouraged",
  })
})

test("a term without description is written and reported as incomplete", () => {
  const { root, file } = glossary()
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed", term: "casa", reason: "acolhe" }]))
  assert.equal(written.inserted.length, 1)
  assert.deepEqual(written.incomplete, [{ term: "casa", missing: ["description"] }])
  assert.equal(load(readFileSync(file, "utf8"))[0]?.description, undefined)
})

test("an allowed term without reason is written and reported as incomplete", () => {
  const { root } = glossary()
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed", term: "casa", description: "lugar" }]))
  assert.equal(written.inserted.length, 1)
  assert.deepEqual(written.incomplete, [{ term: "casa", missing: ["reason"] }])
})

test("a forbidden term without substitution is written and reported as incomplete", () => {
  const { root } = glossary()
  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "forbidden", term: "baratinho", description: "barato demais" }]))
  assert.equal(written.inserted.length, 1)
  assert.deepEqual(written.inserted[0]?.alternatives, [])
  assert.deepEqual(written.incomplete, [{ term: "baratinho", missing: ["substitution"] }])
})

test("enforce refuses a missing field and optional does not report it", () => {
  const { root, file } = glossary()
  const item = terms([{ state: "forbidden", term: "baratinho" }])
  assert.throws(() => writeTerms(root, "pt-BR", "upsert", item, "enforce"), {
    name: "Error",
    message: '2 problems. The batch was not written.\n- Provide the description of "baratinho".\n- Provide the substitution of "baratinho".',
  })
  assert.equal(readFileSync(file, "utf8"), "{}\n")
  assert.deepEqual(writeTerms(root, "pt-BR", "upsert", item, "optional").incomplete, [])
})

test("description and reason cannot say the same thing", () => {
  assert.throws(
    () => readSchema(bulkTermSchema, { state: "allowed", term: "casa", description: "Lugar de morar", reason: "lugar de  morar" }),
    /Do not copy one into the other/,
  )
})

test("each level refuses the fields that do not belong to it", () => {
  const refused = (item: object) => () => readSchema(bulkTermSchema, { term: "x", ...item })
  assert.throws(refused({ state: "forbidden", when: "às vezes" }), /general rules/)
  assert.throws(refused({ state: "allowed", tags: ["loja"] }), /tagged for one context/)
  assert.throws(refused({ state: "strongly_discouraged", examples: ["um x"] }), /belongs in rejected/)
  assert.throws(refused({ state: "allowed", rejected: ["um x"] }), /no rejected examples/)
  assert.throws(refused({ state: "allowed_with_care", substitution: "y" }), /takes no substitution/)
  assert.throws(refused({ state: "discouraged", reason: "porque sim" }), /Say why to avoid it in description/)
  assert.throws(refused({ state: "discouraged", allowed_in: ["feed"], forbidden_in: ["feed"] }), /both allowed_in and forbidden_in/)
  assert.throws(refused({ state: "situationally_ok" }), /Unknown state/)
})

test("the deprecated situationally_allowed is written as allowed_with_care with a warning", () => {
  const { root, file } = glossary()
  const written = writeTerms(root, "pt-BR", "insert", terms([
    { state: "situationally_allowed", term: "leve também", category: "commerce", description: "convite", when: "depois da escolha" },
  ]))
  assert.equal(written.inserted[0]?.state, "allowed_with_care")
  assert.deepEqual(written.inserted[0]?.categories, ["commerce"])
  assert.deepEqual(written.warnings, [
    'situationally_allowed is deprecated and was written as allowed_with_care: "leve também".',
    "category is deprecated. Send categories.",
  ])
  const stored = JSON.parse(readFileSync(file, "utf8"))
  assert.equal(stored["leve também"].state, "allowed_with_care")
  assert.deepEqual(stored["leve também"].categories, ["commerce"])
})

test("the three deprecated states map to the new levels and stay in the file until migrate", () => {
  const initial = `${JSON.stringify({
    baratinho: { state: "forbidden", alternative: "acessível", category: "price" },
    casa: { state: "allowed" },
    "em mãos": { state: "situationally_allowed", alternative: "entrega", when: "na loja física" },
  }, null, 2)}\n`
  const { root, file } = glossary(initial)
  const entries = load(initial)
  assert.deepEqual(entries.map((entry) => [entry.term, entry.state, entry.legacyState]), [
    ["baratinho", "forbidden", undefined],
    ["casa", "allowed", undefined],
    ["em mãos", "allowed_with_care", "situationally_allowed"],
  ])
  assert.deepEqual(entries[0]?.categories, ["price"])

  const written = writeTerms(root, "pt-BR", "upsert", terms([{ state: "allowed", term: "lar", description: "casa", reason: "acolhe" }]))
  assert.deepEqual(written.warnings, ["2 rows still use a deprecated state or category. Run migrate."])
  const kept = JSON.parse(readFileSync(file, "utf8"))
  assert.equal(kept["em mãos"].state, "situationally_allowed")
  assert.equal(kept.baratinho.category, "price")

  const report = migrate(root, "pt-BR")
  assert.equal(report.written, false)
  assert.deepEqual(report.states, [{ term: "em mãos", from: "situationally_allowed", to: "allowed_with_care" }])
  assert.deepEqual(report.categories, [{ term: "baratinho", from: "price" }])
  assert.equal(JSON.parse(readFileSync(file, "utf8"))["em mãos"].state, "situationally_allowed")

  assert.equal(migrate(root, "pt-BR", true).written, true)
  const migrated = JSON.parse(readFileSync(file, "utf8"))
  assert.equal(migrated["em mãos"].state, "allowed_with_care")
  assert.equal(migrated["em mãos"].alternative, "entrega")
  assert.deepEqual(migrated.baratinho.categories, ["price"])
  assert.equal(migrated.baratinho.category, undefined)
  assert.equal(migrate(root, "pt-BR", true).written, false)
})

test("allowed_in and forbidden_in change the level of a read that carries the tag", () => {
  const { root } = glossary()
  writeTerms(root, "pt-BR", "insert", terms([
    { state: "discouraged", term: "imperdível", description: "promessa vaga", when: "com a cena", allowed_in: ["whatsapp"], forbidden_in: ["feed"] },
  ]))
  const reader = new Glossary(root)
  assert.equal(lookupTerm(reader, "pt-BR", "imperdível").state, "discouraged")
  const chat = lookupTerm(reader, "pt-BR", "imperdível", ["whatsapp"])
  assert.equal(chat.state, "allowed")
  assert.equal(chat.base_state, "discouraged")
  assert.equal(lookupTerm(reader, "pt-BR", "imperdível", ["whatsapp", "feed"]).state, "forbidden")
})

test("decided_by and source are stored, and an upsert finds a renamed term by its source", () => {
  const { root, file } = glossary()
  const source = "https://example.com/terms/42"
  writeTerms(root, "pt-BR", "insert", terms([
    { state: "forbidden", term: "baratinho", description: "barato demais", decided_by: "Maria Silva", source },
    { state: "allowed", term: "acessível", description: "preço justo", reason: "respeita", related: ["baratinho"] },
  ]))
  const again = writeTerms(root, "pt-BR", "upsert", terms([
    { state: "forbidden", term: "barateza", description: "barato demais", decided_by: "Maria Silva", source },
  ]))
  assert.deepEqual(again.updated.map((item) => item.term), ["barateza"])
  assert.deepEqual(again.inserted, [])
  const stored = JSON.parse(readFileSync(file, "utf8"))
  assert.equal(stored.baratinho, undefined)
  assert.equal(stored.barateza.source, source)
  assert.deepEqual(stored.barateza.decided_by, { name: "Maria Silva" })
  assert.deepEqual(stored["acessível"].related, ["barateza"])
  const same = writeTerms(root, "pt-BR", "upsert", terms([
    { state: "forbidden", term: "barateza", description: "barato demais", decided_by: "Maria Silva", source },
  ]))
  assert.equal(same.unchanged.length, 1)
})

test("decided_by keeps the people object, and a plain name from an older row reads as its name", () => {
  const { root, file } = glossary()
  writeFileSync(file, `${JSON.stringify({ casa: { state: "allowed", description: "lugar", reason: "simples", decided_by: "Maria Silva" } }, null, 2)}\n`)
  const person = { name: "Maria Silva", email: "maria.silva@example.com" }
  const same = writeTerms(root, "pt-BR", "upsert", terms([
    { state: "allowed", term: "casa", description: "lugar", reason: "simples", decided_by: "Maria Silva" },
  ]))
  assert.equal(same.unchanged.length, 1)
  const changed = writeTerms(root, "pt-BR", "upsert", terms([
    { state: "allowed", term: "casa", description: "lugar", reason: "simples", decided_by: person },
  ]))
  assert.equal(changed.updated.length, 1)
  assert.deepEqual(changed.updated[0]?.decided_by, person)
  assert.deepEqual(JSON.parse(readFileSync(file, "utf8")).casa.decided_by, person)
})

test("decided_by with an invalid e-mail or an unknown key is refused", () => {
  const { root, file } = glossary()
  assert.throws(() => writeTerms(root, "pt-BR", "insert", terms([
    { state: "allowed", term: "casa", description: "lugar", reason: "simples", decided_by: { name: "Maria Silva", email: "maria" } },
  ])))
  assert.throws(() => writeTerms(root, "pt-BR", "insert", terms([
    { state: "allowed", term: "casa", description: "lugar", reason: "simples", decided_by: { name: "Maria Silva", role: "tom de voz" } },
  ])))
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("two terms with the same source in one batch are refused", () => {
  const { root } = glossary()
  const source = "https://example.com/terms/1"
  assert.throws(
    () => writeTerms(root, "pt-BR", "insert", terms([
      { state: "allowed", term: "casa", source },
      { state: "allowed", term: "lar", source },
    ])),
    InvalidGlossary,
  )
})

const STORED = {
  casa: {
    state: "allowed_with_care",
    categories: ["voice"],
    description: "lugar",
    when: "depois da escolha principal",
    tags: ["loja"],
    decided_by: { name: "Maria Silva" },
    notes: "visto em 2026-10-22",
  },
}

function stored(): { root: string; file: string; text: string } {
  const text = `${JSON.stringify(STORED, null, 2)}\n`
  return { ...glossary(text), text }
}

function row(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(file, "utf8")).casa
}

for (const mode of ["update", "upsert"] as const) {
  test(`${mode} keeps every stored field that the call does not send`, () => {
    const { root, file } = stored()
    const written = writeTerms(root, "pt-BR", mode, terms([{ state: "allowed_with_care", term: "casa", reason: "acolhe" }]))
    assert.equal(written.updated.length, 1)
    assert.deepEqual(
      { ...row(file), examples: undefined },
      { ...STORED.casa, reason: "acolhe", examples: undefined },
    )
  })
}

test("a field sent empty is cleared and the others are kept", () => {
  const { root, file } = stored()
  writeTerms(root, "pt-BR", "update", terms([{ state: "allowed_with_care", term: "casa", notes: "", tags: [] }]))
  const cleared = row(file)
  assert.equal("notes" in cleared, false)
  assert.equal("tags" in cleared, false)
  assert.equal(cleared.description, "lugar")
  assert.equal(cleared.when, "depois da escolha principal")
})

test("an update that changes nothing is unchanged and leaves the file as it was", () => {
  const { root, file, text } = stored()
  const written = writeTerms(root, "pt-BR", "update", terms([{ state: "allowed_with_care", term: "casa", description: "lugar" }]))
  assert.equal(written.unchanged.length, 1)
  assert.equal(written.updated.length, 0)
  assert.equal(readFileSync(file, "utf8"), text)
})

test("an update that sends only the reason does not report a stored field as missing", () => {
  const { root } = stored()
  const written = writeTerms(root, "pt-BR", "update", terms([{ state: "allowed_with_care", term: "casa", reason: "acolhe" }]))
  assert.deepEqual(written.incomplete, [])
})

test("an update to a level that refuses a stored field is refused and writes nothing", () => {
  const { root, file, text } = stored()
  assert.throws(() => writeTerms(root, "pt-BR", "update", terms([{ state: "allowed", term: "casa" }])), /take no when/)
  assert.equal(readFileSync(file, "utf8"), text)
})

test("an update to that level is written once the call clears the refused fields", () => {
  const { root, file } = stored()
  writeTerms(root, "pt-BR", "update", terms([{ state: "allowed", term: "casa", when: "", tags: [] }]))
  const moved = row(file)
  assert.equal(moved.state, "allowed")
  assert.equal(moved.description, "lugar")
  assert.equal(moved.notes, "visto em 2026-10-22")
})

test("an insert of a term that is in the file leaves the stored row alone", () => {
  const { root, file, text } = stored()
  const written = writeTerms(root, "pt-BR", "insert", terms([{ state: "allowed_with_care", term: "casa", description: "outro" }]))
  assert.equal(written.unchanged.length, 1)
  assert.equal(readFileSync(file, "utf8"), text)
})

const MIXED = {
  language: "pt-BR",
  mode: "upsert",
  validation: "enforce",
  terms: [
    { state: "allowed", term: "casa", description: "lugar", reason: "acolhe", examples: ["casa"] },
    { state: "allowed", term: "lar", description: "lugar", reason: "acolhe", when: "em convite" },
    { state: "forbidden", term: "baratinho", description: "barato demais" },
    { state: "allowed", term: "porta", description: "entrada", reason: "acolhe" },
  ],
}

test("a refused batch lists every problem with its term and writes nothing", () => {
  const { root, file } = glossary()
  assert.throws(
    () => writeBatch(root, MIXED),
    (error: unknown) => {
      assert.ok(error instanceof InvalidTerms)
      assert.deepEqual(error.problems, [
        { term: "lar", message: "forbidden and allowed are general rules and take no when. Use allowed_with_care, discouraged, or strongly_discouraged." },
        { term: "casa", message: '"casa" cannot be its own example.' },
        { term: "baratinho", message: 'Provide the substitution of "baratinho".' },
      ])
      assert.match(error.message, /^3 problems\. The batch was not written\.\n- "lar": forbidden and allowed/)
      return true
    },
  )
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("a batch with one problem keeps the message of that problem", () => {
  const { root } = glossary()
  const batch = { ...MIXED, terms: [MIXED.terms[0]] }
  assert.throws(() => writeBatch(root, batch), { message: '"casa" cannot be its own example.' })
})

test("a dry run reports what a write would do and leaves the file as it was", () => {
  const { root, file } = glossary(`${JSON.stringify({ casa: { state: "allowed", description: "lugar", reason: "acolhe" } }, null, 2)}\n`)
  const before = readFileSync(file, "utf8")
  const written = writeBatch(root, {
    language: "pt-BR",
    mode: "upsert",
    dry_run: true,
    terms: [
      { state: "allowed", term: "casa", description: "lugar", reason: "acolhe" },
      { state: "allowed", term: "porta", description: "entrada" },
      { state: "allowed", term: "janela", description: "vista", reason: "abre" },
    ],
  })
  assert.equal(written.dry_run, true)
  assert.deepEqual(written.inserted.map((row) => row.term), ["porta", "janela"])
  assert.deepEqual(written.unchanged.map((row) => row.term), ["casa"])
  assert.deepEqual(written.incomplete, [{ term: "porta", missing: ["reason"] }])
  assert.deepEqual(written.refused, [])
  assert.equal(readFileSync(file, "utf8"), before)
})

test("a dry run of a batch with problems lists them as refused and inserts nothing", () => {
  const { root, file } = glossary()
  const written = writeBatch(root, { ...MIXED, dry_run: true })
  assert.deepEqual(written.inserted, [])
  assert.deepEqual(written.updated, [])
  assert.deepEqual(written.refused?.map((row) => row.term), ["lar", "casa", "baratinho"])
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("a term the schema refuses is listed with the problems of the write", () => {
  const { root } = glossary()
  const batch = {
    language: "pt-BR",
    mode: "upsert",
    dry_run: true,
    terms: [
      { state: "allowed", term: "lar", description: "lugar", reason: "acolhe", when: "em convite" },
      { state: "allowed", term: "casa", description: "lugar", reason: "acolhe", examples: ["casa"] },
    ],
  }
  const written = writeBatch(root, batch)
  assert.deepEqual(written.refused?.map((row) => row.term), ["lar", "casa"])
})

test("dry_run is true or false", () => {
  const { root } = glossary()
  assert.throws(() => writeBatch(root, { ...MIXED, dry_run: "yes" }), { message: "dry_run is true or false." })
})
