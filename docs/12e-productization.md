# 12e downloader completion tracker

Working branch: `12e-downloader/productization-foundation`.

## Landed
- Product title/metadata, custom download mark, tray labels, English (US) locale scaffolding, and Windows portable archive naming/readme updated in prior commits.
- Added a dedicated 12e violet accent override and localization checks.
- In-app source link now points at `taolaohht/download-manager` rather than the upstream project.
- Core foundation already provides HTTP downloads, resume/checkpoints, queues, browser integration, yt-dlp/video, torrent/magnet, and settings/list JSON backup.

## Remaining before calling this complete
- Remove scheduler UI/API/backend, site grabber, AI/Hugging Face, media conversion/tools, and antivirus with a dependency/reference audit. Keep ffmpeg paths required by video downloading and ZIP inspection.
- Change queue admission/defaults to unlimited by default and optional limits 1 or 2, and test regular plus torrent recovery after abrupt exit.
- Make first-run autostart default off without overriding existing saved user preferences.
- Finish visible branding cleanup in every window, settings string, app/window metadata, extension, icons, docs, and packaging. Keep native messaging identifiers compatible until a coordinated extension/host migration exists.
- Validate Tauri configuration and updater trust. Do not publish updates until using a 12ecember-owned signing key.
- Run app TypeScript tests/build, Rust workspace tests, extension tests/build, and Windows 10/11 portable smoke tests.

Lexical code search has a capped result set, so this audit can miss matches; inspect the full repository search here: https://github.com/taolaohht/download-manager/search?q=Prism&type=code
