"""Tests for compose-skill.py."""

from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("compose_skill", HERE / "compose-skill.py")
compose_skill = importlib.util.module_from_spec(spec)
sys.modules["compose_skill"] = compose_skill
spec.loader.exec_module(compose_skill)

CORE = """---
name: definir-pedido
description: core
metadata:
  author: core
  version: "0.1.0"
---

# Definir pedido

## Instruções

### Passo 1

<!-- extension-point: tipo -->
Pergunte o tipo.
<!-- /extension-point -->

### Passo 2

<!-- extension-point: fonte -->
Use a fonte que a pessoa indicar.
<!-- /extension-point -->

## Pegadinhas

- Do core.

## Scripts disponíveis

- Nenhum.
"""

EXTENSION = """---
name: definir-pedido
description: negócio
metadata:
  author: example
  version: "0.2.0"
  extends: core:definir-pedido
---

# Definir pedido

Siga `core:definir-pedido`.

## Pontos de extensão

### tipo

Siga `definir-tipo`.

## Pegadinhas

- Do negócio.
"""


class ComposeTest(unittest.TestCase):
    def test_should_fill_a_point_and_keep_the_default_of_another(self) -> None:
        text = compose_skill.compose(CORE, EXTENSION)
        self.assertIn("Siga `definir-tipo`.", text)
        self.assertNotIn("Pergunte o tipo.", text)
        self.assertIn("Use a fonte que a pessoa indicar.", text)

    def test_should_drop_every_marker(self) -> None:
        self.assertNotIn("extension-point", compose_skill.compose(CORE, EXTENSION))
        self.assertNotIn("extension-point", compose_skill.compose(CORE))

    def test_should_take_the_frontmatter_of_the_extension(self) -> None:
        text = compose_skill.compose(CORE, EXTENSION)
        self.assertIn("description: negócio", text)
        self.assertIn('version: "0.2.0"', text)

    def test_should_append_a_section_to_the_core_section_with_the_same_title(self) -> None:
        text = compose_skill.compose(CORE, EXTENSION)
        self.assertLess(text.index("- Do core."), text.index("- Do negócio."))
        self.assertLess(text.index("- Do negócio."), text.index("## Scripts disponíveis"))

    def test_should_reject_a_point_the_core_does_not_declare(self) -> None:
        extension = EXTENSION.replace("### tipo", "### prazo")
        with self.assertRaisesRegex(ValueError, "no extension point prazo"):
            compose_skill.compose(CORE, extension)

    def test_should_reject_a_point_declared_twice(self) -> None:
        core = CORE.replace("extension-point: fonte", "extension-point: tipo")
        with self.assertRaisesRegex(ValueError, "declared twice"):
            compose_skill.points(compose_skill.split(core)[1])

    def test_should_reject_an_unclosed_marker(self) -> None:
        core = CORE.replace("<!-- /extension-point -->\n\n### Passo 2", "\n### Passo 2")
        with self.assertRaisesRegex(ValueError, "malformed"):
            compose_skill.points(compose_skill.split(core)[1])

    def test_should_read_metadata_extends(self) -> None:
        self.assertEqual(compose_skill.extends(EXTENSION), "core:definir-pedido")
        self.assertIsNone(compose_skill.extends(CORE))

    def test_should_add_a_section_the_core_does_not_have(self) -> None:
        extension = EXTENSION + "\n## Casos-limite\n\n- Do negócio também.\n"
        text = compose_skill.compose(CORE, extension)
        self.assertTrue(text.rstrip().endswith("- Do negócio também."))


if __name__ == "__main__":
    unittest.main()
