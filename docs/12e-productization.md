# 12e downloader productization status

This fork is being branded as **12e downloader** by 12ecember while retaining the upstream Rust download engine, browser bridge, yt-dlp/video pipeline, and torrent implementation.

## Foundation changes

- Product/window metadata and HTML document title use 12e downloader.
- The in-app mark is a simple download symbol rather than the upstream Prism mark.
- The localization API currently exposes only English (United States); unsupported system locales fall back to en-US.
- Release update metadata points at this repository rather than the upstream project's releases. A release must be signed with a 12ecember-controlled updater key before enabling distribution updates; the inherited public key does not establish that trust chain.

## Remaining work before claiming the full product requirements

- Remove unsupported feature families end-to-end (scheduler, site grabber, AI/Hugging Face, media conversion/tools, and antivirus), after checking shared code and dependencies.
- Replace remaining Prism references in visible UI, tray, native-host protocol, extension copy, and packaging; update binary/sidecar identifiers in a coordinated migration.
- Set and test the queue concurrency defaults and limits, including crash/restart recovery for regular and torrent downloads.
- Implement portable data-root behavior and configuration backup/restore, and verify autostart remains opt-in.
- Rebuild branded application and browser extension icons, then run frontend/Rust tests, security/license checks, and Windows 10/11 portable smoke tests.

Do not remove the shared video, torrent, download-engine, or native-messaging components while pruning unrelated modules.
