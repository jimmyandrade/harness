"""Tests for weekday.py."""

from __future__ import annotations

import contextlib
import importlib.util
import io
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("weekday", HERE / "weekday.py")
wd = importlib.util.module_from_spec(spec)
sys.modules["weekday"] = wd
spec.loader.exec_module(wd)


def run(*argv: str) -> tuple[int, str, str]:
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = wd.main(list(argv))
    return code, out.getvalue(), err.getvalue()


class FormatTest(unittest.TestCase):
    def test_friday_the_13th(self) -> None:
        self.assertEqual(wd.format_date("2026-11-13"), "sexta-feira, 13/11/2026")

    def test_next_day_is_saturday(self) -> None:
        self.assertEqual(wd.format_date("2026-11-14"), "sábado, 14/11/2026")

    def test_day_after_is_sunday(self) -> None:
        self.assertEqual(wd.format_date("2026-11-15"), "domingo, 15/11/2026")

    def test_all_weekdays(self) -> None:
        names = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]
        for offset, name in enumerate(names):
            self.assertTrue(wd.format_date("2026-11-%02d" % (9 + offset)).startswith(name + ","))

    def test_example_of_the_format_parameter(self) -> None:
        self.assertEqual(wd.format_date("2026-09-01"), "terça-feira, 01/09/2026")

    def test_leap_day(self) -> None:
        self.assertEqual(wd.format_date("2028-02-29"), "terça-feira, 29/02/2028")

    def test_long_format(self) -> None:
        self.assertEqual(wd.format_date("2026-09-01", long=True), "terça-feira, 1 de setembro de 2026")
        self.assertEqual(wd.format_date("2026-03-05", long=True), "quinta-feira, 5 de março de 2026")


class CliTest(unittest.TestCase):
    def test_several_dates_one_per_line(self) -> None:
        code, out, _ = run("2026-11-13", "2026-11-14")
        self.assertEqual(code, 0)
        self.assertEqual(out, "sexta-feira, 13/11/2026\nsábado, 14/11/2026\n")

    def test_long_flag(self) -> None:
        code, out, _ = run("--extenso", "2026-11-15")
        self.assertEqual(code, 0)
        self.assertEqual(out, "domingo, 15 de novembro de 2026\n")

    def test_invalid_date_fails(self) -> None:
        for bad in ("2026-02-30", "13/11/2026", "amanhã", "2026-13-01"):
            code, out, err = run(bad)
            self.assertEqual(code, 1, bad)
            self.assertEqual(out, "")
            self.assertIn(bad, err)

    def test_no_argument_fails(self) -> None:
        code, _, err = run()
        self.assertEqual(code, 2)
        self.assertIn("AAAA-MM-DD", err)


if __name__ == "__main__":
    unittest.main()
