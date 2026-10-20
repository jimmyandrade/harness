"""Tests for read-profile.py."""

from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "read-profile.py"
_spec = importlib.util.spec_from_file_location("read_profile", SCRIPT)
read_profile = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(read_profile)


def embed(entity: dict) -> str:
    data = {"props": {"pageProps": {"state": {"data": {"entity": entity}}}}}
    return f'<html><script id="__NEXT_DATA__" type="application/json">{json.dumps(data)}</script></html>'


class ClassifyTest(unittest.TestCase):
    def test_should_read_a_spotify_artist_link_with_locale_and_tracking(self):
        url = "https://open.spotify.com/intl-pt/artist/0ArtistaExemplo0000000?si=rastreio0000000000000"
        self.assertEqual(read_profile.classify(url), ("spotify", "artist", "0ArtistaExemplo0000000"))

    def test_should_read_a_spotify_track_link(self):
        url = "https://open.spotify.com/track/0FaixaExemplo000000000"
        self.assertEqual(read_profile.classify(url), ("spotify", "track", "0FaixaExemplo000000000"))

    def test_should_read_a_video_link_that_is_part_of_a_playlist_as_the_video(self):
        url = "https://www.youtube.com/watch?v=vid00000001&list=PLexemplo0000000000000000000000000&index=9"
        self.assertEqual(read_profile.classify(url), ("youtube", "video", "vid00000001"))

    def test_should_read_a_short_video_link(self):
        self.assertEqual(read_profile.classify("https://youtu.be/vid00000001"), ("youtube", "video", "vid00000001"))

    def test_should_read_a_channel_handle(self):
        self.assertEqual(read_profile.classify("https://www.youtube.com/@ArtistaExemplo"), ("youtube", "channel", "ArtistaExemplo"))

    def test_should_read_a_playlist_link(self):
        url = "https://www.youtube.com/playlist?list=PLexemplo0000000000000000000000000"
        self.assertEqual(read_profile.classify(url), ("youtube", "playlist", "PLexemplo0000000000000000000000000"))

    def test_should_refuse_a_link_from_another_site(self):
        self.assertIsNone(read_profile.classify("https://www.instagram.com/artistaexemplo/"))


class SpotifyTest(unittest.TestCase):
    def test_should_list_the_top_tracks_of_an_artist_with_their_credits(self):
        entity = {"name": "Artista Exemplo", "trackList": [{"title": "Canção Exemplo", "subtitle": "Parceira Exemplo, Artista Exemplo"}]}
        summary = read_profile.spotify_summary("artist", read_profile.spotify_entity(embed(entity)))
        self.assertEqual(summary["nome"], "Artista Exemplo")
        self.assertEqual(summary["faixas_mais_tocadas"], [{"título": "Canção Exemplo", "créditos": "Parceira Exemplo, Artista Exemplo"}])

    def test_should_give_each_artist_of_a_track_the_id_that_matches_the_artist_link(self):
        entity = {
            "name": "Canção Exemplo - Ao Vivo",
            "artists": [{"name": "Artista Exemplo", "uri": "spotify:artist:0ArtistaExemplo0000000"}],
            "releaseDate": {"isoString": "2024-04-12T00:00:00Z"},
        }
        summary = read_profile.spotify_summary("track", entity)
        self.assertEqual(summary["artistas"], [{"nome": "Artista Exemplo", "id": "0ArtistaExemplo0000000"}])
        self.assertEqual(summary["lançamento"], "2024-04-12")

    def test_should_fail_with_a_message_when_the_embed_has_no_data(self):
        with self.assertRaises(ValueError):
            read_profile.spotify_entity("<html></html>")


class YouTubeTest(unittest.TestCase):
    def test_should_read_the_name_and_description_of_a_channel(self):
        html = '<meta property="og:title" content="Artista Exemplo"><meta property="og:description" content="Cantor.">'
        self.assertEqual(read_profile.channel_summary(html), {"nome": "Artista Exemplo", "descrição": "Cantor."})

    def test_should_keep_each_video_of_a_playlist_once_in_order(self):
        html = '"videoId":"vid00000001" "videoId":"vid-_000002" "videoId":"vid00000001"'
        self.assertEqual(read_profile.playlist_ids(html), ["vid00000001", "vid-_000002"])


class ReadTest(unittest.TestCase):
    def test_should_report_a_link_it_does_not_read_without_fetching(self):
        self.assertIn("erro", read_profile.read("https://www.instagram.com/artistaexemplo/"))


if __name__ == "__main__":
    unittest.main()
