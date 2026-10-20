#!/usr/bin/env python3
"""Read the public data of a Spotify or YouTube link and print it as JSON.

The full Spotify and YouTube pages come back empty or truncated to a fetch tool.
The Spotify embed page and the YouTube oEmbed endpoint answer without login, so
this script reads those. One JSON object per link:

- Spotify artist: name, ID and top tracks with their credits.
- Spotify track: title, credited artists with their IDs and release date.
- YouTube video: title and channel.
- YouTube channel: name and description.
- YouTube playlist: the title and channel of each video.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request

USER_AGENT = "Mozilla/5.0"
SPOTIFY = re.compile(r"open\.spotify\.com/(?:intl-[a-z-]+/)?(artist|track|album)/([A-Za-z0-9]{22})")
NEXT_DATA = re.compile(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', re.S)
META = re.compile(r'<meta (?:property|name)="(og:title|og:description|description)" content="([^"]*)"')
VIDEO_ID = re.compile(r'"videoId":"([A-Za-z0-9_-]{11})"')


def classify(url: str) -> tuple[str, str, str] | None:
    """Return (platform, kind, id) for a link this script reads, or None."""
    match = SPOTIFY.search(url)
    if match:
        return "spotify", match.group(1), match.group(2)
    parsed = urllib.parse.urlparse(url if "://" in url else "https://" + url)
    host = parsed.netloc.lower().removeprefix("www.").removeprefix("m.")
    query = urllib.parse.parse_qs(parsed.query)
    if host == "youtu.be":
        return "youtube", "video", parsed.path.strip("/")
    if host != "youtube.com":
        return None
    if parsed.path == "/watch" and query.get("v"):
        return "youtube", "video", query["v"][0]
    if parsed.path == "/playlist" and query.get("list"):
        return "youtube", "playlist", query["list"][0]
    if parsed.path.startswith("/@"):
        return "youtube", "channel", parsed.path[2:].split("/")[0]
    if parsed.path.startswith(("/channel/", "/c/", "/user/")):
        return "youtube", "channel", parsed.path.strip("/").split("/")[1]
    return None


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "pt-BR"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


def spotify_entity(html: str) -> dict:
    """The entity of a Spotify embed page."""
    match = NEXT_DATA.search(html)
    if not match:
        raise ValueError("a página de embed do Spotify não trouxe __NEXT_DATA__")
    return json.loads(match.group(1))["props"]["pageProps"]["state"]["data"]["entity"]


def spotify_summary(kind: str, entity: dict) -> dict:
    if kind == "artist":
        return {
            "nome": entity.get("name"),
            "faixas_mais_tocadas": [
                {"título": track.get("title"), "créditos": track.get("subtitle")}
                for track in entity.get("trackList", [])
            ],
        }
    release = (entity.get("releaseDate") or {}).get("isoString")
    return {
        "título": entity.get("name") or entity.get("title"),
        "artistas": [
            {"nome": artist.get("name"), "id": (artist.get("uri") or "").rsplit(":", 1)[-1]}
            for artist in entity.get("artists", [])
        ],
        "lançamento": release[:10] if release else None,
    }


def oembed(video_id: str) -> dict:
    url = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(
        f"https://www.youtube.com/watch?v={video_id}", safe=""
    )
    data = json.loads(fetch(url))
    return {"id": video_id, "título": data.get("title"), "canal": data.get("author_name")}


def channel_summary(html: str) -> dict:
    meta = dict(META.findall(html))
    return {"nome": meta.get("og:title"), "descrição": meta.get("og:description") or meta.get("description")}


def playlist_ids(html: str) -> list[str]:
    seen: list[str] = []
    for video_id in VIDEO_ID.findall(html):
        if video_id not in seen:
            seen.append(video_id)
    return seen


def read(url: str) -> dict:
    found = classify(url)
    if not found:
        return {"link": url, "erro": "link que este script não lê"}
    platform, kind, ident = found
    result = {"link": url, "plataforma": platform, "tipo": kind, "id": ident}
    try:
        if platform == "spotify":
            entity = spotify_entity(fetch(f"https://open.spotify.com/embed/{kind}/{ident}"))
            result.update(spotify_summary(kind, entity))
        elif kind == "video":
            result.update(oembed(ident))
        elif kind == "channel":
            path = f"@{ident}" if url.split("youtube.com/", 1)[-1].startswith("@") else f"channel/{ident}"
            result.update(channel_summary(fetch(f"https://www.youtube.com/{path}/about")))
        else:
            html = fetch(f"https://www.youtube.com/playlist?list={ident}")
            result["vídeos"] = [oembed(video_id) for video_id in playlist_ids(html)]
    except Exception as error:  # noqa: BLE001 - every failure is reported, not raised
        result["erro"] = str(error)
    return result


def main() -> int:
    if len(sys.argv) < 2:
        print("uso: read-profile.py <link> [<link> ...]", file=sys.stderr)
        return 2
    results = [read(url) for url in sys.argv[1:]]
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return 1 if any("erro" in result for result in results) else 0


if __name__ == "__main__":
    sys.exit(main())
