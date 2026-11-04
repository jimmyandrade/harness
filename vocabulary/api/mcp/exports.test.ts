import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"

test("a business harness creates the vocabulary server from harness/vocabulary/mcp and connects a transport", async () => {
  const { createVocabularyServer } = await import("harness/vocabulary/mcp")
  const server = createVocabularyServer(mkdtempSync(join(tmpdir(), "glossary-")))
  const client = new Client({ name: "test", version: "0" })
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair()
  await server.connect(serverSide)
  await client.connect(clientSide)

  assert.deepEqual(await client.ping(), {})
  assert.equal((await client.listTools()).tools.length, 9)
  await client.close()
})
