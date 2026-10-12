import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { load } from "../../shared/glossary.ts"
import { createGlossaryServer } from "../../shared/server.ts"

const MARK = "!"
const ELLIPSIS = "\u2026"
const PHRASE = "Leve também\u2026"

function allowed(term: string, description: string, examples: string[] = []) {
  return {
    state: "allowed",
    term,
    category: "punctuation",
    description,
    reason: "usar",
    examples,
  }
}

function situational(term: string, description: string, examples: string[] = []) {
  return {
    state: "situationally_allowed",
    term,
    category: "punctuation",
    description,
    when: "quando o tom pede suavidade",
    examples,
  }
}

async function withGlossary(initial: string, run: (port: number, root: string) => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, initial)
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    await run(port, root)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}

function post(port: number, body: unknown) {
  return fetch(`http://127.0.0.1:${port}/v1/terms`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("upsert inserts mixed terms and keeps a linked example that is sent in full", async () => {
  await withGlossary("{}\n", async (port, root) => {
    const response = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [
        situational(ELLIPSIS, "reticências", [PHRASE]),
        situational(PHRASE, "convite"),
        {
          state: "forbidden",
          term: "—",
          category: "punctuation",
          description: "Travessão",
          substitution: "vírgula",
          rejected: ["Que alegria — sério."],
          alternatives: [MARK],
        },
        allowed(MARK, "Ponto de exclamação"),
      ],
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.mode, "upsert")
    assert.equal(body.inserted.length, 4)
    assert.deepEqual(body.updated, [])
    assert.deepEqual(body.skipped, [])
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const phrase = PHRASE.toLowerCase()
    assert.equal(entries.find((entry) => entry.term === phrase)?.description, "convite")
    assert.equal(entries.find((entry) => entry.term === MARK)?.state, "allowed")
    assert.equal(entries.find((entry) => entry.term === "Que alegria — sério.")?.state, "forbidden")
    assert.equal(entries.find((entry) => entry.term === ELLIPSIS)?.examples?.[0], phrase)
  })
})

test("insert leaves an existing term and update leaves a missing term", async () => {
  const initial = `{ ${JSON.stringify(MARK)}: { "state": "allowed", "description": "Ponto" } }\n`
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const inserted = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [allowed(MARK, "outro"), situational(ELLIPSIS, "reticências")],
    })
    const insertedBody = await inserted.json()
    assert.equal(insertedBody.inserted.length, 1)
    assert.equal(insertedBody.inserted[0].term, ELLIPSIS)
    assert.deepEqual(insertedBody.unchanged, [{ term: MARK, reason: "Already in the glossary." }])
    assert.deepEqual(insertedBody.skipped, [])
    assert.equal(load(readFileSync(file, "utf8")).find((entry) => entry.term === MARK)?.description, "Ponto")

    const updated = await post(port, {
      language: "pt-BR",
      mode: "update",
      terms: [allowed(MARK, "Ponto de exclamação"), situational(PHRASE, "convite")],
    })
    const updatedBody = await updated.json()
    assert.equal(updatedBody.updated.length, 1)
    assert.equal(updatedBody.updated[0].description, "Ponto de exclamação")
    assert.deepEqual(updatedBody.skipped, [{ term: PHRASE, reason: "Not in the glossary." }])
    const entries = load(readFileSync(file, "utf8"))
    assert.equal(entries.find((entry) => entry.term === PHRASE), undefined)
    assert.equal(entries.find((entry) => entry.term === MARK)?.description, "Ponto de exclamação")
  })
})

test("update keeps the stored spelling and replaces the previous state fields", async () => {
  const initial = JSON.stringify(
    {
      [MARK]: { state: "allowed", category: "punctuation", description: "Ponto", reason: "radiante", examples: ["casa"] },
      casa: { state: "allowed", description: "casa" },
    },
    null,
    2,
  )
  await withGlossary(`${initial}\n`, async (port, root) => {
    const response = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [
        {
          state: "forbidden",
          term: "Casa",
          category: "word",
          description: "lugar",
          substitution: "morada",
          rejected: [],
          alternatives: [],
        },
      ],
    })
    assert.equal(response.status, 200)
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    const house = entries.find((entry) => entry.term === "casa")
    assert.equal(house?.state, "forbidden")
    assert.equal(house?.reason, undefined)
    assert.equal(house?.substitution, "morada")
    assert.equal(entries.find((entry) => entry.term === "Casa"), undefined)
    assert.equal(entries.find((entry) => entry.term === MARK)?.examples?.[0], "casa")
  })
})

