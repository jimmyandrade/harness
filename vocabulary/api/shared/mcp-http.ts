/**
 * Shared MCP server HTTP utilities.
 *
 * Protocol types, JSON-RPC error codes, the server, and the Streamable HTTP
 * transport come from `@modelcontextprotocol/sdk`. This module keeps only what
 * that package does not export: a body size limit, CORS header fields, the
 * write-tool gate, the bearer token check, and `handleVocabularyRequest`, which
 * puts them together to serve the vocabulary server from any HTTP function.
 */

import type { IncomingHttpHeaders, IncomingMessage } from "node:http"

import { respond } from "../mcp/index.ts"

export { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js"
export { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
export { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"

/**
 * Standard HTTP status codes used by the helpers below.
 */
export const HTTP_STATUS = {
  OK: 200,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

/**
 * HTTP request parsing result.
 */
export type ParsedRequest = {
  method: string
  url: string
  body: unknown
  headers: Record<string, string | string[] | undefined>
}

/**
 * Error response with HTTP status and JSON body.
 */
export type ErrorResponse = {
  status: HttpStatus
  body: { error: string; [key: string]: unknown }
}

/**
 * CORS configuration options.
 */
export type CorsOptions = {
  origin?: string
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

/**
 * Auth checker function type.
 * Returns null if authentication succeeds, or an ErrorResponse if it fails.
 */
export type AuthChecker = (request: IncomingMessage) => ErrorResponse | null

/**
 * MCP write operation tool names that should be protected when write operations are blocked.
 *
 * Add tool names to this list if they perform write operations (create, update, delete)
 * that should be blocked when BLOCK_WRITE_OPERATIONS=true.
 */
export const WRITE_TOOLS = [
  "write_terms",
  "delete_terms",
  "migrate_glossary",
  "init_glossary",
  "create_page",
  "update_page",
  "delete_page",
  "create_database",
  "delete_database",
] as const

export type WriteTool = (typeof WRITE_TOOLS)[number]

/**
 * Parse an incoming HTTP request and extract the JSON body.
 *
 * The SDK transport accepts an already parsed body. This limit is the piece
 * it does not apply for us.
 *
 * @param request - The incoming HTTP request
 * @param maxSize - Maximum allowed body size in bytes (default: 10MB)
 * @returns Promise resolving to the parsed request
 * @throws Error if body is too large or invalid JSON
 */
export async function parseRequestFrom(request: IncomingMessage, maxSize: number = 10 * 1024 * 1024): Promise<ParsedRequest> {
  const chunks: Buffer[] = []
  let received = 0

  return new Promise((resolve, reject) => {
    request.on("data", (chunk: Buffer) => {
      received += chunk.length
      if (received > maxSize) {
        reject(new Error("Request body too large"))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })

    request.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8")
        const body: unknown = raw.length > 0 ? JSON.parse(raw) : null

        resolve({
          method: request.method ?? "GET",
          url: request.url ?? "/",
          body,
          headers: request.headers as Record<string, string | string[] | undefined>,
        })
      } catch {
        reject(new Error("Invalid JSON in request body"))
      }
    })

    request.on("error", (error) => {
      reject(error)
    })
  })
}

/**
 * Create a standard HTTP error response with appropriate status code.
 *
 * @param status - HTTP status code
 * @param message - Error message
 * @param extra - Additional fields to include in the response body
 * @returns Error response object
 */
export function createErrorResponse(status: HttpStatus, message: string, extra?: Record<string, unknown>): ErrorResponse {
  return {
    status,
    body: { error: message, ...extra },
  }
}

/**
 * Configure CORS headers for responses that are not written by the SDK transport.
 *
 * @param options - CORS configuration options
 * @returns Record of HTTP headers
 */
export function configureCorsHeaders(options: CorsOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {}

  if (options.origin !== undefined) {
    headers["access-control-allow-origin"] = options.origin
  }

  if (options.methods !== undefined && options.methods.length > 0) {
    headers["access-control-allow-methods"] = options.methods.join(", ")
  }

  if (options.allowedHeaders !== undefined && options.allowedHeaders.length > 0) {
    headers["access-control-allow-headers"] = options.allowedHeaders.join(", ")
  }

  if (options.exposedHeaders !== undefined && options.exposedHeaders.length > 0) {
    headers["access-control-expose-headers"] = options.exposedHeaders.join(", ")
  }

  if (options.credentials === true) {
    headers["access-control-allow-credentials"] = "true"
  }

  if (options.maxAge !== undefined) {
    headers["access-control-max-age"] = String(options.maxAge)
  }

  return headers
}

/**
 * Check if write operations should be blocked based on environment configuration.
 *
 * When BLOCK_WRITE_OPERATIONS=true, write tools return errors instead of executing.
 * This is useful for read-only deployments or testing environments.
 *
 * @returns true if write operations should be blocked, false otherwise
 */
export function shouldBlockWriteOperations(): boolean {
  return process.env.BLOCK_WRITE_OPERATIONS === "true"
}

/**
 * Check if a tool name is a write operation.
 *
 * @param toolName - The name of the tool to check
 * @returns true if the tool performs write operations
 */
export function isWriteTool(toolName: string): boolean {
  return (WRITE_TOOLS as readonly string[]).includes(toolName)
}

/**
 * Validate a bearer token from the Authorization header.
 *
 * The SDK auth middleware speaks OAuth. This check is the plain shared secret
 * in BEARER_TOKEN, and it stays off when that variable is unset.
 *
 * @param request - The incoming HTTP request, or any object with its headers
 * @returns null if valid or authentication disabled, ErrorResponse if invalid
 */
export function validateBearerToken(request: Pick<IncomingMessage, "headers">): ErrorResponse | null {
  const expectedToken = process.env.BEARER_TOKEN

  if (expectedToken === undefined || expectedToken === "") {
    return null
  }

  const authHeader = request.headers.authorization
  if (authHeader === undefined) {
    return createErrorResponse(HTTP_STATUS.UNAUTHORIZED, "Missing Authorization header")
  }

  const match = /^Bearer\s+(.+)$/i.exec(authHeader)
  if (match === null) {
    return createErrorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Authorization header format")
  }

  const token = match[1]
  if (token !== expectedToken) {
    return createErrorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid bearer token")
  }

  return null
}

/**
 * Create an authentication checker function with custom validation logic.
 *
 * @param validator - Custom validation function
 * @returns An AuthChecker function
 *
 * @example
 * const authChecker = createAuthChecker((request) => {
 *   const token = request.headers['x-api-key']
 *   if (!token || token !== process.env.API_KEY) {
 *     return createErrorResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid API key')
 *   }
 *   return null
 * })
 */
export function createAuthChecker(validator: (request: IncomingMessage) => ErrorResponse | null): AuthChecker {
  return validator
}

/**
 * No-op authentication checker that always allows requests.
 * Use this when authentication is not required.
 */
export const noAuth: AuthChecker = () => null

/**
 * An HTTP request as a serverless function receives it, with the body already read.
 */
export type VocabularyHttpRequest = {
  method?: string
  headers: IncomingHttpHeaders
  body: unknown
}

/**
 * What the HTTP function writes back: the status, the headers, and the JSON body, if any.
 */
export type VocabularyHttpResponse = {
  status: HttpStatus
  headers: Record<string, string>
  body?: unknown
}

/**
 * CORS headers of a vocabulary server that takes JSON-RPC over POST from any origin.
 */
export const VOCABULARY_CORS: CorsOptions = {
  origin: "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

/**
 * Serve one JSON-RPC message to the vocabulary server over HTTP.
 *
 * It answers a preflight, refuses any method but POST, checks the bearer token,
 * reads the message from a parsed or a string body, blocks write tools when
 * BLOCK_WRITE_OPERATIONS is true, and accepts a notification with no body.
 *
 * @param glossaryDir - Directory with the glossary JSON files
 * @param request - The request, with its body already read
 * @param cors - CORS options of the response
 * @returns The response to write
 */
export function handleVocabularyRequest(
  glossaryDir: string,
  request: VocabularyHttpRequest,
  cors: CorsOptions = VOCABULARY_CORS,
): VocabularyHttpResponse {
  const headers = configureCorsHeaders(cors)
  const reply = (status: HttpStatus, body?: unknown): VocabularyHttpResponse => ({ status, headers, body })
  const fail = (error: ErrorResponse): VocabularyHttpResponse => reply(error.status, error.body)

  if (request.method === "OPTIONS") return reply(HTTP_STATUS.OK)
  if (request.method !== "POST") return fail(createErrorResponse(HTTP_STATUS.METHOD_NOT_ALLOWED, "Method not allowed"))

  const authError = validateBearerToken(request)
  if (authError !== null) return fail(authError)

  const message = messageFrom(request.body)
  if (message === null) return fail(createErrorResponse(HTTP_STATUS.BAD_REQUEST, "Parse error"))

  if (isBlockedWriteCall(message)) {
    return fail(
      createErrorResponse(HTTP_STATUS.FORBIDDEN, "Write operations are disabled. Set BLOCK_WRITE_OPERATIONS=false to enable."),
    )
  }

  try {
    const response = respond(glossaryDir, message)
    return response === undefined ? reply(HTTP_STATUS.ACCEPTED) : reply(HTTP_STATUS.OK, response)
  } catch (error) {
    const text = error instanceof Error ? error.message : "Internal error"
    return fail(createErrorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, text))
  }
}

function messageFrom(body: unknown): object | null {
  let value = body
  if (typeof value === "string") {
    try {
      value = JSON.parse(value)
    } catch {
      return null
    }
  }
  return typeof value === "object" && value !== null ? value : null
}

function isBlockedWriteCall(message: object): boolean {
  if (!shouldBlockWriteOperations()) return false
  const name = (message as { params?: { name?: unknown } }).params?.name
  return typeof name === "string" && isWriteTool(name)
}
