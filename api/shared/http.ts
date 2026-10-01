/**
 * HTTP helpers shared by the vocabulary endpoints.
 */

import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from "node:http"

import type * as z from "zod"

import { Glossary, InvalidGlossary } from "./glossary.ts"
import { readSchema } from "./schema.ts"

export type Route = {
  method: "POST"
  path: string
  limit: number
  emptyMessage: string
  handle: (glossary: Glossary, record: Record<string, unknown>) => unknown
}

export function createServer(directory: string, routes: readonly Route[]): Server {
  const glossary = new Glossary(directory)
  return createHttpServer((request, response) => {
    void dispatch(glossary, routes, request, response)
  })
}

export function listen(directory: string, routes: readonly Route[], port: number): Promise<Server> {
  const server = createServer(directory, routes)
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server))
  })
}

export function parseBody<S extends z.ZodType>(schema: S, value: unknown): z.infer<S> {
  try {
    return readSchema(schema, value)
  } catch (error) {
    throw new InvalidGlossary(error instanceof Error ? error.message : "Invalid value.")
  }
}

function dispatch(
  glossary: Glossary,
  routes: readonly Route[],
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const route = routes.find((item) => item.method === request.method && item.path === request.url)
  if (route === undefined) return send(response, 404, { error: "Unknown endpoint." })
  return accept(request, response, route.limit, route.emptyMessage, (record) => route.handle(glossary, record))
}

function accept(
  request: IncomingMessage,
  response: ServerResponse,
  limit: number,
  emptyMessage: string,
  build: (record: Record<string, unknown>) => unknown,
): Promise<void> {
  const size = Number(request.headers["content-length"] ?? "0")
  if (!Number.isInteger(size) || size <= 0 || size > limit) {
    return send(response, 400, { error: emptyMessage })
  }
  return readBody(request, size)
    .then((raw) => {
      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
      return send(response, 200, build(parsed as Record<string, unknown>))
    })
    .catch((error: unknown) => {
      if (error instanceof InvalidGlossary) return send(response, 400, { error: error.message })
      if (error instanceof SyntaxError || error instanceof TypeError) {
        return send(response, 400, { error: emptyMessage })
      }
      return send(response, 500, { error: "The glossary could not be read." })
    })
}

function readBody(request: IncomingMessage, size: number): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    let received = 0
    request.on("data", (chunk: Buffer) => {
      received += chunk.length
      if (received > size) reject(new TypeError())
      else chunks.push(chunk)
    })
    request.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")))
    request.on("error", reject)
  })
}

function send(response: ServerResponse, status: number, body: unknown): Promise<void> {
  const raw = Buffer.from(JSON.stringify(body))
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": String(raw.length),
  })
  response.end(raw)
  return Promise.resolve()
}
