/**
 * Serve the vocabulary endpoints on 127.0.0.1, port 8765.
 *
 * Run: node api/shared/server.ts
 */

import type { Server } from "node:http"
import { fileURLToPath } from "node:url"

import { allowedRoute } from "../routes/allowed/index.ts"
import { classifyRoute } from "../routes/classify/index.ts"
import { classifyTextRoute } from "../routes/classify-text/index.ts"
import { existsRoute } from "../routes/exists/index.ts"
import { forbiddenRoute } from "../routes/forbidden/index.ts"
import { lookupRoute } from "../routes/lookup/index.ts"
import { situationalRoute } from "../routes/situational/index.ts"
import { termsRoute } from "../routes/terms/index.ts"
import { createServer, listen } from "./http.ts"
import { readOptions, report } from "./options.ts"

const routes = [allowedRoute, classifyRoute, classifyTextRoute, existsRoute, forbiddenRoute, lookupRoute, situationalRoute, termsRoute]

export function createGlossaryServer(directory: string): Server {
  return createServer(directory, routes)
}

function main(argv: string[]): number {
  try {
    const { glossary, port } = readOptions(argv)
    void listen(glossary, routes, port)
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
