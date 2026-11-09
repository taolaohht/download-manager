12e downloader — portable edition
===================================

1. Run prism.exe. Settings, download history, and managed tools are kept in the
   `data` folder next to the executable, so the complete folder can live on a USB drive.
2. Browser integration registers the native messaging host for the current Windows
   user (no administrator permission is required). Install the matching extension:
   Chrome / Edge / Brave / Opera / Vivaldi: use the extension distribution supplied by 12ecember.
   Firefox: about:debugging -> This Firefox -> Load Temporary Add-on ->
   extension\firefox\manifest.json
3. Settings -> Browser integration shows connection state and offers a repair action.

Requires the Microsoft Edge WebView2 runtime (preinstalled on Windows 10/11).
Autostart is opt-in. The app does not require installation or administrator privileges.
