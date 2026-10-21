import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import {
  blankBase,
  coreNamesToPublish,
  coreRoot,
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
