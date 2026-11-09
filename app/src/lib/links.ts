// External links opened in the user's browser.

import { inTauri } from "./api";

/** This fork's source repository. */
export const REPO_URL = "https://github.com/taolaohht/download-manager";

export async function openUrl(url: string) {
  if (inTauri) {
    const opener = await import("@tauri-apps/plugin-opener");
    await opener.openUrl(url);
  } else {
    window.open(url, "_blank", "noopener");
  }
}
