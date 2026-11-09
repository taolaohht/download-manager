# Prism 1.2.4 — One beam. Many rays.

A fast, open-source download manager with browser integration and video downloads.

> **Current distribution:** This repository publishes Prism only as a **Windows 10/11 x64 portable ZIP**. Linux and macOS desktop builds are no longer produced or supported here. Older release notes below are historical.

## What's new in 1.2.4

* **Linux: Prism's window no longer stops updating when a download finishes**
  ([#41](https://github.com/FortoGraphy/prism-download-manager/issues/41)). Right when a download
  finished or failed, or a queue ended, the window could freeze until it was opened again. Those
  are the moments Prism plays a sound, which WebKitGTK played inside every open window. On Linux
  the sounds now play once, through the system's own player (PipeWire, PulseAudio or ALSA).
* **No more full disks when putting a video together**
  ([#49](https://github.com/FortoGraphy/prism-download-manager/issues/49)). Joining a video's
  picture and sound needs about as much free space again as the downloaded streams. Prism now
  checks before it starts and says how much is needed, instead of filling the disk. The
  downloaded streams stay, so *Retry* after making room only puts them together.
* **A system ffmpeg that doesn't run is replaced**
  ([#45](https://github.com/FortoGraphy/prism-download-manager/issues/45)). When the ffmpeg on
  your system is missing or doesn't start, Prism downloads its own before a video download, so
  the video doesn't stop at the end with "ffmpeg not found".
* The bottom corners of the download list are rounded like the rest of the window
  ([#47](https://github.com/FortoGraphy/prism-download-manager/issues/47)). Thanks to Eerye!

## What's new in 1.2.3

* **Simplified Chinese** ([#42](https://github.com/FortoGraphy/prism-download-manager/issues/42)).
  Prism now speaks 简体中文: it follows your system's language, or pick it in Settings › General ›
  Language. Thanks to jtyking for asking!
* **AI models in Tools.** The Hugging Face downloader is now also in the sidebar's *Tools*, next
  to *Convert* and *Make smaller*.
* **Prism's window on Linux**
  ([#36](https://github.com/FortoGraphy/prism-download-manager/issues/36),
  [#41](https://github.com/FortoGraphy/prism-download-manager/issues/41),
  [#44](https://github.com/FortoGraphy/prism-download-manager/issues/44)): since 1.1.8 the window
  could stay empty (KDE Plasma with Intel graphics, Hyprland with AMD, also under XWayland), be
  drawn only in parts, or stop updating, so a finished download still showed as downloading until
  the window was opened again. Prism no longer chooses WebKit's renderer: WebKitGTK picks it, as
  in 1.1.7. `WEBKIT_DISABLE_DMABUF_RENDERER` set by you still applies. Thanks to sxdot,
  Reno-Sifana, nckrkllkc and HaixueNiyi for the screenshots, videos and the A/B test!
* **A queue with nothing to download no longer runs its finishing action**
  ([#41](https://github.com/FortoGraphy/prism-download-manager/issues/41)). *Run now* on an empty
  queue put the computer to sleep (or shut it down) right away; now it only says that the queue
  has nothing left to download.
* **Videos with an old yt-dlp on Linux**
  ([#43](https://github.com/FortoGraphy/prism-download-manager/issues/43)). With a
  distribution's yt-dlp installed, every video stopped with "no such option: --js-runtimes".
  Prism now downloads its own current yt-dlp in that case (YouTube needs it), and without a
  connection leaves that option out so other sites still work.

## What's new in 1.2.2

* **Parts of videos download much faster.** *Only a part* had ffmpeg fetch the part over a single
  connection, which YouTube slows down. Prism now reads the index at the start of the video,
  downloads only the pieces around the part over several connections, and cuts it out on the
  exact frame. A minute of 1080p60 takes about 10 seconds instead of 25–30, and the difference
  grows with 4K and slower connections. A video without such an index (some sites) is cut the
  way it was before.
* **Updating on Windows no longer stops with an error.** With a browser open, the update could
  fail to replace the browser helper (`prism-native-host.exe`), which the browser starts again
  right after the installer stops it, and showed *Error opening file for writing*. The installer
  now moves the running helper aside and puts the new one in its place; the old copy is removed
  with the next update.
* Starting a queue could, rarely, mark it finished at once and leave its downloads waiting in a
  stopped queue.

## What's new in 1.2.1

* **The Download button next to a video opens the Download video window.** A quality picked in
  the browser's menu (or with right-click › Download with Prism on a video) now opens Prism's
  *Download video* window with that quality picked, so *Only a part*, the folder and the other
  options are there too. Before, it went to the plain *Download file* window. The window uses the
  browser tab's session, so age-restricted and members' videos work as before. With *Show the
  Download File dialog* off, the download still starts right away.

## What's new in 1.2.0

* **Convert and make smaller.** A new *Tools* section in the sidebar, *Convert to* and *Make
  smaller* in a finished download's menu, and two buttons in the *Download complete* window.
  * **Convert** pictures (also iPhone HEIC photos), music and videos to common formats.
  * **Make smaller** pictures, music and videos to fit common sharing limits.
  * The new file is saved next to the original, which stays as it is.
* **Just a part of a video.** In the *Download video* window, choose *Only a part* and pick the
  start and end with the two handles or by typing the times, or click a chapter.
* **What's inside a ZIP.** The *Download file* window shows the folders and files in a ZIP before
  you download it.
* **Finished downloads show as finished**
  ([#41](https://github.com/FortoGraphy/prism-download-manager/issues/41)): a download that
  finished while the window was open could still look like it was downloading until the window was
  opened again. Thanks to nckrkllkc for the report!
* The sidebar fades out at its bottom edge when there's more below (Grabber, Trash).
* Cancelling a download and deleting its file is quicker: Prism no longer writes the file to disk
  first.
* The Chrome Web Store extension (1.1.0) keeps working as it is; nothing to update there.

## Downloads

Download the **Windows 10/11 x64 portable ZIP** from the
[latest release](https://github.com/taolaohht/download-manager/releases/latest).

1. Extract the ZIP to any folder.
2. Run `prism.exe`.
3. Keep the `data` folder beside the executable when updating to preserve settings and history.

No installer or administrator permission is required. This is the only supported desktop build in this repository.

Browser extension: [Chrome Web Store](https://chromewebstore.google.com/detail/prism-download-manager/mmcdeiglkbfbicdjboocmhehodogilfl) for Chromium browsers; the ZIP also includes unpacked Chromium and Firefox builds for manual installation.

## What's inside

* **Multi-connection engine** written in Rust: up to 32 connections per file, dynamic
  segmentation (a freed connection splits the largest remaining range), automatic
  detection of server connection limits, writes straight into the final file.
* **Resume that survives crashes**: pause, quit, lose power — Prism continues where it
  stopped and validates the file against the server.
* **Browser integration**: click a download link and Prism takes over. A *Download video*
  button over video players, a popup listing every stream on the page, right-click menus.
* **Video and audio**: YouTube and every site yt-dlp supports. Choose **MP4 + quality** (up
  to 8K/HDR) or **MP3 only**. Subtitles, chapters, thumbnails, SponsorBlock.
* **More protocols**: FTP/FTPS, HLS and DASH streams, BitTorrent and magnet links.
* **Organisation**: categories, queues with schedules and speed limits, actions when a
  queue finishes (sleep, shut down…), site grabber, batch downloads, clipboard monitor.
* **AI models from Hugging Face**: by name, link or search, the right files picked for you,
  checked by SHA-256.
* **Liquid-glass UI** with dark and light themes, six accent colours and a mini window.

## Known limitations

* Firefox: Prism isn't in Firefox Add-ons yet. Its extension is loaded by hand, and Firefox
  keeps unsigned add-ons only until restart, except in Developer Edition / Nightly / ESR.

Found a bug? [Open an issue](https://github.com/taolaohht/download-manager/issues/new/choose).
Like Prism? A ⭐ helps a lot.
