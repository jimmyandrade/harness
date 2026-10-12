/**
 * MCP server for the vocabulary.
 *
 * lookup_term reads one term. exists_in_text maps each token to whether it
 * exists. write_terms inserts, updates, or upserts terms for one language.
 *
 * Run: node api/mcp/index.ts
 */

import { fileURLToPath } from "node:url"
import type { Readable } from "node:stream"

import { existsPhrase } from "../routes/exists/index.ts"
import { lookupTerm } from "../routes/lookup/index.ts"
import { Glossary, writeTerms } from "../shared/glossary.ts"
import { parseBody } from "../shared/http.ts"
import { readOptions } from "../shared/options.ts"
import { classifyRequest, classifyTextRequest, termsRequest } from "../shared/schema.ts"

const PROTOCOL = "2024-11-05"

const languageProperty = { type: "string", description: "BCP 47 tag of the text, such as pt-BR." }

const tools = [
  {
    name: "lookup_term",
    description: "Read one vocabulary term or expression, including an emoji. Returns whether it exists and the stored row. Case and accents match the stored term. A plural, a gender, and another word are their own rows. When the person asks which variations were registered, read each form, name the ones that exist and the ones that do not, and ask the state before writing a missing form.",
    inputSchema: {
      type: "object",
      properties: {
        language: languageProperty,
        term: { type: "string" },
      },
      required: ["language", "term"],
    },
  },
  {
    name: "exists_in_text",
    description: "Return a record of each word, emoji, and punctuation mark in a text to whether that token exists in the vocabulary.",
    inputSchema: {
      type: "object",
      properties: {
        language: languageProperty,
        text: { type: "string" },
      },
      required: ["language", "text"],
    },
  },
  {
    name: "write_terms",
    description: "Insert, update, or upsert vocabulary terms for one language, including an emoji. Searches first. Case and accents stay on the existing term. A new term is stored in lowercase. A plural, a gender, and another word each keep their own row and state. allowed and forbidden are general rules and refuse a when. A forbidden term refuses examples; the bad example belongs in rejected. A new forbidden term asks for related terms in alternatives before writing and does not invent them. An empty alternatives list is valid after the person declines. related points at terms already registered and does not create a missing one. Strategic guidance stays in description, examples, state, and related. A cliché is category cliche and forbidden. The description replaces the literal word with an image, a scene, an action, an effect, or a situation. A phrase to avoid belongs in rejected. A recurring variation is its own forbidden row, linked in related, or it is only suggested. A phrase discarded for an undesired reading is its own forbidden row, and the rejection reason stays in description. A situation uses situationally_allowed. The response lists inserted, updated, and unchanged. One failure leaves the file unchanged.",
    inputSchema: {
      type: "object",
      properties: {
        language: languageProperty,
        mode: { type: "string", enum: ["insert", "update", "upsert"] },
        terms: {
          type: "array",
          items: {
            type: "object",
            properties: {
              state: { type: "string", enum: ["allowed", "forbidden", "situationally_allowed"] },
              term: { type: "string" },
              category: { type: "string" },
              description: { type: "string" },
              reason: { type: "string" },
              examples: { type: "array", items: { type: "string" } },
              substitution: { type: "string" },
              rejected: { type: "array", items: { type: "string" } },
              alternatives: { type: "array", items: { type: "string" } },
              related: { type: "array", items: { type: "string" } },
              when: { type: "string" },
            },
            required: ["state", "term", "category", "description"],
          },
        },
      },
      required: ["language", "mode", "terms"],
    },
  },
]

type ToolResult = { content: { type: "text"; text: string }[]; isError?: boolean }

export function encodeMessage(payload: unknown): Buffer {
  return Buffer.from(`${JSON.stringify(payload)}\n`, "utf8")
}

export function respond(directory: string, message: unknown): unknown | undefined {
  if (typeof message !== "object" || message === null) return rpcError(null, -32600, "Invalid request.")
  const record = message as { id?: unknown; method?: unknown; params?: unknown }
  const id = "id" in record ? record.id : null
  if (record.method === "notifications/initialized" || record.method === "notifications/cancelled") return undefined
  if (typeof record.method !== "string") return rpcError(id, -32600, "Invalid request.")
  if (record.method === "initialize") {
    const params = record.params as { protocolVersion?: unknown } | undefined
    const protocolVersion = typeof params?.protocolVersion === "string" ? params.protocolVersion : PROTOCOL
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: "vocabulary", version: "0.1.0" },
      },
    }
  }
  if (record.method === "ping") return { jsonrpc: "2.0", id, result: {} }
  if (record.method === "tools/list") return { jsonrpc: "2.0", id, result: { tools } }
  if (record.method === "tools/call") return { jsonrpc: "2.0", id, result: callTool(directory, record.params) }
  return rpcError(id, -32601, "Unknown method.")
}

export function callTool(directory: string, params: unknown): ToolResult {
  const record = params as { name?: unknown; arguments?: unknown } | undefined
  try {
    const glossary = new Glossary(directory)
    if (record?.name === "lookup_term") {
      const body = parseBody(classifyRequest, record.arguments)
      return reply(lookupTerm(glossary, body.language, body.term))
    }
    if (record?.name === "exists_in_text") {
      const body = parseBody(classifyTextRequest, record.arguments)
      return reply(existsPhrase(glossary, body.language, body.text))
    }
    if (record?.name === "write_terms") {
      const body = parseBody(termsRequest, record.arguments)
      return reply(writeTerms(directory, body.language, body.mode, body.terms))
    }
    return failure("Unknown tool.")
  } catch (error) {
    return failure(error instanceof Error ? error.message : "Invalid value.")
  }
}

function reply(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value) }] }
}

export function readMessages(stream: Readable, onMessage: (message: unknown) => void): void {
  let buffer: Buffer<ArrayBufferLike> = Buffer.alloc(0)
  stream.on("data", (chunk: Buffer | string) => {
    buffer = Buffer.concat([buffer, Buffer.from(chunk)])
    buffer = takeMessages(buffer, onMessage)
  })
}

function takeMessages(buffer: Buffer<ArrayBufferLike>, onMessage: (message: unknown) => void): Buffer<ArrayBufferLike> {
  let rest = buffer
  while (rest.length > 0) {
    const newline = rest.indexOf("\n")
    if (newline === -1) return rest
    const line = rest.subarray(0, newline).toString("utf8").replace(/\r$/, "").trim()
    rest = Buffer.from(rest.subarray(newline + 1))
    if (line === "") continue
    onMessage(JSON.parse(line))
  }
  return rest
}

function failure(text: string): ToolResult {
  return { content: [{ type: "text", text }], isError: true }
}

function rpcError(id: unknown, code: number, message: string): unknown {
  return { jsonrpc: "2.0", id, error: { code, message } }
}

function main(): void {
  const { glossary } = readOptions(process.argv.slice(2))
  readMessages(process.stdin, (message) => {
    const response = respond(glossary, message)
    if (response !== undefined) process.stdout.write(encodeMessage(response))
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