const CART_BAD = "Não funciona como assunto de e-mail ou notificação: não cria tensão suficiente para a pessoa abrir."
const CART_GOOD = "O foco em look conecta moda, presença e construção de imagem melhor do que item, peça ou roupa isolada."

test("a passive cart notice is a bad example and a look line can be a good one", async () => {
  await withGlossary("{}\n", async (port, root) => {
    const file = join(root, "pt-BR.json")
    const stored = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [
        {
          state: "forbidden",
          term: "Suas peças continuam te esperando",
          category: "notification",
          description: CART_BAD,
          substitution: "foco em look",
          rejected: ["Seu carrinho está pronto para o checkout", "Itens deixados no carrinho"],
          alternatives: [],
        },
        {
          state: "situationally_allowed",
          term: "Você deixou um look pra trás",
          category: "notification",
          description: CART_GOOD,
          when: "recuperar carrinho abandonado",
          examples: [
            "Seu look ficou no caminho",
            "Não deixa esse look escapar",
            "Tem um look quase seu no carrinho",
            "Se demorar, esse look te abandona",
          ],
        },
      ],
    })
    assert.equal(stored.status, 200)
    const entries = load(readFileSync(file, "utf8"))
    const bad = entries.find((entry) => entry.term === "suas peças continuam te esperando")
    assert.equal(bad?.state, "forbidden")
    assert.equal(bad?.description, CART_BAD)
    const good = entries.find((entry) => entry.term === "você deixou um look pra trás")
    assert.equal(good?.state, "situationally_allowed")
    assert.equal(good?.description, CART_GOOD)
    assert.equal(entries.find((entry) => entry.term === "Seu look ficou no caminho")?.state, "situationally_allowed")
  })
})

test("a cliché stays forbidden and keeps the phrase to avoid", async () => {
  await withGlossary("{}\n", async (port, root) => {
    const file = join(root, "pt-BR.json")
    const refused = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [{ ...allowed("exclusivo", "intenção"), category: "cliche" }],
    })
    assert.equal(refused.status, 400)
    assert.equal((await refused.json()).error, "A cliché is forbidden.")
    assert.equal(readFileSync(file, "utf8"), "{}\n")
    const stored = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [
        {
          state: "forbidden",
          term: "exclusivo",
          category: "cliche",
          description: "Substitua a palavra literal por imagem, cena, ação, efeito ou situação com a mesma sensação.",
          substitution: "imagem, cena, ação, efeito ou situação",
          rejected: ["peça exclusiva"],
          alternatives: [],
        },
      ],
    })
    assert.equal(stored.status, 200)
    const entries = load(readFileSync(file, "utf8"))
    const row = entries.find((entry) => entry.term === "exclusivo")
    assert.equal(row?.state, "forbidden")
    assert.equal(row?.category, "cliche")
    assert.match(row?.description ?? "", /imagem, cena, ação, efeito ou situação/)
    assert.deepEqual(row?.rejected, ["peça exclusiva"])
  })
})

test("related points at a registered term and a missing one is refused", async () => {
  await withGlossary("{}\n", async (port, root) => {
    const file = join(root, "pt-BR.json")
    const linked = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [
        { ...allowed("casa", "lugar"), related: ["casas"] },
        { ...allowed("casas", "moradias"), related: ["casa"] },
      ],
    })
    assert.equal(linked.status, 200)
    const entries = load(readFileSync(file, "utf8"))
    assert.deepEqual(entries.find((entry) => entry.term === "casa")?.related, ["casas"])
    assert.deepEqual(entries.find((entry) => entry.term === "casas")?.related, ["casa"])
    const before = readFileSync(file, "utf8")
    const missing = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [{ ...allowed("moradia", "lar"), related: ["lares"] }],
    })
    assert.equal(missing.status, 400)
    assert.equal((await missing.json()).error, '"lares" is not in the glossary.')
    assert.equal(readFileSync(file, "utf8"), before)
  })
})

test("a new term is stored in lowercase", async () => {
  await withGlossary("{}\n", async (port, root) => {
    const response = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [allowed("Casa", "lugar"), allowed("Moradias", "casas")],
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.deepEqual(
      body.inserted.map((item: { term: string }) => item.term),
      ["casa", "moradias"],
    )
    const entries = load(readFileSync(join(root, "pt-BR.json"), "utf8"))
    assert.equal(entries.find((entry) => entry.term === "Casa"), undefined)
    assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
    assert.equal(entries.find((entry) => entry.term === "moradias")?.description, "casas")
  })
})

