<p align="center">
  <img src="assets/brand/png/app-icon-256.png" width="120" alt="Prism">
</p>

<h1 align="center">Prism</h1>

<p align="center">
  <b>One beam. Many rays.</b><br>
  The fast, beautiful, open-source **Windows x64 portable** download manager.
</p>

<p align="center">
  <a href="https://github.com/taolaohht/download-manager/releases/latest"><b>⬇ Download portable ZIP</b></a> ·
  <a href="https://prismdl.site/"><b>Website</b></a> ·
  <a href="https://youtu.be/IkZu0XN2lLQ"><b>▶ Watch the film</b></a> ·
  <a href="docs/guide/installation.md">Install guide</a> ·
  <a href="docs/guide/browser-extension.md">Browser extension</a>
</p>

---

Prism splits every download into up to **32 parallel connections**, keeps them all busy until
the last byte, and survives crashes, sleep and pulled cables. Click a link in your browser and
Prism takes over; hover a video and grab it as **MP4 in the quality you want — or just the MP3**.
All of it in a calm, liquid-glass interface with dark and light themes.

Free, open source, no ads, no accounts, no telemetry.

## ✨ Why Prism

| | |
|---|---|
| ⚡ **Up to 15× faster** | On servers that throttle each connection, Prism's multi-connection engine is up to 15× faster than a normal browser download ([benchmarks](docs/benchmarks.md)). |
| 🔁 **Never start over** | Pause, close the laptop, lose power — Prism resumes exactly where it stopped and checks that the file on the server hasn't changed. |
| 🌐 **Lives in your browser** | Chrome, Edge, Brave, Opera, Vivaldi and Firefox. Downloads jump into Prism in about a quarter of a second. |
| 🎬 **Video & music** | YouTube and [1,800+ sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md): MP4 up to 8K/HDR or MP3 only, with subtitles, chapters and SponsorBlock. |
| 🧲 **Every protocol** | HTTP(S), FTP/FTPS, HLS and DASH streams, BitTorrent and magnet links. |
| 🤖 **AI models** | Download models from [Hugging Face](https://huggingface.co) by name, link or search. |
| 🗂 **Organised** | Categories, queues with schedules and speed limits, "shut down when done", site grabber, batch downloads, clipboard monitor. |
| 🌍 **Your language** | English, Czech, German, Spanish, French, Italian, Indonesian, Turkish, Simplified Chinese and Arabic. |
| 🎨 **Gorgeous** | Liquid-glass design, dark & light themes, six accent colours, a mini window — and fast with thousands of downloads. |

## ⬇ Download

Download the **Windows 10/11 x64 portable ZIP** from the
[latest release](https://github.com/taolaohht/download-manager/releases/latest).

1. Extract the ZIP anywhere — a normal folder or USB drive.
2. Run `prism.exe`.
3. Prism keeps settings, history, and its data in the `data` folder beside the executable.

No installer or administrator permission is required. The portable build is the only supported
desktop release.

## 🌐 Browser extension

**[Add Prism from the Chrome Web Store](https://chromewebstore.google.com/detail/prism-download-manager/mmcdeiglkbfbicdjboocmhehodogilfl)**
— Chrome, Edge, Brave, Opera, Vivaldi and other Chromium browsers. The portable ZIP also
contains the unpacked Chromium and Firefox extension builds for manual installation.

Prism walks you through browser integration on first start and from **Settings → Browser
integration**. See the [browser extension guide](docs/guide/browser-extension.md).

## 📸 Screenshots

| | |
|---|---|
| ![Download File dialog](docs/screenshots/download-file-dialog.png) | ![Video: MP4 or MP3](docs/screenshots/video-dialog.png) |
| **Click a link** — Prism asks where to save it | **Grab a video** — MP4 + quality, or MP3 only |
| ![Scheduler](docs/screenshots/scheduler.png) | ![Browser integration](docs/screenshots/settings-browser-integration.png) |
| **Queues & scheduler** — download at night, then sleep | **Browser integration** — status and one-click repair |
| ![Download complete](docs/screenshots/complete-dialog.png) | ![Mini window](docs/screenshots/mini-window.png) |
| **Done** — open, show in folder, verify | **Mini window** — stays out of your way |

## 📊 Benchmarks

Same files, same machine, every result verified by SHA-256
([method & full results](docs/benchmarks.md)):

| Scenario | curl (1 connection) | aria2c | **Prism** |
|---|---|---|---|
| 1 GiB from a server that throttles each connection | 4.0 MiB/s | 61.0 MiB/s | **60.9 MiB/s** |
| 2 GiB, no network limit | 672 MiB/s | 324 MiB/s | **1029 MiB/s** |
| Server allows only 4 connections | 2.0 MiB/s | 8.0 MiB/s | **8.0 MiB/s** (max) |
| Server that randomly drops connections | — | ✘ gave up | **37.7 MiB/s** ✔ |
| Real internet, ≈ 200 Mbit/s line | 25.9 MiB/s | 25.2 MiB/s | **25.1 MiB/s** (line speed) |

## 🧠 How it works

* **Dynamic segmentation.** When a connection finishes its part, it takes over half of the
  largest part still remaining — so every connection stays busy until the very end.
* **Server-aware.** Prism notices when a server refuses extra connections, settles on what it
  allows and remembers it per host.
* **Crash-safe.** Progress is checkpointed only after data is flushed to disk; on resume Prism
  validates size, ETag and Last-Modified with `If-Range`.
* **Rust + Tauri.** A Rust engine and React UI in a native Windows Tauri 2 shell.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the internals.

## 🛠 Build from source

See [BUILD.md](BUILD.md) for Windows x64 portable build prerequisites and commands.

```text
crates/prism-engine       download engine: segmented HTTP/FTP, HLS/DASH, resume, speed limiter
crates/prism-core         app logic: manager, SQLite, queues, scheduler, grabber, browser IPC
crates/prism-video        yt-dlp / ffmpeg management, quality choices, muxing
crates/prism-torrent      BitTorrent / magnet
crates/prism-native-host  browser ↔ app bridge (native messaging) and browser registration
app/                      React UI + Tauri 2 shell
extension/                MV3 extension (Chromium + Firefox)
site/                     prismdl.site
```

## ❓ FAQ

<details><summary><b>Is it really free?</b></summary>

Yes. MIT-licensed, no ads, no trial, no account, no telemetry. The extension talks only to
the app on your own computer.
</details>

<details><summary><b>Can I use it together with IDM or another download manager?</b></summary>

Yes, but disable their browser extension — two extensions fighting over the same download
means neither works reliably.
</details>

<details><summary><b>Which sites can it download video from?</b></summary>

Every site supported by [yt-dlp](https://github.com/yt-dlp/yt-dlp), which Prism installs and
keeps up to date for you (together with ffmpeg). Please download only content you have the
right to download.
</details>

<details><summary><b>How do I download a model from Hugging Face?</b></summary>

Click the model button in the toolbar (or paste a model's name or link into *Add URL*). Pick a
version if the model has several, and click *Download*: the files go into the *Hugging Face*
queue. For gated or private models, add an access token in Settings → AI models.
</details>

## 🤝 Contributing

Bug reports, ideas and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

[MIT](LICENSE) for Prism's own code. Bundled and downloaded components keep their own licenses —
see [THIRD_PARTY.md](THIRD_PARTY.md).
