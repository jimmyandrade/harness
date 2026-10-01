import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { run } from "./cli.ts"
import { load } from "./shared/glossary.ts"

const ALLOWED = [
  "--language",
  "pt-BR",
  "--mode",
  "insert",
  "--state",
  "allowed",
  "--term",
  "!",
  "--category",
  "punctuation",
  "--description",
  "Ponto de exclamação",
  "--reason",
  "usar",
]

test("terms writes flags and leaves an existing term on insert", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const lines: string[] = []
  const write = console.log
  console.log = (line: string) => lines.push(line)
  try {
    assert.equal(run(["--glossary", root, "terms", ...ALLOWED]), 0)
    assert.equal(load(readFileSync(file, "utf8")).find((entry) => entry.term === "!")?.state, "allowed")
    const again = run(["--glossary", root, "terms", ...ALLOWED.slice(0, 11), "outro", ...ALLOWED.slice(12)])
    assert.equal(again, 0)
    const body = JSON.parse(lines.at(-1) ?? "{}")
    assert.deepEqual(body.unchanged, [{ term: "!", reason: "Already in the glossary." }])
    assert.deepEqual(body.skipped, [])
    assert.equal(load(readFileSync(file, "utf8")).find((entry) => entry.term === "!")?.description, "Ponto de exclamação")
  } finally {
    console.log = write
  }
})

test("a second --term joins the same batch and a bad category writes nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language=pt-BR",
      "--mode=insert",
      "--state",
      "forbidden",
      "--term",
      "—",
      "--category",
      "punctuation",
      "--description",
      "Travessão",
      "--substitution",
      "vírgula",
      "--rejected",
      "Que alegria — sério.",
      "--alternatives",
      "Que alegria, sério.",
      "--term",
      "!",
      "--state",
      "allowed",
      "--category",
      "punctuation",
      "--description",
      "Ponto de exclamação",
      "--reason",
      "usar",
      "--examples",
      "Nossa, essa peça ficou muito boa em você!",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "—")?.state, "forbidden")
  assert.equal(entries.find((entry) => entry.term === "!")?.examples?.[0], "Nossa, essa peça ficou muito boa em você!")
  const before = readFileSync(file, "utf8")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "insert",
      "--state",
      "allowed",
      "--term",
      "?",
      "--category",
      "pontuação",
      "--description",
      "Ponto",
      "--reason",
      "usar",
    ]),
    2,
  )
  assert.equal(readFileSync(file, "utf8"), before)
})

test("terms stores a bad cart notice and a look line", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "insert",
      "--state",
      "forbidden",
      "--term",
      "Itens deixados no carrinho",
      "--category",
      "notification",
      "--description",
      "Não funciona como assunto de e-mail ou notificação: não cria tensão suficiente para a pessoa abrir.",
      "--substitution",
      "foco em look",
      "--rejected",
      "Suas peças continuam te esperando",
      "--alternatives",
      "Você deixou um look pra trás",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "itens deixados no carrinho")?.state, "forbidden")
  assert.match(entries.find((entry) => entry.term === "itens deixados no carrinho")?.description ?? "", /tensão/)
  assert.equal(entries.find((entry) => entry.term === "Você deixou um look pra trás")?.state, "allowed")
})

test("terms refuses a positive example on a forbidden term", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const errors: string[] = []
  const write = console.error
  console.error = (line: string) => errors.push(line)
  try {
    assert.equal(
      run([
        "--glossary",
        root,
        "terms",
        "--language",
        "pt-BR",
        "--mode",
        "insert",
        "--state",
        "forbidden",
        "--term",
        "🔥",
        "--category",
        "emoji",
        "--description",
        "fogo",
        "--substitution",
        "não usar",
        "--rejected",
        "Legenda com 🔥",
        "--alternatives",
        "sem emoji",
        "--examples",
        "Legenda com 🔥",
      ]),
      2,
    )
    assert.equal(errors.at(-1), "A forbidden example belongs in rejected.")
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  } finally {
    console.error = write
  }
})

test("terms refuses a general rule that carries a situation", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const errors: string[] = []
  const write = console.error
  console.error = (line: string) => errors.push(line)
  try {
    assert.equal(run(["--glossary", root, "terms", ...ALLOWED, "--when", "no imperativo do e-commerce"]), 2)
    assert.equal(errors.at(-1), "A term that only fits one situation is situationally_allowed.")
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  } finally {
    console.error = write
  }
})

test("terms keeps a plural on its own row", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  const initial = `${JSON.stringify({ casa: { state: "allowed", description: "lugar", examples: ["na casa"] }, casas: { state: "allowed" } }, null, 2)}\n`
  writeFileSync(file, initial)
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "upsert",
      "--state",
      "allowed",
      "--term",
      "casas",
      "--category",
      "word",
      "--description",
      "moradias",
      "--reason",
      "morar",
      "--examples",
      "várias",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
  assert.equal(entries.find((entry) => entry.term === "casas")?.description, "moradias")
})
