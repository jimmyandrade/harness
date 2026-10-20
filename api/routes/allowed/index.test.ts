import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "../classify/index.ts"
import { load } from "../../shared/glossary.ts"
import { createGlossaryServer } from "../../shared/server.ts"

const REASON = "Dá um ar mais radiante e celebrativo para a frase."
const EXAMPLE = "Nossa, essa peça ficou muito boa em você!"

const BODY = {
  language: "pt-BR",
  term: "!",
  category: "punctuation",
  description: "Ponto de exclamação",
  reason: REASON,
  examples: [EXAMPLE],
}

test("POST registers an allowed term and creates the missing example", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/allowed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(BODY),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.term, "!")
    assert.equal(body.state, "allowed")
    assert.deepEqual(body.categories, ["punctuation"])
    assert.equal(body.description, "Ponto de exclamação")
    assert.equal(body.reason, REASON)
    assert.deepEqual(body.examples, [EXAMPLE])

    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const mark = entries.find((entry) => entry.term === "!")
    assert.equal(mark?.state, "allowed")
    assert.deepEqual(mark?.categories, ["punctuation"])
    assert.equal(mark?.alternative, null)
    assert.equal(entries.find((entry) => entry.term === EXAMPLE)?.state, "allowed")
    assert.equal(classify(entries, "!", "pt-BR").to, "allowed")
    assert.equal(classify(entries, EXAMPLE, "pt-BR").to, "allowed")

    const again = await fetch(`http://127.0.0.1:${port}/v1/allowed`, {
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
    const response = await fetch(`http://127.0.0.1:${port}/v1/allowed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, category: "Punctuation" }),
    })
    const body = await response.json()
    assert.deepEqual(body.categories, ["punctuation"])
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.filter((entry) => entry.term === EXAMPLE).length, 1)
    const translated = await fetch(`http://127.0.0.1:${port}/v1/allowed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "?", category: "pontuação" }),
    })
    assert.equal(translated.status, 400)
    assert.equal((await translated.json()).error, "A category is an English word.")
    const situated = await fetch(`http://127.0.0.1:${port}/v1/allowed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...BODY, term: "leve também", when: "no imperativo do e-commerce" }),
    })
    assert.equal(situated.status, 400)
    assert.equal((await situated.json()).error, "forbidden and allowed are general rules and take no when. Use allowed_with_care, discouraged, or strongly_discouraged.")
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST keeps the casing of a case-sensitive term and lowercases an ordinary one", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const post = (body: unknown) =>
    fetch(`http://127.0.0.1:${port}/v1/allowed`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
  try {
    const brand = await post({ ...BODY, term: "iPhone", category: "brand", examples: [], case_sensitive: true })
    assert.equal(brand.status, 200)
    const registered = await brand.json()
    assert.equal(registered.term, "iPhone")
    assert.equal(registered.case_sensitive, true)
    const ordinary = await (await post({ ...BODY, term: "Cueca", category: "word", examples: [] })).json()
    assert.equal(ordinary.term, "cueca")
    assert.equal("case_sensitive" in ordinary, false)
    const stored = JSON.parse(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(stored.iPhone.case_sensitive, true)
    assert.equal("case_sensitive" in stored.cueca, false)
    const refused = await post({ ...BODY, term: "eBay", examples: [], case_sensitive: "sim" })
    assert.equal(refused.status, 400)
    assert.equal((await refused.json()).error, "case_sensitive is true or false.")
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
