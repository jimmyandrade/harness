#!/usr/bin/env python3
"""Build a clean list of senders: sorted, with no repeats, and without what the screen already has.

The opening comment points at the parameters in the frontmatter of AGENTS.md. This script has none.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

BUTTON_TEXT = "desbloquear"
ANGLE = re.compile(r"<([^<>]+)>")


def limpar(linha: str) -> str:
    """Return the address or domain of one line, in lowercase, or an empty string."""
    texto = linha.strip()
    if texto.lower().endswith(BUTTON_TEXT):
        texto = texto[: -len(BUTTON_TEXT)].strip()
    dentro = ANGLE.search(texto)
    if dentro:
        texto = dentro.group(1)
    texto = texto.replace("[.]", ".").replace("[@]", "@")
    return texto.strip().lower()


def montar(linhas: list[str], ja_existe: list[str] | None = None) -> list[str]:
    """Return the cleaned entries, sorted, without repeats and without the ones already on the screen."""
    ja = {limpar(linha) for linha in (ja_existe or [])}
    entradas = {limpar(linha) for linha in linhas}
    return sorted(entrada for entrada in entradas if entrada and entrada not in ja)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("entrada", type=Path, help="text file with one sender per line, as pasted")
    parser.add_argument("--ja-existe", type=Path, action="append", default=[], help="file with what the screen already has")
    args = parser.parse_args(argv)
    linhas = args.entrada.read_text(encoding="utf-8").splitlines()
    existentes: list[str] = []
    for arquivo in args.ja_existe:
        existentes.extend(arquivo.read_text(encoding="utf-8").splitlines())
    for entrada in montar(linhas, existentes):
        sys.stdout.write(entrada + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
