// Web links: opened in the user's browser (a new tab in the browser preview).

import { inTauri } from "./api";

/** 12e Downloader source repository. */
export const REPO_URL = "https://github.com/taolaohht/download-manager";

export async function openUrl(url: string) {
  if (inTauri) {
    const opener = await import("@tauri-apps/plugin-opener");
    await opener.openUrl(url);
  } else {
    window.open(url, "_blank", "noopener");
  }
}
