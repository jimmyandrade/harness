/** Where the project and this harness are, and what changed between two commits. */

import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const INSTRUCTIONS_FILE = "AGENTS.md"

/** The root of the git repository that contains start, or start itself. */
export function repoRoot(start: string): string {
  let path = start
  for (;;) {
    if (existsSync(join(path, ".git"))) return path
    const parent = dirname(path)
    if (parent === path) return start
    path = parent
  }
}

/** The root of this harness, also when it is installed under node_modules. */
export function coreRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..")
}

export function instructionsText(root: string): string {
  const path = join(root, INSTRUCTIONS_FILE)
  return existsSync(path) ? readFileSync(path, "utf8") : ""
}

export function namesToPublish(changedNames: string[], rulesChanged: boolean, everyName: string[]): string[] {
  return rulesChanged ? everyName : changedNames
}

export function blankBase(base: string): boolean {
  return base !== "" && [...base].every((char) => char === "0")
}

export function gitNames(root: string, base: string, head: string, paths: string[]): string[] {
  if (blankBase(base)) return []
  const result = spawnSync("git", ["diff", "--name-only", base, head, "--", ...paths], {
    cwd: root,
    encoding: "utf8",
  })
  if (result.status !== 0) throw new Error(result.stderr || "git diff failed")
  return result.stdout.split("\n").filter(Boolean)
}

export function publisherChanged(root: string, base: string, head: string, mappingPath: string): boolean {
  return gitNames(root, base, head, [".agents/scripts/sync-notion-pages", mappingPath]).length > 0
}

export function gate(names: string[], token: string): 0 | 2 | null {
  if (names.length === 0) return 0
  if (!token) return 2
  return null
}

export const SKILLS_DATA_SOURCE_VARIABLE = "NOTION_SKILLS_DATA_SOURCE_ID"
export const TEMPLATES_DATA_SOURCE_VARIABLE = "NOTION_TEMPLATES_DATA_SOURCE_ID"

/** The data source id comes from one place: the variable or the mapping (ADR 0023). */
export function dataSourceId(
  fromMapping: string | undefined,
  fromVariable: string | undefined,
  names: { variable: string; mapping: string },
): string {
  const mapped = fromMapping?.trim() ?? ""
  const variable = fromVariable?.trim() ?? ""
  if (mapped && variable) {
    throw new Error(`${names.variable} and data_source_id in ${names.mapping} are both set; keep one`)
  }
  if (!mapped && !variable) {
    throw new Error(`${names.variable} is missing, and ${names.mapping} has no data_source_id`)
  }
  return variable || mapped
}

export const CORE_VERSION_PATHS = [".github/workflows", "package.json", "package-lock.json"]

export function coreNamesToPublish(
  projectNames: string[],
  coreNames: string[],
  rulesChanged: boolean,
  coreVersionChanged: boolean,
): string[] {
  const shared = coreNames.filter((name) => projectNames.includes(name))
  if (shared.length) throw new Error(`${shared.join(", ")} exists in the project and in the core harness`)
  return rulesChanged || coreVersionChanged ? coreNames : []
}

export function projectRoot(env: Record<string, string | undefined>, cwd: string): string {
  return repoRoot(env.HARNESS_ROOT || cwd)
}
