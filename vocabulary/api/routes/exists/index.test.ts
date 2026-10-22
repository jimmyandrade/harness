import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

test("POST returns which tokens exist and nothing else", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ casa: { state: "allowed" }, "\u2026": { state: "situationally_allowed" } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/exists`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "casas casa caça \u2026" }),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.deepEqual(body, { casas: false, casa: true, "caça": false, "\u2026": true })
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST with tags leaves out the rows of another speaker", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ casa: { state: "allowed" }, povo: { state: "allowed", tags: ["maria-silva", "palco"] } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  const read = async (tags: string[]) =>
    (await fetch(`http://127.0.0.1:${port}/v1/exists`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "casa povo", tags }),
    })).json()
  try {
    assert.deepEqual(await read([]), { casa: true, povo: true })
    assert.deepEqual(await read(["palco"]), { casa: true, povo: true })
    assert.deepEqual(await read(["festival-de-verao"]), { casa: true, povo: false })
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST maps a token in the wrong casing of a case-sensitive row to the stored spelling", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ cueca: { state: "allowed" }, eBay: { state: "allowed", case_sensitive: true } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/exists`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "Cueca da ebay, cueca da eBay" }),
    })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      Cueca: true,
      da: false,
      ebay: { exists: true, term: "eBay", case_matches: false },
      ",": false,
      cueca: true,
      eBay: true,
    })
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
