import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classify } from "./index.ts"
import { load } from "../../shared/glossary.ts"
import { createGlossaryServer } from "../../shared/server.ts"

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

test("allowed term keeps its registered spelling", () => {
  assert.deepEqual(classify(load(GLOSSARY), "Casa", "pt-BR"), {
    from: "query",
    language: "pt-BR",
    submitted: "Casa",
    to: "allowed",
    term: "casa",
  })
})

test("forbidden term includes the recommended term", () => {
  assert.deepEqual(classify(load(GLOSSARY), "baratinho", "pt-BR"), {
    from: "query",
    language: "pt-BR",
    submitted: "baratinho",
    to: "forbidden",
    term: "baratinho",
    recommended: "acessível",
  })
})

test("forbidden term can omit the recommended term", () => {
  const response = classify(load(GLOSSARY), "promo", "pt-BR")
  assert.equal(response.to, "forbidden")
  assert.equal(response.recommended, undefined)
})

test("situational term includes the always-allowed term", () => {
  assert.deepEqual(classify(load(GLOSSARY), "EM   MÃOS", "pt-BR"), {
    from: "query",
    language: "pt-BR",
    submitted: "EM MÃOS",
    to: "situationally_allowed",
    term: "em mãos",
    always_allowed: "entrega",
  })
})

test("a missing term is not allowed", () => {
  assert.deepEqual(classify(load(GLOSSARY), "inexistente", "pt-BR"), {
    from: "query",
    language: "pt-BR",
    submitted: "inexistente",
    to: "not_registered",
  })
})

test("lookup hits the middle and the ends", () => {
  const entries = load(GLOSSARY)
  assert.equal(classify(entries, "açúcar", "pt-BR").to, "allowed")
  assert.equal(classify(entries, "caça", "pt-BR").term, "caça")
  assert.equal(classify(entries, "promo", "pt-BR").term, "promo")
})

test("the same term can differ by language", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), '{ "drop": { "state": "situationally_allowed", "alternative": "coleção" } }\n')
  writeFileSync(join(root, "en.json"), '{ "drop": { "state": "allowed" } }\n')
  const portuguese = classify(load(readFileSync(join(root, "pt-BR.json"), "utf8")), "drop", "pt-BR")
  const english = classify(load(readFileSync(join(root, "en.json"), "utf8")), "drop", "en")
  assert.equal(portuguese.to, "situationally_allowed")
  assert.equal(portuguese.always_allowed, "coleção")
  assert.equal(english.to, "allowed")
  assert.equal(english.always_allowed, undefined)
})

test("a term in English is absent from Portuguese", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), EMPTY)
  writeFileSync(join(root, "en.json"), '{ "drop": { "state": "allowed" } }\n')
  const portuguese = classify(load(readFileSync(join(root, "pt-BR.json"), "utf8")), "drop", "pt-BR")
  assert.equal(portuguese.to, "not_registered")
})

test("POST classifies one language", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), '{ "baratinho": { "state": "forbidden", "alternative": "acessível" } }\n')
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/classify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "baratinho" }),
    })
    const body = await response.json()
    assert.equal(body.language, "pt-BR")
    assert.equal(body.to, "forbidden")
    assert.equal(body.recommended, "acessível")
    const unknown = await fetch(`http://127.0.0.1:${port}/v1/classify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "it", term: "baratinho" }),
    })
    assert.equal(unknown.status, 400)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
