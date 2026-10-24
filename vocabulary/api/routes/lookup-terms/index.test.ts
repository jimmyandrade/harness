import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

const GLOSSARY = {
  casa: { state: "allowed", description: "lugar", reason: "morar", examples: [] },
  iPhone: { state: "allowed", case_sensitive: true },
  "meu povo": { state: "situationally_allowed", tags: ["maria-silva"] },
  "quando puderem, dão uma olhada, por favor?": { state: "allowed", description: "pedido plural", reason: "pede sem impor", examples: [] },
}

async function withServer(run: (read: (body: unknown) => Promise<{ status: number; body: any }>) => Promise<void>): Promise<void> {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify(GLOSSARY, null, 2)}\n`)
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const read = async (body: unknown) => {
    const response = await fetch(`http://127.0.0.1:${port}/v1/lookup-terms`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
    return { status: response.status, body: await response.json() }
  }
  try {
    await run(read)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}

test("POST returns one result per term, in order, and reads a term of several words as a whole", async () => {
  await withServer(async (read) => {
    const { status, body } = await read({
      language: "pt-BR",
      terms: ["Casa", "quando puderem, dão uma olhada, por favor?", "casas", "casa"],
    })
    assert.equal(status, 200)
    assert.equal(body.language, "pt-BR")
    assert.deepEqual(
      body.results.map((result: { submitted: string; exists: boolean }) => [result.submitted, result.exists]),
      [
        ["Casa", true],
        ["quando puderem, dão uma olhada, por favor?", true],
        ["casas", false],
        ["casa", true],
      ],
    )
    assert.equal(body.results[0].term, "casa")
    assert.equal(body.results[0].description, "lugar")
    assert.equal(body.results[1].state, "allowed")
    assert.equal(body.results[2].term, undefined)
  })
})

test("POST gives each result what POST /v1/lookup gives for the term", async () => {
  await withServer(async (read) => {
    const { body } = await read({ language: "pt-BR", terms: ["Iphone"] })
    assert.equal(body.results[0].term, "iPhone")
    assert.equal(body.results[0].case_sensitive, true)
    assert.equal(body.results[0].case_matches, false)
  })
})

test("POST with tags reads a row tagged for another context as absent in every term", async () => {
  await withServer(async (read) => {
    const all = await read({ language: "pt-BR", terms: ["meu povo", "casa"] })
    assert.deepEqual(all.body.results.map((result: { exists: boolean }) => result.exists), [true, true])
    const filtered = await read({ language: "pt-BR", terms: ["meu povo", "casa"], tags: ["festival-de-verao"] })
    assert.deepEqual(filtered.body.results.map((result: { exists: boolean }) => result.exists), [false, true])
  })
})

test("POST refuses an empty list, a blank term, too many terms, and an unknown language", async () => {
  await withServer(async (read) => {
    assert.equal((await read({ language: "pt-BR", terms: [] })).status, 400)
    assert.equal((await read({ language: "pt-BR", terms: ["casa", "  "] })).status, 400)
    assert.equal((await read({ language: "pt-BR", terms: Array.from({ length: 101 }, (_, index) => `termo ${index}`) })).status, 400)
    assert.equal((await read({ language: "pt-BR", term: "casa" })).status, 400)
    assert.equal((await read({ language: "xx", terms: ["casa"] })).status, 400)
  })
})
