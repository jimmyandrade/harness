/**
 * Command options shared by the vocabulary endpoints.
 */

import { defaultDirectory } from "./glossary.ts"

export function readOptions(argv: string[]): { glossary: string; port: number; args: string[] } {
  let glossary = defaultDirectory
  let port = 8765
  const args: string[] = []
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === "--glossary") glossary = argv[++index] ?? glossary
    else if (arg === "--port") port = Number(argv[++index])
    else args.push(arg)
  }
  return { glossary, port, args }
}

export function report(error: unknown): number {
  if (error instanceof Error) {
    console.error(error.message)
    return 2
  }
  throw error
}
