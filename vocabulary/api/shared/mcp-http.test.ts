/**
 * Tests for MCP server HTTP utilities.
 */

import { strictEqual, deepStrictEqual, rejects } from "node:assert"
import { describe, test } from "node:test"
import { Readable } from "node:stream"
import type { IncomingMessage } from "node:http"
import {
  HTTP_STATUS,
  JSON_RPC_ERROR,
  WRITE_TOOLS,
  parseRequestFrom,
  createJsonRpcError,
  createErrorResponse,
  createJsonRpcErrorResponse,
  configureCorsHeaders,
  shouldBlockWriteOperations,
  isWriteTool,
  validateBearerToken,
  createAuthChecker,
  noAuth,
} from "./mcp-http.ts"

function createMockRequest(method: string, url: string, body: string, headers: Record<string, string> = {}): IncomingMessage {
  const stream = new Readable()
  stream.push(body)
  stream.push(null)

  const request = stream as unknown as IncomingMessage
  request.method = method
  request.url = url
  request.headers = headers

  return request
}

void describe("HTTP_STATUS constants", () => {
  void test("exports correct status codes", () => {
    strictEqual(HTTP_STATUS.OK, 200)
    strictEqual(HTTP_STATUS.BAD_REQUEST, 400)
    strictEqual(HTTP_STATUS.UNAUTHORIZED, 401)
    strictEqual(HTTP_STATUS.FORBIDDEN, 403)
    strictEqual(HTTP_STATUS.NOT_FOUND, 404)
    strictEqual(HTTP_STATUS.METHOD_NOT_ALLOWED, 405)
    strictEqual(HTTP_STATUS.INTERNAL_SERVER_ERROR, 500)
  })
})

void describe("JSON_RPC_ERROR constants", () => {
  void test("exports correct error codes", () => {
    strictEqual(JSON_RPC_ERROR.PARSE_ERROR, -32700)
    strictEqual(JSON_RPC_ERROR.INVALID_REQUEST, -32600)
    strictEqual(JSON_RPC_ERROR.METHOD_NOT_FOUND, -32601)
    strictEqual(JSON_RPC_ERROR.INVALID_PARAMS, -32602)
    strictEqual(JSON_RPC_ERROR.INTERNAL_ERROR, -32603)
  })
})

void describe("WRITE_TOOLS constant", () => {
  void test("includes common write tool names", () => {
    strictEqual(WRITE_TOOLS.includes("write_terms"), true)
    strictEqual(WRITE_TOOLS.includes("migrate_glossary"), true)
    strictEqual(WRITE_TOOLS.includes("init_glossary"), true)
  })
})

void describe("parseRequestFrom", () => {
  void test("parses valid JSON request", async () => {
    const body = JSON.stringify({ method: "test", params: { value: 42 } })
    const request = createMockRequest("POST", "/api", body)
    const parsed = await parseRequestFrom(request)

    strictEqual(parsed.method, "POST")
    strictEqual(parsed.url, "/api")
    deepStrictEqual(parsed.body, { method: "test", params: { value: 42 } })
  })

  void test("parses empty body as null", async () => {
    const request = createMockRequest("GET", "/", "")
    const parsed = await parseRequestFrom(request)

    strictEqual(parsed.body, null)
  })

  void test("rejects invalid JSON", async () => {
    const request = createMockRequest("POST", "/api", "{ invalid json }")
    await rejects(
      () => parseRequestFrom(request),
      (error: Error) => error.message === "Invalid JSON in request body",
    )
  })

  void test("rejects body exceeding max size", async () => {
    const largeBody = "x".repeat(1000)
    const request = createMockRequest("POST", "/api", largeBody)
    await rejects(
      () => parseRequestFrom(request, 500),
      (error: Error) => error.message === "Request body too large",
    )
  })

  void test("includes headers in parsed result", async () => {
    const headers = { "content-type": "application/json", "x-custom": "value" }
    const request = createMockRequest("POST", "/api", "{}", headers)
    const parsed = await parseRequestFrom(request)

    strictEqual(parsed.headers["content-type"], "application/json")
    strictEqual(parsed.headers["x-custom"], "value")
  })
})

