import { Icon } from "../design/icons";
import { actions } from "../lib/actions";
import { api } from "../lib/api";
import { t } from "../lib/i18n";
import { canPause, canResume } from "../lib/present";
import { useApp } from "../lib/store";
import { attempt, useUi } from "../lib/ui";

export function Toolbar() {
  const selection = useApp((s) => s.selection);
  const selected = useApp((s) => s.selection.map((id) => s.items[id]).filter(Boolean));
  const hasFinished = useApp((s) => Object.values(s.items).some((i) => i.status === "completed" && !i.trashed));
  const anyResumable = selected.some((i) => canResume(i.status) || i.status === "queued");
  const anyPausable = selected.some((i) => canPause(i.status));
  const queue = useApp((s) => s.queues.find((q) => q.id === "main") ?? s.queues[0]);
  return (
    <div className="actionbar" role="toolbar" aria-label={t("Download actions")}>
      <button type="button" className="btn action-btn action-btn--add" onClick={actions.openAddUrl}><Icon name="plus" size={19} />{t("Add URL")}</button>
      <button type="button" className="btn action-btn action-btn--start" disabled={!anyResumable} onClick={() => actions.resume(selection)}><Icon name="resume" size={19} />{t("Start")}</button>
      <button type="button" className="btn action-btn action-btn--pause" disabled={!anyPausable} onClick={() => actions.pause(selection)}><Icon name="pause" size={19} />{t("Pause")}</button>
      <button type="button" className="btn action-btn action-btn--delete" disabled={!selection.length} onClick={() => actions.requestDelete(selection)}><Icon name="delete" size={18} />{t("Delete")}</button>
      <button type="button" className="btn action-btn" disabled={!hasFinished} onClick={() => void attempt(api.removeCompleted(), t("Could not remove completed downloads"))}><Icon name="delete-completed" size={18} />{t("Delete All")}</button>
      <span className="actionbar__sep" />
      <button type="button" className="btn action-btn" onClick={() => useUi.getState().openSheet({ kind: "scheduler", queueId: queue?.id })}><Icon name="scheduler" size={18} />{t("Scheduler")}</button>
      <button type="button" className="btn action-btn" onClick={() => useUi.getState().openSheet({ kind: "settings" })}><Icon name="options" size={18} />{t("Settings")}</button>
    </div>
  );
}
