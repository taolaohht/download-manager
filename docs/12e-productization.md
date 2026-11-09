# 12e downloader productization status

This fork is being branded as **12e downloader** by 12ecember while retaining the upstream Rust download engine, browser bridge, yt-dlp/video pipeline, torrent implementation, and working Windows portable-data marker.

## Landed foundation

- Product/window metadata, HTML title, tray labels, and app mark use 12e downloader branding.
- Localization currently exposes English (United States) only; unsupported system locales fall back to English.
- Windows portable archive naming/readme now use 12e downloader and keep app data beside the executable.
- The executable/native host protocol identifiers remain compatible for this transition. Do not rename those until the extension, host registration, installer hooks, and migration paths are changed together.
- Updater metadata points to this repository, but it must not be used for releases until a 12ecember-controlled signing key and release pipeline are configured.

## Remaining product work

- Remove scheduler, site grabber, AI/Hugging Face, media conversion/tools, and antivirus from UI, Tauri commands, Rust core, dependencies, and window routes only after checking shared code and tests.
- Set opt-in startup behavior in the persisted Rust default settings and shell startup path; existing user preferences must remain respected.
- Finish the 12e accent theme and replace Prism references from all visible UI, extension, tray icons, app icons, docs, and remaining packaging text.
- Verify language selection remains persisted; with the current one-language release, settings should present English (United States) and system fallback only.
- Test queue concurrency rules, abrupt-close recovery, torrent resume, browser capture fail-open behavior, backup/restore, and portable data on Windows 10/11.
- Run frontend/Rust tests, dependency/security/license checks, and portable smoke tests before release.

Do not remove shared download-engine, video, torrent, or native-messaging code while pruning unrelated modules.
