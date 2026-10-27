import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classifyText } from "./index.ts"
import { load } from "../../shared/glossary.ts"
import { withServer } from "../../shared/testing.ts"

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

test("a stop word without a level reads as stop_word", () => {
  const glossary = load(`{
  "casa": { "state": "allowed" },
  "na": { "stop_word": true },
  "no": { "stop_word": true }
}
`)
  const words = classifyText(glossary, "Trabalho na casa", "pt-BR").words
  assert.deepEqual(words.map((word) => word.to), ["not_registered", "stop_word", "allowed"])
  assert.equal(words[1]?.stop_word, true)
})

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
  await withServer(root, async (base) => {
    const phrase = await fetch(`${base}/v1/classify-text`, {
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
    const empty = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "   " }),
    })
    assert.equal(empty.status, 400)
  })
})

test("each word of a case-sensitive term says whether its casing matches", () => {
  const entries = load(`{\n  "cueca": { "state": "allowed" },\n  "eBay": { "state": "allowed", "case_sensitive": true }\n}\n`)
  const words = classifyText(entries, "Cueca no Ebay e no eBay", "pt-BR").words
  assert.deepEqual(
    words.map((word) => [word.submitted, word.term, word.case_matches]),
    [["Cueca", "cueca", undefined], ["no", undefined, undefined], ["Ebay", "eBay", false], ["e", undefined, undefined], ["no", undefined, undefined], ["eBay", "eBay", true]],
  )
})
