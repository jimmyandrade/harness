"""Tests for .agents/scripts/progress-dashboard/progress-dashboard.py."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "progress-dashboard.py"
spec = importlib.util.spec_from_file_location("progress_dashboard", SCRIPT)
dashboard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dashboard)


class PercentTest(unittest.TestCase):
    def test_returns_half_when_half_is_done(self) -> None:
        self.assertEqual(dashboard.percent(5, 10), 50)

    def test_returns_zero_when_the_total_is_zero(self) -> None:
        self.assertEqual(dashboard.percent(3, 0), 0)

    def test_stays_within_zero_and_one_hundred(self) -> None:
        self.assertEqual(dashboard.percent(12, 10), 100)
        self.assertEqual(dashboard.percent(-2, 10), 0)


class WriteProgressTest(unittest.TestCase):
    def setUp(self) -> None:
        self.dir = tempfile.TemporaryDirectory()
        self.path = Path(self.dir.name) / "progress.json"

    def tearDown(self) -> None:
        self.dir.cleanup()

    def test_writes_valid_json_with_the_time_of_the_update(self) -> None:
        dashboard.write_progress(self.path, {"title": "Migration", "phases": []})
        data = json.loads(self.path.read_text())
        self.assertEqual(data["title"], "Migration")
        self.assertIn("updated_at", data)

    def test_replaces_the_file_without_leaving_a_temporary_one_behind(self) -> None:
        dashboard.write_progress(self.path, {"title": "One"})
        dashboard.write_progress(self.path, {"title": "Two"})
        self.assertEqual(json.loads(self.path.read_text())["title"], "Two")
        self.assertEqual([p.name for p in Path(self.dir.name).iterdir()], ["progress.json"])


class ReadProgressTest(unittest.TestCase):
    def setUp(self) -> None:
        self.dir = tempfile.TemporaryDirectory()
        self.path = Path(self.dir.name) / "progress.json"

    def tearDown(self) -> None:
        self.dir.cleanup()

    def test_waits_when_the_file_does_not_exist_yet(self) -> None:
        self.assertEqual(dashboard.read_progress(self.path)["status"], "waiting")

    def test_reports_an_error_when_the_file_is_not_valid_json(self) -> None:
        self.path.write_text("{not json")
        state = dashboard.read_progress(self.path)
        self.assertEqual(state["status"], "error")
        self.assertIn("message", state)

    def test_returns_the_state_written_by_the_producer(self) -> None:
        dashboard.write_progress(self.path, {"title": "Migration", "phases": [{"name": "Download", "done": 1, "total": 2}]})
        state = dashboard.read_progress(self.path)
        self.assertEqual(state["title"], "Migration")
        self.assertEqual(state["phases"][0]["percent"], 50)


class UpdateProgressTest(unittest.TestCase):
    def setUp(self) -> None:
        self.dir = tempfile.TemporaryDirectory()
        self.path = Path(self.dir.name) / "progress.json"

    def tearDown(self) -> None:
        self.dir.cleanup()

    def test_creates_the_phase_when_it_does_not_exist(self) -> None:
        dashboard.update_progress(self.path, phase="Download", done=3, total=10, status="running")
        phase = json.loads(self.path.read_text())["phases"][0]
        self.assertEqual((phase["name"], phase["done"], phase["total"], phase["status"]), ("Download", 3, 10, "running"))

    def test_updates_the_phase_with_the_same_name_instead_of_adding_another(self) -> None:
        dashboard.update_progress(self.path, phase="Download", done=3, total=10)
        dashboard.update_progress(self.path, phase="Download", done=7)
        phases = json.loads(self.path.read_text())["phases"]
        self.assertEqual(len(phases), 1)
        self.assertEqual((phases[0]["done"], phases[0]["total"]), (7, 10))

    def test_keeps_only_the_last_log_lines(self) -> None:
        for number in range(dashboard.MAX_LOG_LINES + 5):
            dashboard.update_progress(self.path, log=f"line {number}")
        log = json.loads(self.path.read_text())["log"]
        self.assertEqual(len(log), dashboard.MAX_LOG_LINES)
        self.assertEqual(log[-1], f"line {dashboard.MAX_LOG_LINES + 4}")

    def test_sets_a_counter(self) -> None:
        dashboard.update_progress(self.path, counters={"errors": 2})
        self.assertEqual(json.loads(self.path.read_text())["counters"], {"errors": 2})


class ServerTest(unittest.TestCase):
    def setUp(self) -> None:
        self.dir = tempfile.TemporaryDirectory()
        self.path = Path(self.dir.name) / "progress.json"
        dashboard.write_progress(self.path, {"title": "Migration", "phases": []})
        self.server = dashboard.make_server(self.path, port=0)
        self.base = f"http://127.0.0.1:{self.server.server_address[1]}"
        threading.Thread(target=self.server.serve_forever, daemon=True).start()

    def tearDown(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.dir.cleanup()

    def get(self, route: str):
        return urllib.request.urlopen(self.base + route, timeout=5)

    def test_listens_only_on_the_loopback_address(self) -> None:
        self.assertEqual(self.server.server_address[0], "127.0.0.1")

    def test_serves_the_page_that_reads_the_progress(self) -> None:
        body = self.get("/").read().decode()
        self.assertIn("progress.json", body)

    def test_serves_the_current_progress_without_cache(self) -> None:
        response = self.get("/progress.json")
        self.assertEqual(json.loads(response.read())["title"], "Migration")
        self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_shows_a_change_of_the_producer_on_the_next_request(self) -> None:
        dashboard.write_progress(self.path, {"title": "Changed"})
        self.assertEqual(json.loads(self.get("/progress.json").read())["title"], "Changed")

    def test_answers_not_found_for_any_other_route(self) -> None:
        with self.assertRaises(urllib.error.HTTPError) as caught:
            self.get("/../etc/passwd")
        caught.exception.close()
        self.assertEqual(caught.exception.code, 404)


if __name__ == "__main__":
    unittest.main()
