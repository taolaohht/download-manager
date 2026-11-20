// User-level actions shared by the toolbar, context menu, keyboard shortcuts and dialogs.

import { api } from "./api";
import { t } from "./i18n";
import { canPause, canResume, isTorrentLink } from "./present";
import { hexEncode } from "./route";
import { useApp } from "./store";
import type { Settings, Status } from "./types";
import { attempt, toast, useUi } from "./ui";
import { copyText } from "./win";

const items = (ids: string[]) => ids.map((id) => useApp.getState().items[id]).filter(Boolean);

/** Resolve the live core status before enabling bulk actions; progress events can be newer
 * than the last persisted item snapshot. */
export function actionableIds(
  ids: string[],
  statuses: Record<string, Status | undefined>,
  action: "pause" | "resume",
): string[] {
  return ids.filter((id) => {
    const status = statuses[id];
    return status !== undefined && (action === "pause" ? canPause(status) : canResume(status) || status === "queued");
  });
}

/** Keep unrelated selections and preserve the selection when the backend rejects deletion. */
export async function deleteAndPreserveSelection(
  ids: string[],
  remove: () => Promise<void>,
  getSelection: () => string[],
  select: (ids: string[]) => void,
  onError: (error: unknown) => void,
): Promise<void> {
  try {
    await remove();
    const deleted = new Set(ids);
    select(getSelection().filter((id) => !deleted.has(id)));
  } catch (error) {
    onError(error);
  }
}

function currentStatuses(ids: string[]): Record<string, Status | undefined> {
  const st = useApp.getState();
  return Object.fromEntries(ids.map((id) => [id, st.progress[id]?.status ?? st.items[id]?.status]));
}

export const actions = {
  resume: (ids: string[]) => {
    const go = actionableIds(ids, currentStatuses(ids), "resume");
    if (go.length) void attempt(api.startItems(go), t("Could not resume"));
  },
  pause: (ids: string[]) => {
    const stop = actionableIds(ids, currentStatuses(ids), "pause");
    if (stop.length) void attempt(api.pauseItems(stop), t("Could not pause"));
  },
  toggle: (ids: string[]) => {
    const statuses = currentStatuses(ids);
    if (actionableIds(ids, statuses, "pause").length) actions.pause(ids);
    else actions.resume(ids);
  },
  pauseAll: () => void attempt(api.pauseAll(), t("Could not stop downloads")),

  /** Delete honoring settings.general.confirmDelete; items in trash are deleted permanently. */
  requestDelete: (ids: string[], withFiles = false) => {
    if (!ids.length) return;
    const st = useApp.getState();
    const inTrash = st.view.kind === "trash";
    if (st.settings?.general.confirmDelete || withFiles || inTrash) {
      useUi.getState().openDialog({ kind: "delete", ids, trash: inTrash, withFiles });
      return;
    }
    void actions.delete(ids, false, !(st.settings?.general.useTrash ?? true));
  },
  delete: (ids: string[], deleteFiles: boolean, permanent: boolean) =>
    deleteAndPreserveSelection(
      ids,
      () => api.deleteItems(ids, deleteFiles, permanent),
      () => useApp.getState().selection,
      (selection) => useApp.getState().select(selection),
      (error) => toast(t("Could not delete"), { kind: "error", body: error instanceof Error ? error.message : String(error) }),
    ),
  restore: async (ids: string[]) => {
    const unfinished = items(ids).filter((i) => i.status !== "completed").length;
    try {
      await api.restoreItems(ids);
    } catch (e) {
      toast(t("Could not restore"), { kind: "error", body: e instanceof Error ? e.message : String(e) });
      return;
    }
    toast(ids.length > 1 ? t("{count} downloads restored", { count: ids.length }) : t("Download restored"), {
      kind: "success",
      body: unfinished ? t("Press Resume to continue where it stopped.") : undefined,
      ms: 3500,
    });
  },

  open: (id: string) => void attempt(api.openItem(id), t("Could not open the file")),
  reveal: (id: string) => void attempt(api.revealItem(id), t("Could not open the folder")),
  details: (id: string) => void attempt(api.openDetails(id), t("Could not open details")),
  redownload: (id: string) => void attempt(api.redownload(id), t("Could not restart the download")),
  copyLinks: async (ids: string[]) => {
    const urls = items(ids).map((i) => i.url);
    if (await copyText(urls.join("\n"))) toast(urls.length > 1 ? t("{count} links copied", { count: urls.length }) : t("Link copied"), { kind: "success", ms: 2200 });
  },
  moveToQueue: (ids: string[], queueId: string | null) => void attempt(api.assignToQueue(ids, queueId), t("Could not move to queue")),
  moveInQueue: (ids: string[], delta: number) => void attempt(api.moveInQueue(ids, delta), t("Could not reorder")),

  /** Primary activation: open finished files, show details for everything else. */
  activate: (id: string) => {
    const it = useApp.getState().items[id];
    if (!it) return;
    if ((useApp.getState().progress[id]?.status ?? it.status) === "completed") actions.open(id);
    else actions.details(id);
  },

  addUrl: async (url: string) => {
    if (isTorrentLink(url)) {
      await attempt(api.openWindow("torrent", hexEncode(url.trim())), t("Could not open the torrent"));
      return true;
    }
    return (await attempt(api.addUrl({ url }), t("Could not add the address"))) !== undefined;
  },
  openAddUrl: () => void attempt(api.openWindow("addurl"), t("Could not open Add URL")),
  toggleLimiter: async () => {
    const on = await attempt(api.toggleSpeedLimiter(), t("Could not toggle the speed limiter"));
    if (on !== undefined) toast(on ? t("Speed limiter on") : t("Speed limiter off"), { ms: 1800 });
  },
  toggleMini: () => void attempt(api.toggleMini(), t("Could not open the mini window")),
};

/** Patch settings and apply the result locally (the core also broadcasts settingsChanged). */
export async function patchSettings(patch: DeepPartial<Settings>) {
  const s = await attempt(api.updateSettings(patch), t("Could not save settings"));
  if (s) useApp.getState().applySettings(s);
  return s;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K] };
