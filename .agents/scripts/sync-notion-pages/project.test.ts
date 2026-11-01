import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import {
  blankBase,
  coreNamesToPublish,
  coreRoot,
  getDataSourceId,
  gate,
  namesToPublish,
  projectRoot,
} from "./project.ts"
import {
  gitChangedFiles,
  publish,
} from "./skill-pages.ts"
import { mapping } from "./fixtures.ts"

test("blank base publishes nothing", () => {
  assert.equal(blankBase("0".repeat(40)), true)
  assert.deepEqual(gitChangedFiles(".", "0".repeat(40), "abc"), [])
})

test("token is required only when a skill changed", () => {
  assert.equal(gate([], ""), 0)
  assert.equal(gate(["definir-tarefa"], ""), 2)
  assert.equal(gate(["definir-tarefa"], "token"), null)
})

test("a publisher change republishes every skill", () => {
  assert.deepEqual(namesToPublish(["definir-tarefa"], false, ["a", "b"]), ["definir-tarefa"])
  assert.deepEqual(namesToPublish([], true, ["a", "b"]), ["a", "b"])
})

test("the project root is HARNESS_ROOT, or the working directory", () => {
  const project = mkdtempSync(join(tmpdir(), "harness-project-"))
  mkdirSync(join(project, ".agents", "skills", "uma"), { recursive: true })
  mkdirSync(join(project, ".git"), { recursive: true })
  const core = coreRoot()
  assert.equal(projectRoot({ HARNESS_ROOT: project }, core), project)
  assert.equal(projectRoot({}, join(project, ".agents", "skills", "uma")), project)
})

test("core skills publish when the project moves the core version or its mapping", () => {
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], false, false), [])
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], false, true), ["criar-commit"])
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], true, false), ["criar-commit"])
  assert.throws(() => coreNamesToPublish(["criar-commit"], ["criar-commit"], true, true), /criar-commit exists/)
})

test("the data source id comes from the secret, and the mapping only warns until it migrates", () => {
  const where = {
    environmentVariable: "NOTION_SKILLS_DATA_SOURCE_ID",
    actionInput: "skills-data-source-id",
    mappingPath: ".agents/mappings/skill-page.notion.json",
  }
  const id = "3c077062-d4c6-8094-9a27-000bf7b8710d"

  const fromSecret = getDataSourceId({ ...where, dataSourceIdInEnvironment: id, dataSourceIdInMapping: undefined })
  assert.deepEqual(fromSecret, { dataSourceId: id })

  const fromMapping = getDataSourceId({ ...where, dataSourceIdInEnvironment: "", dataSourceIdInMapping: id })
  assert.equal(fromMapping.dataSourceId, id)
  assert.match(fromMapping.warning ?? "", /Move it to the NOTION_SKILLS_DATA_SOURCE_ID secret/)
  assert.match(fromMapping.warning ?? "", /docs\/adr\/0023-/)

  assert.throws(
    () => getDataSourceId({ ...where, dataSourceIdInEnvironment: id, dataSourceIdInMapping: id }),
    /Delete data_source_id from \.agents\/mappings\/skill-page\.notion\.json/,
  )
  assert.throws(
    () => getDataSourceId({ ...where, dataSourceIdInEnvironment: "  ", dataSourceIdInMapping: undefined }),
    /Store the id .* as the NOTION_SKILLS_DATA_SOURCE_ID secret .* skills-data-source-id input/,
  )
})
