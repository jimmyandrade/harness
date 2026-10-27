/**
 * Shared MCP server HTTP utilities.
 *
 * This module provides reusable utilities for building MCP servers over HTTP:
 * - JSON-RPC and MCP protocol types and constants
 * - Request parsing and validation
 * - Error response construction
 * - CORS headers configuration
 * - Write operation protection
 * - Authentication hooks (for future bearer token validation)
 *
 * Business harnesses can import these utilities to build their own MCP servers
 * following consistent patterns and best practices.
 */

import type { IncomingMessage } from "node:http"

/**
 * Standard HTTP status codes used by MCP servers.
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

/**
 * JSON-RPC 2.0 error codes.
 * @see https://www.jsonrpc.org/specification#error_object
 */
export const JSON_RPC_ERROR = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const

export type JsonRpcErrorCode = (typeof JSON_RPC_ERROR)[keyof typeof JSON_RPC_ERROR]

/**
 * JSON-RPC 2.0 request structure.
 */
export type JsonRpcRequest = {
  jsonrpc: "2.0"
  id: string | number | null
  method: string
  params?: unknown
}

/**
 * JSON-RPC 2.0 error object.
 */
export type JsonRpcError = {
  code: JsonRpcErrorCode
  message: string
  data?: unknown
}

/**
 * JSON-RPC 2.0 response structure.
 */
export type JsonRpcResponse = {
  jsonrpc: "2.0"
  id: string | number | null
  result?: unknown
  error?: JsonRpcError
}

/**
 * MCP tool call parameters.
 */
export type McpToolCallParams = {
  name: string
  arguments?: Record<string, unknown>
}

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
  body: JsonRpcResponse | { error: string; [key: string]: unknown }
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
      } catch (error) {
        reject(new Error("Invalid JSON in request body"))
      }
    })

    request.on("error", (error) => {
      reject(error)
    })
  })
}

/**
 * Create a JSON-RPC 2.0 error response.
 *
 * @param id - The request ID (null if unknown)
 * @param code - JSON-RPC error code
 * @param message - Error message
 * @param data - Optional additional error data
 * @returns JSON-RPC error response object
 */
export function createJsonRpcError(
  id: string | number | null,
  code: JsonRpcErrorCode,
  message: string,
  data?: unknown,
): JsonRpcResponse {
  const error: JsonRpcError = { code, message }
  if (data !== undefined) error.data = data
  return { jsonrpc: "2.0", id, error }
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
 * Create a JSON-RPC error response with HTTP status.
 *
 * @param status - HTTP status code
 * @param id - The request ID
 * @param code - JSON-RPC error code
 * @param message - Error message
 * @param data - Optional additional error data
 * @returns Error response with JSON-RPC structure
 */
export function createJsonRpcErrorResponse(
  status: HttpStatus,
  id: string | number | null,
  code: JsonRpcErrorCode,
  message: string,
  data?: unknown,
): ErrorResponse {
  return {
    status,
    body: createJsonRpcError(id, code, message, data),
  }
}

/**
 * Configure CORS headers for MCP server responses.
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
 * This is a placeholder for future authentication implementation.
 * By default, it always returns null (authentication disabled).
 *
 * To enable authentication, set the BEARER_TOKEN environment variable
 * and this function will validate against it.
 *
 * @param request - The incoming HTTP request
 * @returns null if valid or authentication disabled, ErrorResponse if invalid
 */
export function validateBearerToken(request: IncomingMessage): ErrorResponse | null {
  const expectedToken = process.env.BEARER_TOKEN
  
  // Authentication disabled when no token is configured
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
