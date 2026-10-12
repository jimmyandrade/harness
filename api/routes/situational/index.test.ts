import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "../classify/index.ts"
import { load } from "../../shared/glossary.ts"
import { createGlossaryServer } from "../../shared/server.ts"

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
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, TERM)
    assert.equal(body.state, "situationally_allowed")
    assert.equal(body.category, "punctuation")
    assert.equal(body.description, "reticências")
    assert.equal(body.when, WHEN)
    assert.deepEqual(body.examples, [EXAMPLE])

    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const mark = entries.find((entry) => entry.term === TERM)
    assert.equal(mark?.state, "situationally_allowed")
    assert.equal(mark?.category, "punctuation")
    assert.equal(mark?.when, WHEN)
    assert.equal(mark?.alternative, null)
    assert.equal(entries.find((entry) => entry.term === EXAMPLE)?.state, "situationally_allowed")
    const classified = classify(entries, TERM, "pt-BR")
    assert.equal(classified.to, "situationally_allowed")
    assert.equal(classified.always_allowed, undefined)
    assert.equal(classify(entries, EXAMPLE, "pt-BR").to, "situationally_allowed")

    const again = await fetch(`http://127.0.0.1:${port}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(again.status, 400)
    assert.equal(load(readFileSync(join(root, "pt-BR.json"), "utf8")).length, 2)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("an existing example is linked and a category stays in English", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `{ ${JSON.stringify(EXAMPLE)}: { "state": "allowed" } }\n`)
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, category: "Punctuation" }),
    })
    const body = await response.json()
    assert.equal(body.category, "punctuation")
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.filter((entry) => entry.term === EXAMPLE).length, 1)
    assert.equal(entries.find((entry) => entry.term === EXAMPLE)?.state, "allowed")
    const translated = await fetch(`http://127.0.0.1:${port}/v1/situational`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "...", category: "pontuação" }),
    })
    assert.equal(translated.status, 400)
    assert.equal((await translated.json()).error, "A category is an English word.")
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
