#!/usr/bin/env python3

import json
import sys
from pathlib import Path
from typing import Set


def check(message: str, files: Set[str]):
    if any(files):
        print(f"{message}: {sorted(files)}", file=sys.stderr)
    return any(files)


def main():
    base = Path(__file__).parent
    folder = base / 'assets/overlays'
    files = set(file.stem for file in folder.iterdir())
    ids_in_json = set(json.loads((base / 'index.json').read_bytes()).keys())

    if any(
        [check("Missing SVG overlays", ids_in_json - files), check("Missing info in index.json", files - ids_in_json),]
    ):
        print(file=sys.stderr)
        print(f"SVG overlays: {len(files)}", file=sys.stderr)
        print(f"Sights in JSON: {len(ids_in_json)}", file=sys.stderr)
        exit(1)


if __name__ == '__main__':
    main()
