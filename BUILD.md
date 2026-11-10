# Building Prism (Windows x64 portable)

Prism is released as a **Windows 10/11 x64 portable application only**. The release ZIP contains
`prism.exe`, the native messaging host, browser extensions, and a `data` folder created on
first launch. No installer is generated.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Rust | stable ≥ 1.88 | Install with rustup |
| Node.js | 24 LTS | Builds the UI and browser extensions |
| Windows | Windows 10/11 x64 | Visual Studio 2022 Build Tools with Desktop development with C++ and Windows SDK |
| Optional | `ffmpeg.exe` on PATH | Otherwise Prism downloads a verified build on first video download |

## Setup

```powershell
git clone <repo> prism
cd prism
npm ci --prefix app
npm ci --prefix extension
```

## Development and tests

```powershell
cargo test --workspace --exclude prism-app
cargo clippy --workspace --all-targets -- -D warnings
npm run build --prefix extension
npm test --prefix app
npm run typecheck --prefix app
npm test --prefix extension
npm run typecheck --prefix extension
npm run e2e --prefix extension
```

## Build the portable release

```powershell
npm ci --prefix app
npm ci --prefix extension
npm run build --prefix extension
node scripts/build-sidecar.mjs --target x86_64-pc-windows-msvc
cd app
npx tauri build --target x86_64-pc-windows-msvc --no-bundle
cd ..
./scripts/make-portable.ps1 -Target x86_64-pc-windows-msvc
```

The ZIP is written to `packaging/out/Prism-<version>-windows-x64-portable.zip`. It runs without
an installer and stores settings, history, and download state in its own `data` folder.

## Continuous integration

GitHub Actions runs the Rust, frontend, extension, and Chromium end-to-end checks on Windows.
Release tags produce only the signed Windows x64 portable ZIP (plus its signature, update
manifest, and checksum).

## Browser extension

The portable ZIP includes Chromium-based and Firefox extension builds. Load the appropriate
unpacked extension in the browser's extension management page and enable developer mode.
