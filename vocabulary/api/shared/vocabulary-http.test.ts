import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, test } from "node:test"

import { createVocabularyHttpHandler } from "./mcp-http.ts"

const URL_OF_FUNCTION = "https://example.test/vocabulary"
const ACCEPT = "application/json, text/event-stream"

function glossary(): string {
  const directory = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(directory, "pt-BR.json"), "{}\n")
  return directory
}

function post(message: unknown, headers: Record<string, string> = {}): Request {
  return new Request(URL_OF_FUNCTION, {
    method: "POST",
    headers: { "content-type": "application/json", accept: ACCEPT, ...headers },
    body: JSON.stringify(message),
  })
}

const initialize = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } },
}
const listTools = { jsonrpc: "2.0", id: 2, method: "tools/list" }
const writeTerms = { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "write_terms", arguments: {} } }

void describe("createVocabularyHttpHandler", () => {
  afterEach(() => {
    delete process.env.BEARER_TOKEN
    delete process.env.BLOCK_WRITE_OPERATIONS
  })

  void test("answers an MCP request over HTTP as JSON, with the CORS headers", async () => {
    const response = await createVocabularyHttpHandler(glossary())(post(initialize))
    assert.equal(response.status, 200)
    assert.equal(response.headers.get("access-control-allow-origin"), "*")
    const body = (await response.json()) as { result: { serverInfo: { name: string } } }
    assert.equal(body.result.serverInfo.name, "vocabulary")
  })

  void test("answers a preflight with the CORS headers and no body", async () => {
    const response = await createVocabularyHttpHandler(glossary())(new Request(URL_OF_FUNCTION, { method: "OPTIONS" }))
    assert.equal(response.status, 204)
    assert.equal(response.headers.get("access-control-allow-methods"), "POST, OPTIONS")
    assert.equal(await response.text(), "")
  })

  void test("refuses a request without the bearer token when BEARER_TOKEN is set, and takes the right one", async () => {
    process.env.BEARER_TOKEN = "secret"
    const handler = createVocabularyHttpHandler(glossary())
    const refused = await handler(post(listTools))
    assert.equal(refused.status, 401)
    assert.equal(refused.headers.get("access-control-allow-origin"), "*")
    assert.equal((await handler(post(listTools, { authorization: "Bearer secret" }))).status, 200)
  })

  void test("lists no write tool and refuses a write call when BLOCK_WRITE_OPERATIONS is true", async () => {
    process.env.BLOCK_WRITE_OPERATIONS = "true"
    const handler = createVocabularyHttpHandler(glossary())
    const listed = (await (await handler(post(listTools))).json()) as { result: { tools: { name: string }[] } }
    assert.deepEqual(
      listed.result.tools.map((tool) => tool.name),
      ["lookup_term", "lookup_terms", "exists_in_text", "get_version"],
    )
    const called = (await (await handler(post(writeTerms))).json()) as { result: { isError?: boolean } }
    assert.equal(called.result.isError, true)
  })

  void test("lists every tool when writes are allowed", async () => {
    const listed = (await (await createVocabularyHttpHandler(glossary())(post(listTools))).json()) as {
      result: { tools: { name: string }[] }
    }
    assert.equal(listed.result.tools.length, 8)
  })
})
