import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

const { version } = JSON.parse(readFileSync(new URL("../../../../package.json", import.meta.url), "utf8")) as { version: string }

test("GET /v1/version returns the version in package.json", async () => {
  const server = createGlossaryServer(tmpdir())
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/version`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { name: "vocabulary", version })
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
