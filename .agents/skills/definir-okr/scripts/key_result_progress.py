"""Compute the progress of a key result from its direction, current value, target and base.

Directions: increase, decrease, stay-above, stay-below. Progress 1.0 means the
target was reached; above 1.0 means it was passed. A decreasing key result needs
a base above its target. Prints JSON with progress and reached.
Usage: key_result_progress.py --direction <direction> --current <n> --target <n> [--base <n>]
"""

from __future__ import annotations

import argparse
import json

DIRECTIONS = ("increase", "decrease", "stay-above", "stay-below")


def progress(direction: str, current: float, target: float, base: float | None = None) -> dict[str, float | bool]:
    if direction == "increase":
        start = 0.0 if base is None else base
        if target == start:
            raise ValueError("The target of an increasing key result must differ from its base.")
        return {"progress": (current - start) / (target - start), "reached": current >= target}
    if direction == "decrease":
        if base is None:
            raise ValueError("A decreasing key result needs a base.")
        if base <= target:
            raise ValueError("The base of a decreasing key result must be above the target.")
        return {"progress": (base - current) / (base - target), "reached": current <= target}
    if direction == "stay-above":
        reached = current >= target
        return {"progress": 1.0 if reached or target == 0 else current / target, "reached": reached}
    if direction == "stay-below":
        reached = current <= target
        return {"progress": 1.0 if reached else target / current, "reached": reached}
    raise ValueError(f"Unknown direction {direction!r}. Use one of: {', '.join(DIRECTIONS)}.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--direction", required=True, choices=DIRECTIONS)
    parser.add_argument("--current", required=True, type=float)
    parser.add_argument("--target", required=True, type=float)
    parser.add_argument("--base", type=float)
    args = parser.parse_args()
    print(json.dumps(progress(args.direction, args.current, args.target, args.base)))


if __name__ == "__main__":
    main()
