import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classifyText } from "./index.ts"
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

test("each word keeps its own state", () => {
  const response = classifyText(load(GLOSSARY), "A casa baratinho em mãos", "pt-BR")
  assert.equal(response.submitted, "A casa baratinho em mãos")
  assert.deepEqual(
    response.words.map((word) => word.to),
    ["not_registered", "allowed", "forbidden", "not_registered", "not_registered"],
  )
  assert.equal(response.words[2].recommended, "acessível")
})

test("punctuation stays outside the word", () => {
  const response = classifyText(load(GLOSSARY), "Casa, baratinho!", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => [word.submitted, word.to, word.term]),
    [
      ["Casa", "allowed", "casa"],
      [",", "not_registered", undefined],
      ["baratinho", "forbidden", "baratinho"],
      ["!", "not_registered", undefined],
    ],
  )
})

test("an emoji is classified on its own", () => {
  const response = classifyText(load('{ "❤️": { "state": "forbidden" } }'), "pronta ❤️!", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => [word.submitted, word.to]),
    [
      ["pronta", "not_registered"],
      ["❤️", "forbidden"],
      ["!", "not_registered"],
    ],
  )
})

test("a joined emoji stays one token", () => {
  const response = classifyText(load("{}"), "👩‍❤️‍👨 🇧🇷 👍🏻 ‼️", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => word.submitted),
    ["👩‍❤️‍👨", "🇧🇷", "👍🏻", "‼️"],
  )
})

test("a glossary expression is not matched as one word", () => {
  const response = classifyText(load(GLOSSARY), "em mãos", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => word.to),
    ["not_registered", "not_registered"],
  )
})

test("POST classifies each word", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    '{ "baratinho": { "state": "forbidden", "alternative": "acessível" }, "casa": { "state": "allowed" } }\n',
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const phrase = await fetch(`http://127.0.0.1:${port}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "A casa, baratinho!" }),
    })
    const words = (await phrase.json()).words.map((word: { submitted: string; to: string }) => [word.submitted, word.to])
    assert.deepEqual(words, [
      ["A", "not_registered"],
      ["casa", "allowed"],
      [",", "not_registered"],
      ["baratinho", "forbidden"],
      ["!", "not_registered"],
    ])
    const empty = await fetch(`http://127.0.0.1:${port}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "   " }),
    })
    assert.equal(empty.status, 400)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