void describe("createJsonRpcError", () => {
  void test("creates error with id and code", () => {
    const error = createJsonRpcError(1, JSON_RPC_ERROR.INVALID_REQUEST, "Invalid request")

    strictEqual(error.jsonrpc, "2.0")
    strictEqual(error.id, 1)
    strictEqual(error.error?.code, -32600)
    strictEqual(error.error?.message, "Invalid request")
    strictEqual(error.error?.data, undefined)
  })

  void test("creates error with null id", () => {
    const error = createJsonRpcError(null, JSON_RPC_ERROR.PARSE_ERROR, "Parse error")

    strictEqual(error.id, null)
    strictEqual(error.error?.code, -32700)
  })

  void test("includes optional data field", () => {
    const error = createJsonRpcError(1, JSON_RPC_ERROR.INTERNAL_ERROR, "Internal error", { details: "stack trace" })

    deepStrictEqual(error.error?.data, { details: "stack trace" })
  })
})

void describe("createErrorResponse", () => {
  void test("creates basic error response", () => {
    const response = createErrorResponse(HTTP_STATUS.BAD_REQUEST, "Bad request")

    strictEqual(response.status, 400)
    deepStrictEqual(response.body, { error: "Bad request" })
  })

  void test("includes extra fields in response", () => {
    const response = createErrorResponse(HTTP_STATUS.BAD_REQUEST, "Validation failed", { field: "email", reason: "invalid format" })

    strictEqual(response.status, 400)
    deepStrictEqual(response.body, {
      error: "Validation failed",
      field: "email",
      reason: "invalid format",
    })
  })
})

void describe("createJsonRpcErrorResponse", () => {
  void test("creates JSON-RPC error response", () => {
    const response = createJsonRpcErrorResponse(
      HTTP_STATUS.BAD_REQUEST,
      1,
      JSON_RPC_ERROR.INVALID_PARAMS,
      "Invalid parameters",
    )

    strictEqual(response.status, 400)
    strictEqual((response.body as { jsonrpc: string }).jsonrpc, "2.0")
    strictEqual((response.body as { id: number }).id, 1)
    strictEqual((response.body as { error: { code: number } }).error.code, -32602)
  })

  void test("includes data in JSON-RPC error", () => {
    const response = createJsonRpcErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "req-1",
      JSON_RPC_ERROR.INTERNAL_ERROR,
      "Internal error",
      { trace: "..." },
    )

    deepStrictEqual((response.body as { error: { data: unknown } }).error.data, { trace: "..." })
  })
})

void describe("configureCorsHeaders", () => {
  void test("returns empty object with no options", () => {
    const headers = configureCorsHeaders()
    deepStrictEqual(headers, {})
  })

  void test("sets origin header", () => {
    const headers = configureCorsHeaders({ origin: "https://example.com" })
    strictEqual(headers["access-control-allow-origin"], "https://example.com")
  })

  void test("sets methods header", () => {
    const headers = configureCorsHeaders({ methods: ["GET", "POST", "PUT"] })
    strictEqual(headers["access-control-allow-methods"], "GET, POST, PUT")
  })

  void test("sets allowed headers", () => {
    const headers = configureCorsHeaders({ allowedHeaders: ["Content-Type", "Authorization"] })
    strictEqual(headers["access-control-allow-headers"], "Content-Type, Authorization")
  })

  void test("sets exposed headers", () => {
    const headers = configureCorsHeaders({ exposedHeaders: ["X-Total-Count"] })
    strictEqual(headers["access-control-expose-headers"], "X-Total-Count")
  })

  void test("sets credentials flag", () => {
    const headers = configureCorsHeaders({ credentials: true })
    strictEqual(headers["access-control-allow-credentials"], "true")
  })

  void test("sets max age", () => {
    const headers = configureCorsHeaders({ maxAge: 3600 })
    strictEqual(headers["access-control-max-age"], "3600")
  })

  void test("combines multiple options", () => {
    const headers = configureCorsHeaders({
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
      maxAge: 86400,
    })

    strictEqual(headers["access-control-allow-origin"], "*")
    strictEqual(headers["access-control-allow-methods"], "GET, POST")
    strictEqual(headers["access-control-allow-headers"], "Content-Type")
    strictEqual(headers["access-control-allow-credentials"], "true")
    strictEqual(headers["access-control-max-age"], "86400")
  })
})

