/**
 * GET /v1/version
 *
 * Return the name and version of the vocabulary engine, as in package.json.
 *
 * Run: node api/routes/version/index.ts
 */

import { fileURLToPath } from "node:url"

import type { Route } from "../../shared/http.ts"
import { versionInfo } from "../../shared/version.ts"

export const versionRoute: Route = {
  method: "GET",
  path: "/v1/version",
  limit: 0,
  emptyMessage: "",
  handle() {
    return versionInfo()
  },
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(versionInfo()))
}
