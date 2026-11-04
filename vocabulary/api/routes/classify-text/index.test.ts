import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classifyPhrase, classifyText } from "./index.ts"
import { Glossary, load } from "../../shared/glossary.ts"
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

test("classifyPhrase with tags leaves out the rows of another speaker", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ casa: { state: "allowed" }, povo: { state: "allowed", tags: ["maria-silva", "palco"] } }, null, 2)}\n`,
  )
  const read = (tags: string[]) =>
    classifyPhrase(new Glossary(root), "pt-BR", "casa povo", tags).words.map((word) => word.to)
  assert.deepEqual(read(["festival"]), ["allowed", "not_registered"])
  assert.deepEqual(read(["maria-silva", "palco"]), ["allowed", "allowed"])
})

test("a word with only a substitution comes back with it as recommended", () => {
  const entries = load('{ "chave": { "state": "strongly_discouraged", "substitution": "feature toggle" } }')
  assert.equal(classifyText(entries, "ligue a chave", "pt-BR").words[2]?.recommended, "feature toggle")
})

const CONTEXT_GLOSSARY = `{
  "casa": { "state": "allowed" },
  "vcs": {
    "state": "allowed_with_care",
    "allowed_in": ["chat"],
    "forbidden_in": ["review", "technical-doc"],
    "reason": "Informal in written reviews.",
    "when": "Write the full word in a review.",
    "alternatives": ["vocês"]
  }
}`

test("a tag in forbidden_in reads the word as forbidden, with the base level, the reason, and the alternatives", () => {
  const words = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "casa vcs", ["review"]).words
  assert.deepEqual(words.map((word) => word.to), ["allowed", "forbidden"])
  assert.equal(words[1]?.base_state, "allowed_with_care")
  assert.equal(words[1]?.reason, "Informal in written reviews.")
  assert.equal(words[1]?.when, "Write the full word in a review.")
  assert.deepEqual(words[1]?.alternatives, ["vocês"])
  assert.equal(words[1]?.always_allowed, undefined)
})

test("a tag in allowed_in reads the word as allowed and keeps the base level", () => {
  const word = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "vcs", ["chat"]).words[0]
  assert.equal(word?.to, "allowed")
  assert.equal(word?.base_state, "allowed_with_care")
  assert.equal(word?.reason, undefined)
})

test("without tags, or with tags the row does not name, the level stays the stored one", () => {
  const glossary = new Glossary(writeRoot(CONTEXT_GLOSSARY))
  for (const tags of [[], ["festival"]]) {
    const word = classifyPhrase(glossary, "pt-BR", "vcs", tags).words[0]
    assert.equal(word?.to, "allowed_with_care")
    assert.equal(word?.base_state, undefined)
    assert.equal(word?.reason, undefined)
    assert.equal(word?.alternatives, undefined)
  }
})

test("forbidden_in wins over allowed_in when the read carries both tags", () => {
  const word = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "vcs", ["chat", "review"]).words[0]
  assert.equal(word?.to, "forbidden")
})

test("POST with tags in forbidden_in returns forbidden", async () => {
  await withServer(writeRoot(CONTEXT_GLOSSARY), async (base) => {
    const response = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "vcs", tags: ["technical-doc"] }),
    })
    assert.equal((await response.json()).words[0].to, "forbidden")
  })
})

function writeRoot(contents: string): string {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), contents)
  return root
}
