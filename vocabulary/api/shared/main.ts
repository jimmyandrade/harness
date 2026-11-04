/**
 * Whether a module is the entry point of the process.
 *
 * Node.js resolves symbolic links in import.meta.url, but process.argv[1]
 * keeps the path as typed. A plain comparison fails when that path goes
 * through a link, such as a node_modules linked into a git worktree, and the
 * command exits 0 without doing anything. Both sides are compared as real paths.
 */

import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"

/** True when the module at this import.meta.url is the script that Node.js was started with. */
export function isMain(moduleUrl: string): boolean {
  const entry = process.argv[1]
  if (entry === undefined) return false
  try {
    return realpathSync(entry) === realpathSync(fileURLToPath(moduleUrl))
  } catch {
    return false
  }
}
