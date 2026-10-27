/**
 * Helpers for the route tests. The build leaves this file out.
 */

import type { AddressInfo } from "node:net"

import { HOST } from "./http.ts"
import { createGlossaryServer } from "./server.ts"

/**
 * Serve the glossary in root on a free port for one test, and close the
 * server afterwards, even when the test fails. run receives the base URL:
 * http://, HOST, and the port.
 */
export async function withServer(root: string, run: (base: string) => Promise<void>): Promise<void> {
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, HOST, resolve))
  const { port } = server.address() as AddressInfo
  try {
    await run(`http://${HOST}:${port}`)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}
