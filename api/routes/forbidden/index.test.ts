import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "../classify/index.ts"
import { load } from "../../shared/glossary.ts"
import { createGlossaryServer } from "../../shared/server.ts"

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
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, "—")
    assert.equal(body.state, "forbidden")
    assert.equal(body.category, "punctuation")
    assert.equal(body.description, "Travessão")
    assert.equal(body.substitution, SUBSTITUTION)
    assert.deepEqual(body.rejected, ["Que alegria — sério."])
    assert.deepEqual(body.alternatives, ["Que alegria, sério.", "Que alegria! Sério.", "Que alegria: sério."])

    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const dash = entries.find((entry) => entry.term === "—")
    assert.equal(dash?.state, "forbidden")
    assert.equal(dash?.category, "punctuation")
    assert.equal(entries.find((entry) => entry.term === "Que alegria — sério.")?.state, "forbidden")
    assert.equal(entries.find((entry) => entry.term === "Que alegria, sério.")?.state, "allowed")
    assert.equal(entries.find((entry) => entry.term === "Que alegria! Sério.")?.state, "allowed")
    assert.equal(entries.find((entry) => entry.term === "Que alegria: sério.")?.state, "allowed")
    assert.equal(classify(entries, "—", "pt-BR").to, "forbidden")
    assert.equal(classify(entries, "Que alegria — sério.", "pt-BR").to, "forbidden")
    assert.equal(classify(entries, "Que alegria, sério.", "pt-BR").to, "allowed")

    const again = await fetch(`http://127.0.0.1:${port}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(again.status, 400)
    assert.equal(load(readFileSync(join(root, "pt-BR.json"), "utf8")).length, 5)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("an existing example is linked and a category stays in English", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), '{ "Que alegria, sério.": { "state": "allowed" } }\n')
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, category: "Punctuation" }),
    })
    const body = await response.json()
    assert.equal(body.category, "punctuation")
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.filter((entry) => entry.term === "Que alegria, sério.").length, 1)
    const translated = await fetch(`http://127.0.0.1:${port}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "–", category: "pontuação" }),
    })
    assert.equal(translated.status, 400)
    assert.equal((await translated.json()).error, "A category is an English word.")
    const positive = await fetch(`http://127.0.0.1:${port}/v1/forbidden`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "🔥", examples: ["Legenda com 🔥"] }),
    })
    assert.equal(positive.status, 400)
    assert.equal((await positive.json()).error, "A forbidden example belongs in rejected.")
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
