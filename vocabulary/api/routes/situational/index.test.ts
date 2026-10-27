import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "../classify/index.ts"
import { load } from "../../shared/glossary.ts"
import { withServer } from "../../shared/testing.ts"

const TERM = "\u2026"
const WHEN =
  "para suavizar o tom em interfaces de usuário, como no e-commerce, especialmente em frases no imperativo, criando uma sensação de continuidade e gentileza."
const EXAMPLE = "Leve também\u2026"

const BODY = {
  language: "pt-BR",
  term: TERM,
  category: "punctuation",
  description: "reticências",
  when: WHEN,
  examples: [EXAMPLE],
}

test("POST registers a situational term and creates the missing example", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, TERM)
    assert.equal(body.state, "allowed_with_care")
    assert.deepEqual(body.categories, ["punctuation"])
    assert.equal(body.description, "reticências")
    assert.equal(body.when, WHEN)
    assert.deepEqual(body.examples, [EXAMPLE])

    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const mark = entries.find((entry) => entry.term === TERM)
    assert.equal(mark?.state, "allowed_with_care")
    assert.deepEqual(mark?.categories, ["punctuation"])
    assert.equal(mark?.when, WHEN)
    assert.equal(mark?.alternative, null)
    assert.equal(entries.find((entry) => entry.term === EXAMPLE)?.state, "allowed_with_care")
    const classified = classify(entries, TERM, "pt-BR")
    assert.equal(classified.to, "allowed_with_care")
    assert.equal(classified.always_allowed, undefined)
    assert.equal(classify(entries, EXAMPLE, "pt-BR").to, "allowed_with_care")

    const again = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(again.status, 400)
    assert.equal(load(readFileSync(join(root, "pt-BR.json"), "utf8")).length, 2)
  })
})

test("an existing example is linked and a category stays in English", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `{ ${JSON.stringify(EXAMPLE)}: { "state": "allowed" } }\n`)
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, category: "Punctuation" }),
    })
    const body = await response.json()
    assert.deepEqual(body.categories, ["punctuation"])
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.filter((entry) => entry.term === EXAMPLE).length, 1)
    assert.equal(entries.find((entry) => entry.term === EXAMPLE)?.state, "allowed")
    const translated = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "...", category: "pontuação" }),
    })
    assert.equal(translated.status, 400)
    assert.equal((await translated.json()).error, "A category is an English word.")
  })
})

test("POST keeps the casing of a case-sensitive term", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "eBay", category: "brand", examples: [], case_sensitive: true }),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, "eBay")
    assert.equal(body.case_sensitive, true)
    const stored = JSON.parse(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(stored["eBay"].case_sensitive, true)
  })
})

test("an example with a real link is refused and leaves the file unchanged", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, examples: ["Leve também https://example.com/tarefa"] }),
    })
    assert.equal(response.status, 400)
    assert.match((await response.json()).error, /A term or an example takes no real link/)
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  })
})
