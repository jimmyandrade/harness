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
