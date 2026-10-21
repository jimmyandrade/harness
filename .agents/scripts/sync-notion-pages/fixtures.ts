/** Fixtures that the tests of the Notion sync share. */


import {
  pageIcon,
} from "./notion.ts"
import {
  properties,
  type SkillMapping,
} from "./skill-pages.ts"

export function block(yaml: string): string {
  const indented = yaml
    .split("\n")
    .map((line) => (line ? `    ${line}` : line))
    .join("\n")
  return `---\nmetadata:\n  parameters:\n${indented}---\n\n# Instruções do projeto\n`
}

export function instructions(version: string, rule: string): string {
  return `---\ndescription: Use essa habilidade sempre que for executar qualquer tarefa.\nmetadata:\n  version: "${version}"\n  parameters:\n    "Global":\n      "Organização": "example"\n---\n\n# Instruções do projeto\n\n${rule}\n`
}

export function parameters(lines: string): string {
  return block(`"Global":\n${lines}`)
}

export const icon = pageIcon(parameters('  "Ícone das páginas no Notion": "magic-wand"\n  "Cor do ícone das páginas no Notion": "gray"\n'))

export const mapping: SkillMapping = {
  data_source_id: "00000000-0000-4000-8000-000000000000",
  properties: {
    name: "Nome da habilidade",
    description: "Descrição",
    version: "Versão da skill",
    aliases: "Aliases",
    tags: "Tags",
    status: "Status",
  },
}
