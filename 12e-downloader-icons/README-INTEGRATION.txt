# 12e downloader icon assets

These assets were generated from the supplied 12e downloader logo.

## Contents
- `app/src-tauri/icons/`: Tauri application icon files (PNG and Windows ICO).
- `app/src-tauri/icons/tray/`: filenames currently referenced by `app/src-tauri/src/tray.rs`.
- `extension/icons/`: browser-extension icon images at 16, 32, 48 and 128 px.
- `tray/variants/`: idle, downloading, paused and error variants for dark/light contexts and monochrome template use.

## Integration notes
1. Copy the folders into the repository root, preserving the directory structure.
2. Review `app/src-tauri/tauri.conf.json` to ensure its bundle icon list includes `icons/icon.ico`, `icons/32x32.png`, `icons/128x128.png` and `icons/128x128@2x.png` as appropriate for the current Tauri version.
3. The current tray code loads `app/src-tauri/icons/tray/tray-idle.png` and `tray-downloading.png` on non-macOS, and the matching `*-template.png` files on macOS.
4. Extension icon filenames in this package are size-based. Update the extension manifest/build configuration to point to the corresponding files if its current naming differs.
5. The supplied logo has a light rounded-square background. Tray variants are simplified small glyphs for legibility at 16–64 px.

The package does not modify source code or commit anything to GitHub.
