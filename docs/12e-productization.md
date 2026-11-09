# 12e downloader productization status

This fork is being branded as **12e downloader** by 12ecember while retaining the upstream Rust download engine, browser bridge, yt-dlp/video pipeline, and torrent implementation.

## Landed foundation

- Product/window metadata, HTML title, tray labels, and app mark use 12e downloader branding.
- Localization currently exposes English (United States) only; unsupported system locales fall back to English.
- A dedicated 12e violet accent override is loaded after the shared design tokens.
- Windows portable archive naming/readme use 12e downloader and keep app data beside the executable.
- The executable/native host protocol identifiers remain compatible for this transition. Do not rename those until the extension, host registration, installer hooks, and data migration are changed together.
- Updater metadata points to this repository, but must not be used for releases until a 12ecember-controlled signing key and release pipeline are configured.

## Remaining product work

- Remove scheduler, site grabber, AI/Hugging Face, media conversion/tools, and antivirus from UI, Tauri commands, Rust core, dependencies, and window routes only after checking shared code and tests.
- Set opt-in startup behavior in persisted Rust defaults and shell startup path; preserve existing user preferences.
- Replace remaining Prism references in visible UI, extension, native-host protocol, docs, assets, and packaging; update icons and extension distribution details.
- Implement queue concurrency as unlimited by default with an optional global cap of 1 or 2, and preserve queue/item recovery after abrupt close.
- Verify language selection and backup/restore behavior, then run frontend/Rust tests, security/license checks, and Windows 10/11 portable smoke tests.

Do not remove shared download-engine, video, torrent, or native-messaging code while pruning unrelated modules. Code search currently returns a limited page of matches; use the repository code search UI to inspect the full result set: https://github.com/taolaohht/download-manager/search?q=Prism&type=code