test("a plural keeps its own row beside the singular", async () => {
  const initial = `${JSON.stringify({ casa: { state: "allowed", description: "lugar", examples: ["na casa"] }, casas: { state: "allowed" } }, null, 2)}\n`
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const response = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [allowed("casas", "moradias", ["várias"])],
    })
    assert.equal(response.status, 200)
    const entries = load(readFileSync(file, "utf8"))
    assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
    assert.equal(entries.find((entry) => entry.term === "casas")?.description, "moradias")
  })
})

test("a forbidden term with a positive example is refused", async () => {
  const initial = "{}\n"
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const response = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [{
        state: "forbidden",
        term: "🔥",
        category: "emoji",
        description: "fogo",
        substitution: "não usar",
        rejected: ["Legenda com 🔥"],
        alternatives: ["sem emoji"],
        examples: ["Legenda com 🔥"],
      }],
    })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).error, "A forbidden example belongs in rejected.")
    assert.equal(readFileSync(file, "utf8"), initial)
  })
})

test("an allowed term with a situation is refused", async () => {
  const initial = "{}\n"
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const response = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [{ ...allowed("leve também", "convite"), when: "no imperativo do e-commerce" }],
    })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).error, "A term that only fits one situation is situationally_allowed.")
    assert.equal(readFileSync(file, "utf8"), initial)
  })
})

test("a failed batch leaves the file unchanged", async () => {
  const initial = "{}\n"
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const category = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [allowed(MARK, "Ponto"), { ...situational(ELLIPSIS, "reticências"), category: "pontuação" }],
    })
    assert.equal(category.status, 400)
    assert.equal(readFileSync(file, "utf8"), initial)
    const duplicate = await post(port, {
      language: "pt-BR",
      mode: "insert",
      terms: [allowed(MARK, "Ponto"), allowed(MARK, "outro")],
    })
    assert.equal(duplicate.status, 400)
    assert.equal((await duplicate.json()).error, `${JSON.stringify(MARK)} is duplicated.`)
    assert.equal(readFileSync(file, "utf8"), initial)
    const itself = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [situational(ELLIPSIS, "reticências", [ELLIPSIS])],
    })
    assert.equal(itself.status, 400)
    assert.equal(readFileSync(file, "utf8"), initial)
  })
})

test("update refuses a new full example that another row needs", async () => {
  const initial = `{ ${JSON.stringify(MARK)}: { "state": "allowed", "description": "Ponto" } }\n`
  await withGlossary(initial, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const before = readFileSync(file, "utf8")
    const response = await post(port, {
      language: "pt-BR",
      mode: "update",
      terms: [allowed(MARK, "Ponto de exclamação", [PHRASE]), situational(PHRASE, "convite")],
    })
    assert.equal(response.status, 400)
    assert.equal((await response.json()).error, `${JSON.stringify(PHRASE)} is not in the glossary.`)
    assert.equal(readFileSync(file, "utf8"), before)
  })
})

test("a plural is its own row, and case or an unaccented form stays on the existing term", async () => {
  const initial = JSON.stringify(
    {
      caça: { state: "allowed", category: "word", description: "busca", reason: "buscar", examples: [] },
      casa: { state: "allowed", category: "word", description: "lugar", reason: "morar", examples: [] },
      "São": { state: "allowed", category: "word", description: "santo", reason: "nome", examples: [] },
    },
    null,
    2,
  )
  await withGlossary(`${initial}\n`, async (port, root) => {
    const file = join(root, "pt-BR.json")
    const response = await post(port, {
      language: "pt-BR",
      mode: "upsert",
      terms: [
        { state: "allowed", term: "casas", category: "word", description: "morada", reason: "morar", examples: [] },
        { state: "allowed", term: "caça", category: "word", description: "busca", reason: "buscar", examples: [] },
        { state: "allowed", term: "Sao", category: "word", description: "santo", reason: "nome", examples: [] },
      ],
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.inserted.length, 1)
    assert.equal(body.inserted[0].term, "casas")
    assert.equal(body.updated.length, 0)
    assert.deepEqual(
      body.unchanged.map((item: { term: string }) => item.term),
      ["caça", "Sao"],
    )
    const entries = load(readFileSync(file, "utf8"))
    assert.equal(entries.find((entry) => entry.term === "casas")?.description, "morada")
    assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
    assert.equal(entries.find((entry) => entry.term === "caça")?.description, "busca")
    assert.equal(entries.find((entry) => entry.term === "São")?.description, "santo")
    assert.equal(entries.find((entry) => entry.term === "Sao"), undefined)
  })
})
