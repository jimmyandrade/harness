/**
 * Publish the changed pages of a project to Notion, with the Notion JavaScript SDK.
 * The project is HARNESS_ROOT, or the working directory when it is unset.
 * Skills, and the project instructions file, go to the skills database that
 * .agents/mappings/skill-page.notion.json maps, or --mapping (skill-pages.ts).
 * The data source id comes from NOTION_SKILLS_DATA_SOURCE_ID, or from the mapping
 * when the variable is unset, never from both (ADR 0023); models use
 * NOTION_TEMPLATES_DATA_SOURCE_ID the same way.
 * The page icon name and color are in metadata.parameters of the project instructions file.
 * A setting missing there falls back to the instructions file of this harness (ADR 0009).
 * The project instructions file is published when it changes, when the mapping or
 * this publisher changes, or when the project moves the version of this harness.
 * Models in .agents/assets/templates go to the models database that
 * .agents/mappings/template-page.notion.json names, or --template-mapping
 * (template-pages.ts). Without that file, models are left out (ADR 0012, ADR 0015).
 * With --include-core, the skills and models of this harness are published too, when
 * the project changes a mapping, a workflow, or its package files. Those are the
 * places where a project moves the version of this harness it uses.
 */

import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"
import { MODEL_ICON_SETTINGS, notionApi, pageIcon } from "./notion.ts"
import {
  CORE_VERSION_PATHS,
  coreNamesToPublish,
  coreRoot,
  dataSourceId,
  gate,
  gitNames,
  INSTRUCTIONS_FILE,
  instructionsText,
  namesToPublish,
  projectRoot,
  publisherChanged,
  SKILLS_DATA_SOURCE_VARIABLE,
  TEMPLATES_DATA_SOURCE_VARIABLE,
} from "./project.ts"
import {
  allSkillNames,
  bindNotion,
  DEFAULT_MAPPING_PATH,
  gitChangedFiles,
  gitSkillStatus,
  instructionsToPublish,
  parseSkill,
  previousNames,
  publish,
  publishInstructions,
  skillNamesFromPaths,
  type SkillMapping,
} from "./skill-pages.ts"
import {
  allTemplateNames,
  bindTemplates,
  coreTemplatesToPublish,
  DEFAULT_TEMPLATE_MAPPING_PATH,
  publishTemplates,
  TEMPLATES_DIR,
  templateNamesFromPaths,
  type TemplateMapping,
} from "./template-pages.ts"

function argValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag)
  return index < 0 ? undefined : argv[index + 1]
}

export async function main(argv: string[]): Promise<number> {
  const base = argValue(argv, "--base")
  const head = argValue(argv, "--head")
  if (base === undefined || head === undefined) throw new Error("--base and --head are required")
  const root = projectRoot(process.env, process.cwd())
  const core = coreRoot()
  const mappingPath = argValue(argv, "--mapping") || DEFAULT_MAPPING_PATH
  const mapping = JSON.parse(readFileSync(join(root, mappingPath), "utf8")) as SkillMapping
  const icon = pageIcon(
    instructionsText(root),
    instructionsText(core),
  )
  const rulesChanged = publisherChanged(root, base, head, mappingPath)
  const names = namesToPublish(skillNamesFromPaths(gitChangedFiles(root, base, head)), rulesChanged, allSkillNames(root))
  const coreVersionChanged = gitNames(root, base, head, CORE_VERSION_PATHS).length > 0
  const coreNames =
    argv.includes("--include-core") && core !== root
      ? coreNamesToPublish(
          allSkillNames(root),
          allSkillNames(core),
          rulesChanged,
          coreVersionChanged,
        )
      : []
  const previous = previousNames(gitSkillStatus(root, base, head), (name) => {
    let text: string
    try {
      text = readFileSync(join(root, ".agents", "skills", name, "SKILL.md"), "utf8")
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined
      if (code === "ENOENT") throw new Error(`${name} rename is missing SKILL.md`)
      throw error
    }
    const page = parseSkill(text)
    return page.aliases ?? []
  })
  const templateMappingPath = argValue(argv, "--template-mapping") || DEFAULT_TEMPLATE_MAPPING_PATH
  const templateMapping = existsSync(join(root, templateMappingPath))
    ? (JSON.parse(readFileSync(join(root, templateMappingPath), "utf8")) as TemplateMapping)
    : null
  const changedTemplates = templateNamesFromPaths(gitNames(root, base, head, [TEMPLATES_DIR]))
  let templateNames: string[] = []
  let coreTemplateNames: string[] = []
  if (templateMapping) {
    const templateRulesChanged = publisherChanged(root, base, head, templateMappingPath)
    templateNames = namesToPublish(changedTemplates, templateRulesChanged, allTemplateNames(root))
    coreTemplateNames =
      argv.includes("--include-core") && core !== root
        ? coreTemplatesToPublish(root, core, templateRulesChanged, coreVersionChanged)
        : []
  } else if (changedTemplates.length) {
    console.log(`skip templates: ${templateMappingPath} is missing`)
  }
  const token = process.env.NOTION_TOKEN ?? ""
  const instructionsChanged = instructionsToPublish({
    isCore: core === root,
    instructionsChanged: gitNames(root, base, head, [INSTRUCTIONS_FILE]).length > 0,
    rulesChanged,
    coreVersionChanged,
  })
  const code = gate(
    [...names, ...coreNames, ...templateNames, ...coreTemplateNames, ...(instructionsChanged ? [INSTRUCTIONS_FILE] : [])],
    token,
  )
  if (code === 0) {
    console.log("no changed skill")
    return 0
  }
  if (code === 2) {
    console.error("NOTION_TOKEN is missing")
    return 2
  }
  mapping.data_source_id = dataSourceId(mapping.data_source_id, process.env[SKILLS_DATA_SOURCE_VARIABLE], {
    variable: SKILLS_DATA_SOURCE_VARIABLE,
    mapping: mappingPath,
  })
  if (templateMapping) {
    templateMapping.data_source_id = dataSourceId(
      templateMapping.data_source_id,
      process.env[TEMPLATES_DATA_SOURCE_VARIABLE],
      { variable: TEMPLATES_DATA_SOURCE_VARIABLE, mapping: templateMappingPath },
    )
  }
  const api = notionApi(token)
  const notion = bindNotion(api, icon)
  for (const line of await publish(root, names, notion, mapping, previous)) {
    console.log(line)
  }
  if (instructionsChanged) console.log(await publishInstructions(root, notion, mapping))
  for (const line of await publish(core, coreNames, notion, mapping)) {
    console.log(`core ${line}`)
  }
  if (templateMapping) {
    const templates = bindTemplates(api, pageIcon(instructionsText(root), instructionsText(core), MODEL_ICON_SETTINGS))
    for (const line of await publishTemplates(root, templateNames, templates, templateMapping)) {
      console.log(line)
    }
    for (const line of await publishTemplates(core, coreTemplateNames, templates, templateMapping)) {
      console.log(`core ${line}`)
    }
  }
  return 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error: unknown) => {
      console.error(error)
      process.exit(1)
    },
  )
}
