import { deepStrictEqual, strictEqual } from "node:assert"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, test } from "node:test"

import { HTTP_STATUS, handleVocabularyRequest } from "./mcp-http.ts"

const glossary = mkdtempSync(join(tmpdir(), "glossary-"))
const ping = { jsonrpc: "2.0", id: 1, method: "ping" }
const writeCall = { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "write_terms", arguments: {} } }

void describe("handleVocabularyRequest", () => {
  afterEach(() => {
    delete process.env.BEARER_TOKEN
    delete process.env.BLOCK_WRITE_OPERATIONS
  })

  void test("answers a JSON-RPC message posted as an object or as a string, with the CORS headers", () => {
    for (const body of [ping, JSON.stringify(ping)]) {
      const response = handleVocabularyRequest(glossary, { method: "POST", headers: {}, body })
      strictEqual(response.status, HTTP_STATUS.OK)
      deepStrictEqual(response.body, { jsonrpc: "2.0", id: 1, result: {} })
      strictEqual(response.headers["access-control-allow-origin"], "*")
      strictEqual(response.headers["access-control-allow-methods"], "POST, OPTIONS")
    }
  })

  void test("answers a preflight with the CORS headers and no body", () => {
    const response = handleVocabularyRequest(glossary, { method: "OPTIONS", headers: {}, body: undefined })
    strictEqual(response.status, HTTP_STATUS.OK)
    strictEqual(response.body, undefined)
    strictEqual(response.headers["access-control-allow-headers"], "Content-Type, Authorization")
  })

  void test("refuses a method other than POST", () => {
    const response = handleVocabularyRequest(glossary, { method: "GET", headers: {}, body: undefined })
    strictEqual(response.status, HTTP_STATUS.METHOD_NOT_ALLOWED)
    deepStrictEqual(response.body, { error: "Method not allowed" })
  })

  void test("refuses a request without the bearer token when BEARER_TOKEN is set, and takes the right one", () => {
    process.env.BEARER_TOKEN = "secret"
    strictEqual(handleVocabularyRequest(glossary, { method: "POST", headers: {}, body: ping }).status, HTTP_STATUS.UNAUTHORIZED)
    const authorized = handleVocabularyRequest(glossary, { method: "POST", headers: { authorization: "Bearer secret" }, body: ping })
    strictEqual(authorized.status, HTTP_STATUS.OK)
  })

  void test("refuses a body that is not a JSON-RPC message", () => {
    for (const body of ["{not json", 42, null]) {
      const response = handleVocabularyRequest(glossary, { method: "POST", headers: {}, body })
      strictEqual(response.status, HTTP_STATUS.BAD_REQUEST)
      deepStrictEqual(response.body, { error: "Parse error" })
    }
  })

  void test("refuses a write tool when BLOCK_WRITE_OPERATIONS is true, and lets reads through", () => {
    process.env.BLOCK_WRITE_OPERATIONS = "true"
    const blocked = handleVocabularyRequest(glossary, { method: "POST", headers: {}, body: writeCall })
    strictEqual(blocked.status, HTTP_STATUS.FORBIDDEN)
    strictEqual(handleVocabularyRequest(glossary, { method: "POST", headers: {}, body: ping }).status, HTTP_STATUS.OK)
  })

  void test("accepts a notification with no body", () => {
    const notification = { jsonrpc: "2.0", method: "notifications/initialized" }
    const response = handleVocabularyRequest(glossary, { method: "POST", headers: {}, body: notification })
    strictEqual(response.status, HTTP_STATUS.ACCEPTED)
    strictEqual(response.body, undefined)
  })
})
