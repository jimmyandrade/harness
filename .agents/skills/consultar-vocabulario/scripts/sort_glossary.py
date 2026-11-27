#!/usr/bin/env python3
"""Reorder the keys of a glossary JSON file by the criterion the glossary tool enforces.

The criterion folds case and ignores accents. The content of each row is not
changed: the script refuses to write if any row would differ.

Usage: sort_glossary.py <glossary.json>
Output: JSON with the file, the number of rows and the terms that moved.
"""
import json
import sys
import unicodedata


def key(term: str) -> str:
    folded = term.replace("ß", "ss")
    base = "".join(c for c in unicodedata.normalize("NFD", folded) if unicodedata.category(c) != "Mn")
    return base.lower()


def sort_glossary(path: str) -> dict:
    with open(path, encoding="utf-8") as handle:
        original = json.load(handle)
    if not isinstance(original, dict):
        raise SystemExit("the glossary must be a JSON object")
    ordered = dict(sorted(original.items(), key=lambda item: key(item[0])))
    if len(ordered) != len(original) or any(ordered[term] != original[term] for term in original):
        raise SystemExit("a row would change: nothing was written")
    before = list(original)
    after = list(ordered)
    moved = [term for index, term in enumerate(after) if before[index] != term]
    if moved:
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(json.dumps(ordered, ensure_ascii=False, indent=2) + "\n")
    return {"file": path, "rows": len(ordered), "moved": len(moved), "terms": moved[:20]}


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: sort_glossary.py <glossary.json>")
    print(json.dumps(sort_glossary(sys.argv[1]), ensure_ascii=False))
