/** Read the frontmatter of a skill, a model, or the project instructions, the way the Notion sync needs it. */

/** The frontmatter lines and the body of a Markdown text, or null without frontmatter. */
export function frontmatterParts(text: string): { front: string[]; body: string } | null {
  if (!text.startsWith("---\n")) return null
  const end = text.indexOf("\n---\n", 4)
  if (end < 0) return null
  return { front: text.slice(4, end).split("\n"), body: text.slice(end + 5).replace(/^\n/, "") }
}

/** A field at the top of the frontmatter, or one level under metadata. */
export function frontmatterField(text: string, key: string, inMetadata: boolean): string | null {
  const parts = frontmatterParts(text)
  if (!parts) return null
  let metadata = false
  for (const line of parts.front) {
    if (line && !line.startsWith(" ")) metadata = line.startsWith("metadata:")
    const match = /^( *)([^\s:#][^:]*):\s*(.*)$/.exec(line)
    if (!match) continue
    const indent = (match[1] ?? "").length
    const wanted = inMetadata ? metadata && indent === 2 : indent === 0
    if (wanted && unquote((match[2] ?? "").trim()) === key) {
      const value = unquote((match[3] ?? "").trim())
      return value || null
    }
  }
  return null
}

/** metadata.parameters of an instructions text, as YAML at the left margin. */
export function parametersYaml(text: string): string | null {
  const parts = frontmatterParts(text)
  if (!parts) return null
  let metadata = false
  let start = -1
  for (const [index, line] of parts.front.entries()) {
    if (line && !line.startsWith(" ")) metadata = line.startsWith("metadata:")
    if (metadata && /^ {2}parameters:\s*$/.test(line)) {
      start = index + 1
      break
    }
  }
  if (start < 0) return null
  const lines: string[] = []
  for (const line of parts.front.slice(start)) {
    if (line.trim() && !line.startsWith("    ")) break
    lines.push(line.slice(4))
  }
  const yaml = lines.join("\n").replace(/\s+$/, "")
  return yaml ? `${yaml}\n` : null
}

/** A setting from the Global entry, or the top level, of metadata.parameters. */
export function blockSetting(text: string, key: string): string | null {
  const yaml = parametersYaml(text)
  if (yaml === null) return null
  const pattern = new RegExp(`^(\\s*)"?${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"?\\s*:\\s*(.*)$`)
  let inGlobal = false
  for (const raw of yaml.split("\n")) {
    const line = (raw.split(" #", 1)[0] ?? "").replace(/\s+$/, "")
    if (!line.trim()) continue
    if (!line.startsWith(" ")) inGlobal = /^"?Global"?\s*:\s*$/.test(line)
    const match = pattern.exec(line)
    if (!match) continue
    const indent = (match[1] ?? "").length
    if (indent === 0 || (inGlobal && indent > 0)) return unquote((match[2] ?? "").trim())
  }
  return null
}

export function unquote(value: string): string {
  if (value.length >= 2 && value[0] === value.at(-1) && (value[0] === '"' || value[0] === "'")) {
    return value.slice(1, -1)
  }
  return value
}

export function splitFrontmatter(text: string): [string, string] {
  if (!text.startsWith("---\n")) throw new Error("skill is missing frontmatter")
  const end = text.indexOf("\n---\n", 4)
  if (end < 0) throw new Error("skill frontmatter does not close")
  return [text.slice(4, end), text.slice(end + 5).replace(/^\n/, "")]
}

export function stringList(fields: Record<string, string | string[]>, key: string): string[] | undefined {
  const value = fields[`metadata.${key}`]
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw new Error(`skill metadata ${key} must be a list`)
  return value
}

export function frontmatterFields(front: string): Record<string, string | string[]> {
  const fields: Record<string, string | string[]> = {}
  let inMetadata = false
  let listKey: string | null = null
  for (const line of front.split("\n")) {
    if (line.startsWith("metadata:")) {
      inMetadata = true
      listKey = null
      continue
    }
    if (inMetadata && /^\s+-\s+/.test(line)) {
      if (!listKey) throw new Error("skill metadata list item has no key")
      const item = unquote(line.replace(/^\s+-\s+/, "").trim())
      if (!item) throw new Error(`skill metadata ${listKey} has an empty item`)
      const current = fields[`metadata.${listKey}`]
      if (!Array.isArray(current)) throw new Error(`skill metadata ${listKey} must be a list`)
      current.push(item)
      continue
    }
    if (inMetadata && line.startsWith("  ") && line.includes(":")) {
      const pieces = line.trim().split(":")
      const name = pieces.shift() ?? ""
      const value = unquote(pieces.join(":").trim())
      if (value) {
        fields[`metadata.${name}`] = value
        listKey = null
      } else {
        fields[`metadata.${name}`] = []
        listKey = name
      }
      continue
    }
    if (line && !line.startsWith(" ") && line.includes(":")) {
      inMetadata = false
      listKey = null
      const pieces = line.split(":")
      const name = pieces.shift() ?? ""
      fields[name] = unquote(pieces.join(":").trim())
    }
  }
  return fields
}
