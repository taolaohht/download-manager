# Building Prism (Windows x64 portable)

Prism is maintained and released as a **Windows x64 portable application**. The supported release artifact is a ZIP containing `prism.exe`, the native messaging host, browser extensions, and a `data` directory created on first launch.

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
npm run build --prefix app
npm run build --prefix extension
npm test --prefix app
npm run typecheck --prefix app
npm test --prefix extension
npm run typecheck --prefix extension
npm run e2e --prefix extension
```

## Build the portable release

```powershell
npm run build --prefix extension
node scripts/build-sidecar.mjs --target x86_64-pc-windows-msvc
cd app
npx tauri build --target x86_64-pc-windows-msvc --bundles nsis
cd ..
./scripts/make-portable.ps1 -Target x86_64-pc-windows-msvc
```

The ZIP is written to `packaging/out/Prism-<version>-windows-x64-portable.zip`. It runs without an installer and stores settings, history, and downloads state in its own `data` folder.

## Continuous integration

GitHub Actions runs the Rust, frontend, extension, and Chromium end-to-end checks on Windows. Release tags produce only the Windows x64 portable ZIP.

## Browser extension

The portable ZIP includes Chromium-based and Firefox extension builds. Load the appropriate unpacked extension in the browser's extension management page and enable developer mode.
