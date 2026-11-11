"""Build the updater manifest from the signed Windows portable ZIP.

    python scripts/make-latest-json.py <directory with portable ZIP and .sig> <tag> <notes.md> > latest.json

The 12e Downloader portable app uses this manifest to detect new versions, then opens the download page
instead of replacing its own files.
"""
import datetime
import json
import os
import pathlib
import sys

src, tag, notes_path = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3]
version = tag.lstrip("v")
base = os.environ.get("UPDATE_BASE_URL") or f"https://github.com/taolaohht/download-manager/releases/download/{tag}/"

bundle = next(
    (p for p in src.rglob("*-windows-x64-portable.zip") if p.name.startswith("12e-Downloader-")),
    None,
)
if bundle and not bundle.name.startswith(f"12e-Downloader-{version}-"):
    sys.exit(
        f"{bundle.name} doesn't match tag {tag}: bump the version in tauri.conf.json, Cargo.toml and app/package.json"
    )
sig = bundle and bundle.with_name(bundle.name + ".sig")
if not bundle or not sig.exists():
    sys.exit("no signed Windows x64 portable ZIP found")

notes = pathlib.Path(notes_path).read_text(encoding="utf-8")
whats_new = notes.split("## What's new", 1)[-1].split("\n## ", 1)[0] if "## What's new" in notes else ""
json.dump(
    {
        "version": version,
        "notes": whats_new.split("\n", 1)[-1].strip(),
        "pub_date": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "platforms": {
            "windows-x86_64": {
                "signature": sig.read_text(encoding="utf-8").strip(),
                "url": base + bundle.name,
            }
        },
    },
    sys.stdout,
    indent=2,
)
