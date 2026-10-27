import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "../classify/index.ts"
import { load } from "../../shared/glossary.ts"
import { withServer } from "../../shared/testing.ts"

const SUBSTITUTION =
  "evitar e substituir por alternativas como vírgula, ponto, dois-pontos ou parênteses, conforme o contexto."

const BODY = {
  language: "pt-BR",
  term: "—",
  category: "punctuation",
  description: "Travessão",
  substitution: SUBSTITUTION,
  rejected: ["Que alegria — sério."],
  alternatives: ["Que alegria, sério.", "Que alegria! Sério.", "Que alegria: sério."],
}

test("POST registers a forbidden term and creates the missing examples", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, "—")
    assert.equal(body.state, "forbidden")
    assert.deepEqual(body.categories, ["punctuation"])
    assert.equal(body.description, "Travessão")
    assert.equal(body.substitution, SUBSTITUTION)
    assert.deepEqual(body.rejected, ["Que alegria — sério."])
    assert.deepEqual(body.alternatives, ["Que alegria, sério.", "Que alegria! Sério.", "Que alegria: sério."])

    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const dash = entries.find((entry) => entry.term === "—")
    assert.equal(dash?.state, "forbidden")
    assert.deepEqual(dash?.categories, ["punctuation"])
    assert.equal(entries.find((entry) => entry.term === "Que alegria — sério.")?.state, "forbidden")
    assert.equal(entries.find((entry) => entry.term === "Que alegria, sério.")?.state, "allowed")
    assert.equal(entries.find((entry) => entry.term === "Que alegria! Sério.")?.state, "allowed")
    assert.equal(entries.find((entry) => entry.term === "Que alegria: sério.")?.state, "allowed")
    assert.equal(classify(entries, "—", "pt-BR").to, "forbidden")
    assert.equal(classify(entries, "Que alegria — sério.", "pt-BR").to, "forbidden")
    assert.equal(classify(entries, "Que alegria, sério.", "pt-BR").to, "allowed")

    const again = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(again.status, 400)
    assert.equal(load(readFileSync(join(root, "pt-BR.json"), "utf8")).length, 5)
  })
})

test("an existing example is linked and a category stays in English", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), '{ "Que alegria, sério.": { "state": "allowed" } }\n')
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, category: "Punctuation" }),
    })
    const body = await response.json()
    assert.deepEqual(body.categories, ["punctuation"])
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.filter((entry) => entry.term === "Que alegria, sério.").length, 1)
    const translated = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "–", category: "pontuação" }),
    })
    assert.equal(translated.status, 400)
    assert.equal((await translated.json()).error, "A category is an English word.")
    const positive = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "🔥", examples: ["Legenda com 🔥"] }),
    })
    assert.equal(positive.status, 400)
    assert.equal((await positive.json()).error, "A forbidden example belongs in rejected.")
  })
})

test("POST keeps the casing of a case-sensitive term", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "IPHONE", category: "brand", rejected: [], alternatives: [], case_sensitive: true }),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, "IPHONE")
    assert.equal(body.case_sensitive, true)
    const stored = JSON.parse(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(stored["IPHONE"].case_sensitive, true)
  })
})

test("a rejected example or an alternative with a real link is refused and leaves the file unchanged", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, rejected: ["Veja https://example.com/tarefa"], alternatives: ["Veja [link da tarefa]"] }),
    })
    assert.equal(response.status, 400)
    assert.match((await response.json()).error, /A term or an example takes no real link/)
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  })
})
