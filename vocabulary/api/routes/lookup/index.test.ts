import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

const ROW = {
  casa: {
    state: "allowed",
    category: "word",
    description: "lugar",
    reason: "morar",
    examples: [],
  },
}

test("POST returns the stored row for another case, and a plural is its own term", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify(ROW, null, 2)}\n`)
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const found = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "Casa" }),
    })
    assert.equal(found.status, 200)
    const body = await found.json()
    assert.equal(body.exists, true)
    assert.equal(body.submitted, "Casa")
    assert.equal(body.term, "casa")
    assert.equal(body.state, "allowed")
    assert.equal(body.description, "lugar")
    assert.equal(body.reason, "morar")
    const missing = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "caça" }),
    })
    const absent = await missing.json()
    assert.equal(absent.exists, false)
    assert.equal(absent.term, undefined)
    const plural = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "casas" }),
    })
    const separate = await plural.json()
    assert.equal(separate.exists, false)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST reads a form that differs only by an accent as another term", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ roles: { state: "forbidden", description: "inglês" }, "rolês": { state: "allowed", reason: "gíria" } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const read = async (term: string) =>
    (await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term }),
    })).json()
  try {
    const english = await read("Roles")
    assert.equal(english.term, "roles")
    assert.equal(english.state, "forbidden")
    assert.equal(english.duplicates, undefined)
    const slang = await read("rolês")
    assert.equal(slang.term, "rolês")
    assert.equal(slang.state, "allowed")
    const absent = await read("rôles")
    assert.equal(absent.exists, false)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST with tags reads a row tagged for another context as absent", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ casa: { state: "allowed" }, "meu povo": { state: "situationally_allowed", tags: ["maria-silva"] } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const read = async (body: unknown) =>
    (await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })).json()
  try {
    const all = await read({ language: "pt-BR", term: "meu povo" })
    assert.equal(all.exists, true)
    assert.deepEqual(all.tags, ["maria-silva"])
    assert.equal((await read({ language: "pt-BR", term: "meu povo", tags: ["maria-silva"] })).exists, true)
    assert.equal((await read({ language: "pt-BR", term: "meu povo", tags: ["festival-de-verao"] })).exists, false)
    assert.equal((await read({ language: "pt-BR", term: "casa", tags: ["festival-de-verao"] })).exists, true)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST finds a case-sensitive row in any casing and says when the casing does not match", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ cueca: { state: "allowed" }, iPhone: { state: "allowed", case_sensitive: true } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const read = async (term: string) =>
    (await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term }),
    })).json()
  try {
    const wrong = await read("Iphone")
    assert.equal(wrong.exists, true)
    assert.equal(wrong.term, "iPhone")
    assert.equal(wrong.case_sensitive, true)
    assert.equal(wrong.case_matches, false)
    const right = await read("iPhone")
    assert.equal(right.case_sensitive, true)
    assert.equal(right.case_matches, true)
    const ordinary = await read("Cueca")
    assert.equal(ordinary.exists, true)
    assert.equal(ordinary.term, "cueca")
    assert.equal("case_sensitive" in ordinary, false)
    assert.equal("case_matches" in ordinary, false)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
