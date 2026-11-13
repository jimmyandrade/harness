"""Tests for montar_lista.py."""

from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from montar_lista import host, montar  # noqa: E402

SCRIPT = HERE / "montar_lista.py"


class MontarTest(unittest.TestCase):
    def test_takes_the_address_out_of_a_name_and_drops_the_button_text(self) -> None:
        linhas = ["Ana Souza <Ana@Exemplo.com>desbloquear", "outro@exemplo.com"]
        self.assertEqual(montar(linhas), ["ana@exemplo.com", "outro@exemplo.com"])

    def test_is_sorted_and_has_no_repeats(self) -> None:
        linhas = ["b.com", "a.com", "B.com", " a.com "]
        self.assertEqual(montar(linhas), ["a.com", "b.com"])

    def test_skips_blank_lines(self) -> None:
        self.assertEqual(montar(["", "  ", "a.com"]), ["a.com"])

    def test_removes_what_the_screen_already_has(self) -> None:
        self.assertEqual(montar(["a.com", "b.com", "c.com"], ja_existe=["b.com"]), ["a.com", "c.com"])

    def test_undoes_the_link_proof_replacement(self) -> None:
        self.assertEqual(montar(["ana[@]exemplo[.]com"]), ["ana@exemplo.com"])

    def test_keeps_an_address_that_holds_another_address(self) -> None:
        linha = "Robert <ana.exemplo.com@envio.eu>desbloquear"
        self.assertEqual(montar([linha]), ["ana.exemplo.com@envio.eu"])


class HostTest(unittest.TestCase):
    def test_drops_the_scheme_the_path_and_the_port(self) -> None:
        self.assertEqual(host("https://pt.exemplo.com/"), "pt.exemplo.com")
        self.assertEqual(host("exemplo.so/tools/baixar"), "exemplo.so")
        self.assertEqual(host("exemplo.com:8080/a?b=1"), "exemplo.com")

    def test_keeps_a_plain_domain_and_an_address(self) -> None:
        self.assertEqual(host("exemplo.com"), "exemplo.com")
        self.assertEqual(host("ana@exemplo.com"), "ana@exemplo.com")

    def test_the_list_of_hosts_has_no_repeats_and_skips_what_the_screen_has(self) -> None:
        urls = ["https://pt.exemplo.com/", "pt.exemplo.com", "outro.com/x"]
        self.assertEqual(montar(urls, ja_existe=["outro.com"], so_host=True), ["pt.exemplo.com"])


class CliTest(unittest.TestCase):
    def test_prints_the_list_from_a_file_and_subtracts_another(self) -> None:
        with tempfile.TemporaryDirectory() as pasta:
            entrada = Path(pasta) / "entrada.txt"
            existente = Path(pasta) / "existente.txt"
            entrada.write_text("c.com\nb.com\nb.com\n", encoding="utf-8")
            existente.write_text("c.com\n", encoding="utf-8")
            saida = subprocess.run(
                [sys.executable, str(SCRIPT), str(entrada), "--ja-existe", str(existente)],
                capture_output=True,
                text=True,
                check=True,
            )
        self.assertEqual(saida.stdout, "b.com\n")

    def test_the_host_flag_turns_urls_into_domains(self) -> None:
        with tempfile.TemporaryDirectory() as pasta:
            entrada = Path(pasta) / "entrada.txt"
            entrada.write_text("https://b.com/x\na.com/y\n", encoding="utf-8")
            saida = subprocess.run(
                [sys.executable, str(SCRIPT), str(entrada), "--so-host"],
                capture_output=True,
                text=True,
                check=True,
            )
        self.assertEqual(saida.stdout, "a.com\nb.com\n")


if __name__ == "__main__":
    unittest.main()
