#!/usr/bin/env python3
"""Compare transcripts of the same audio made by different engines.

Usage: python3 -I compare_transcripts.py <reference.txt> <other.txt> [<other.txt> ...] [--min-words 6]

The first file is the reference of the comparison, not the truth: with no reference text, the numbers say how much
the engines agree. For each other file it prints the words, commas, full stops, how much of its words the reference
has, how much of the reference words it has, and the stretches of `--min-words` words or more where they differ.
It also lists a phrase of six words that repeats three times or more, the loop an engine can fall into.
"""
import argparse
import collections
import difflib
import re
import sys


def words(text):
    return re.findall(r"[\wÀ-ÿ'-]+", text.lower())


def coverage(a, b):
    """Share of the words of `a` found, in order, in `b`."""
    if not a:
        return 0.0
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(block.size for block in matcher.get_matching_blocks()) / len(a)


def repeated(tokens, size=6, times=3):
    counts = collections.Counter(tuple(tokens[i:i + size]) for i in range(len(tokens) - size))
    return [" ".join(key) for key, count in counts.items() if count >= times][:5]


def differences(ref, other, min_words):
    matcher = difflib.SequenceMatcher(None, ref, other, autojunk=False)
    found = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag != "equal" and max(i2 - i1, j2 - j1) >= min_words:
            found.append((" ".join(ref[i1:i2])[:100], " ".join(other[j1:j2])[:100]))
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+")
    parser.add_argument("--min-words", type=int, default=6)
    args = parser.parse_args()
    if len(args.files) < 2:
        sys.exit("give the reference and at least one other transcript")
    texts = {}
    for path in args.files:
        with open(path, encoding="utf-8") as handle:
            texts[path] = handle.read()
    tokens = {path: words(text) for path, text in texts.items()}
    reference = args.files[0]
    for path in args.files:
        text = texts[path]
        print(f"{path}: {len(tokens[path])} words, {text.count(',')} commas, {text.count('.')} full stops")
        for phrase in repeated(tokens[path]):
            print(f"  repeated phrase: {phrase}")
    for path in args.files[1:]:
        print(f"\n{path} against {reference}")
        print(f"  words of this file found in the reference: {coverage(tokens[path], tokens[reference]):.0%}")
        print(f"  words of the reference found in this file: {coverage(tokens[reference], tokens[path]):.0%}")
        for ref_part, other_part in differences(tokens[reference], tokens[path], args.min_words):
            print(f"  differs: reference \"{ref_part}\" | this file \"{other_part}\"")


if __name__ == "__main__":
    main()
