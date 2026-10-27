/**
 * The name and version of the vocabulary engine. An agent compares them with
 * the version the project pins before it reads or writes the glossary.
 */

import { readFileSync } from "node:fs"

// Release Please bumps the package.json of the repository root. api/ and dist/ both sit three levels below it.
const VERSION = (JSON.parse(readFileSync(new URL("../../../package.json", import.meta.url), "utf8")) as { version: string }).version

export type VersionInfo = { name: "vocabulary"; version: string }

export function versionInfo(): VersionInfo {
  return { name: "vocabulary", version: VERSION }
}