void describe("shouldBlockWriteOperations", () => {
  void test("returns false when env var is not set", () => {
    delete process.env.BLOCK_WRITE_OPERATIONS
    strictEqual(shouldBlockWriteOperations(), false)
  })

  void test("returns true when env var is 'true'", () => {
    process.env.BLOCK_WRITE_OPERATIONS = "true"
    strictEqual(shouldBlockWriteOperations(), true)
    delete process.env.BLOCK_WRITE_OPERATIONS
  })

  void test("returns false when env var is other value", () => {
    process.env.BLOCK_WRITE_OPERATIONS = "false"
    strictEqual(shouldBlockWriteOperations(), false)
    delete process.env.BLOCK_WRITE_OPERATIONS
  })
})

void describe("isWriteTool", () => {
  void test("returns true for known write tools", () => {
    strictEqual(isWriteTool("write_terms"), true)
    strictEqual(isWriteTool("migrate_glossary"), true)
    strictEqual(isWriteTool("init_glossary"), true)
  })

  void test("returns false for read-only tools", () => {
    strictEqual(isWriteTool("lookup_term"), false)
    strictEqual(isWriteTool("lookup_terms"), false)
    strictEqual(isWriteTool("exists_in_text"), false)
  })

  void test("returns false for unknown tools", () => {
    strictEqual(isWriteTool("unknown_tool"), false)
    strictEqual(isWriteTool(""), false)
  })
})

void describe("validateBearerToken", () => {
  void test("returns null when no token configured", () => {
    delete process.env.BEARER_TOKEN
    const request = createMockRequest("GET", "/", "")
    const result = validateBearerToken(request)
    strictEqual(result, null)
  })

  void test("returns null when token is empty string", () => {
    process.env.BEARER_TOKEN = ""
    const request = createMockRequest("GET", "/", "")
    const result = validateBearerToken(request)
    strictEqual(result, null)
    delete process.env.BEARER_TOKEN
  })

  void test("returns error when authorization header missing", () => {
    process.env.BEARER_TOKEN = "secret123"
    const request = createMockRequest("GET", "/", "")
    const result = validateBearerToken(request)

    strictEqual(result?.status, HTTP_STATUS.UNAUTHORIZED)
    strictEqual((result?.body as { error: string }).error, "Missing Authorization header")
    delete process.env.BEARER_TOKEN
  })

  void test("returns error for invalid header format", () => {
    process.env.BEARER_TOKEN = "secret123"
    const request = createMockRequest("GET", "/", "", { authorization: "Invalid format" })
    const result = validateBearerToken(request)

    strictEqual(result?.status, HTTP_STATUS.UNAUTHORIZED)
    strictEqual((result?.body as { error: string }).error, "Invalid Authorization header format")
    delete process.env.BEARER_TOKEN
  })

  void test("returns error for wrong token", () => {
    process.env.BEARER_TOKEN = "secret123"
    const request = createMockRequest("GET", "/", "", { authorization: "Bearer wrong-token" })
    const result = validateBearerToken(request)

    strictEqual(result?.status, HTTP_STATUS.UNAUTHORIZED)
    strictEqual((result?.body as { error: string }).error, "Invalid bearer token")
    delete process.env.BEARER_TOKEN
  })

  void test("returns null for correct token", () => {
    process.env.BEARER_TOKEN = "secret123"
    const request = createMockRequest("GET", "/", "", { authorization: "Bearer secret123" })
    const result = validateBearerToken(request)

    strictEqual(result, null)
    delete process.env.BEARER_TOKEN
  })

  void test("handles case-insensitive Bearer prefix", () => {
    process.env.BEARER_TOKEN = "secret123"
    const request = createMockRequest("GET", "/", "", { authorization: "bearer secret123" })
    const result = validateBearerToken(request)

    strictEqual(result, null)
    delete process.env.BEARER_TOKEN
  })
})

void describe("createAuthChecker", () => {
  void test("creates custom auth checker", () => {
    const checker = createAuthChecker((request) => {
      const apiKey = request.headers["x-api-key"]
      if (apiKey !== "valid-key") {
        return createErrorResponse(HTTP_STATUS.FORBIDDEN, "Invalid API key")
      }
      return null
    })

    const validRequest = createMockRequest("GET", "/", "", { "x-api-key": "valid-key" })
    const invalidRequest = createMockRequest("GET", "/", "")

    strictEqual(checker(validRequest), null)
    const result = checker(invalidRequest)
    strictEqual(result?.status, HTTP_STATUS.FORBIDDEN)
  })
})

void describe("noAuth", () => {
  void test("always returns null", () => {
    const request = createMockRequest("GET", "/", "")
    strictEqual(noAuth(request), null)
  })
})
