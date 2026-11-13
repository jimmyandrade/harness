#!/usr/bin/env python3
"""Print the weekday of each date in Portuguese, so nobody works it out in their head.

Usage: weekday.py [--extenso] AAAA-MM-DD [AAAA-MM-DD ...]
One line per date, as `terça-feira, 01/09/2026`. With --extenso, as `terça-feira, 1 de setembro de 2026`.
Exits 1 on a date that does not exist and 2 when no date is given.
"""

from __future__ import annotations

import sys
from datetime import date

WEEKDAYS = ("segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo")
MONTHS = (
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
)  # fmt: skip


def format_date(text: str, long: bool = False) -> str:
    """Return the weekday and the date, from an ISO date. Raises ValueError on an invalid date."""
    if len(text) != 10:
        raise ValueError(text)
    day = date.fromisoformat(text)
    weekday = WEEKDAYS[day.weekday()]
    if long:
        return f"{weekday}, {day.day} de {MONTHS[day.month - 1]} de {day.year}"
    return f"{weekday}, {day.day:02d}/{day.month:02d}/{day.year}"


def main(argv: list[str]) -> int:
    long = "--extenso" in argv
    dates = [arg for arg in argv if arg != "--extenso"]
    if not dates:
        print("Uso: weekday.py [--extenso] AAAA-MM-DD [AAAA-MM-DD ...]", file=sys.stderr)
        return 2
    lines = []
    for text in dates:
        try:
            lines.append(format_date(text, long))
        except ValueError:
            print(f"Data inválida: {text}. Use AAAA-MM-DD.", file=sys.stderr)
            return 1
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
