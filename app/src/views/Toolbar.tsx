import { Icon } from "../design/icons";
import { actions } from "../lib/actions";
import { api } from "../lib/api";
import { t } from "../lib/i18n";
import { canPause, canResume } from "../lib/present";
import { useApp } from "../lib/store";
import { attempt, useUi } from "../lib/ui";

export function Toolbar() {
  const selection = useApp((s) => s.selection);
  const allItems = useApp((s) => Object.values(s.items).filter((i) => !i.trashed));
  const progress = useApp((s) => s.progress);
  const anyResumable = allItems.some((i) => canResume(progress[i.id]?.status ?? i.status) || (progress[i.id]?.status ?? i.status) === "queued");
  const anyPausable = allItems.some((i) => canPause(progress[i.id]?.status ?? i.status));
  const queue = useApp((s) => s.queues.find((q) => q.id === "main") ?? s.queues[0]);
  return (
    <div className="actionbar" role="toolbar" aria-label={t("Download actions")}>
      <button type="button" className="btn action-btn action-btn--add" onClick={actions.openAddUrl}><Icon name="plus" size={19} />{t("Add Download")}</button>
      <button type="button" className="btn action-btn action-btn--start" disabled={!anyResumable} onClick={() => void attempt(api.resumeAll(), t("Could not resume downloads"))}><Icon name="resume" size={19} />{t("Resume All")}</button>
      <button type="button" className="btn action-btn action-btn--pause" disabled={!anyPausable} onClick={actions.pauseAll}><Icon name="pause" size={19} />{t("Pause All")}</button>
      <button type="button" className="btn action-btn action-btn--delete" disabled={!selection.length} onClick={() => actions.requestDelete(selection)}><Icon name="delete" size={18} />{t("Remove Selected")}</button>
      <span className="actionbar__sep" />
      <button type="button" className="btn action-btn" onClick={() => useUi.getState().openSheet({ kind: "scheduler", queueId: queue?.id })}><Icon name="scheduler" size={18} />{t("Scheduler")}</button>
      <button type="button" className="btn action-btn" onClick={() => useUi.getState().openSheet({ kind: "settings" })}><Icon name="options" size={18} />{t("Settings")}</button>
    </div>
  );
}
