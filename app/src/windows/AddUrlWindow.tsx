import { useEffect, useState } from "react";
import { TextField } from "../components/Controls";
import { LogoMark } from "../components/LogoMark";
import { WindowFrame } from "../components/WindowFrame";
import { Icon } from "../design/icons";
import { api } from "../lib/api";
import { t } from "../lib/i18n";
import { isTorrentLink, looksLikeUrl } from "../lib/present";
import { hexEncode } from "../lib/route";
import { readClipboardText, win } from "../lib/win";

type Source = "url" | "video" | "torrent";

export default function AddUrlWindow() {
  const [source, setSource] = useState<Source>("url");
  const [url, setUrl] = useState("");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void readClipboardText().then((text) => {
      const v = text.trim();
      if (looksLikeUrl(v)) {
        setUrl((cur) => cur || v);
        if (isTorrentLink(v)) setSource("torrent");
      }
    });
  }, []);

  const trimmed = url.trim();
  const model = /^(datasets\\/)?[A-Za-z0-9][\\w-]*\\/[\\w.-]+$/.test(trimmed);
  const torrent = isTorrentLink(trimmed);
  const valid = source === "torrent" ? torrent || /^https?:\\/\\//i.test(trimmed) : source === "video" ? /^https?:\\/\\//i.test(trimmed) : model || looksLikeUrl(trimmed) || /^ftps?:\\/\\//i.test(trimmed);

  const choose = (next: Source) => {
    setSource(next);
    setError("");
  };

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      if (source === "video") {
        const capture = await api.openVideoUrl(trimmed);
        await api.openWindow("video", capture.id);
      } else if (source === "torrent" || torrent) {
        await api.openWindow("torrent", hexEncode(trimmed));
      } else if (model) {
        await api.openWindow("model", hexEncode(trimmed));
      } else {
        await api.addUrl({ url: trimmed, username: auth ? user : undefined, password: auth ? pass : undefined });
      }
      await win.close();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <WindowFrame kind="addurl" title={t("Add Download")} icon={<LogoMark size={18} glass="indigo" />} className="addurl">
      <div className="wbody add-download">
        <div className="field">
          <span className="field__label">{t("Source")}</span>
          <div className="add-download__sources" role="tablist" aria-label={t("Source")}>
            <button type="button" role="tab" aria-selected={source === "url"} className={source === "url" ? "is-active" : ""} onClick={() => choose("url")}><Icon name="link" size={15} />{t("URL")}</button>
            <button type="button" role="tab" aria-selected={source === "video"} className={source === "video" ? "is-active" : ""} onClick={() => choose("video")}><Icon name="video" size={15} />{t("Video (yt-dlp)")}</button>
            <button type="button" role="tab" aria-selected={source === "torrent"} className={source === "torrent" ? "is-active" : ""} onClick={() => choose("torrent")}><Icon name="magnet" size={15} />{t("Torrent (Magnet)")}</button>
          </div>
        </div>
        <div className="field">
          <span className="field__label">{t("Address")}</span>
          <TextField
            value={url}
            onChange={(v) => { setUrl(v); setError(""); }}
            label={t("Download address")}
            icon={source === "torrent" ? "magnet" : source === "video" ? "video" : "link"}
            mono
            autoFocus
            placeholder={source === "torrent" ? "magnet:?xt=urn:btih:…" : source === "video" ? "https://…" : t("https://… , ftp://… or magnet:?…")}
            invalid={!!error}
            onEnter={submit}
          />
          <span className={`field__hint${error ? " text-danger" : ""}`}>
            {error || (source === "video" ? t("Paste a video or playlist URL to choose quality and format.") : source === "torrent" ? t("Paste a magnet link or torrent URL. You can choose files next.") : model ? t("Hugging Face model or dataset.") : t("The download details and destination are confirmed in the next step."))}
          </span>
        </div>
        {source === "url" && (
          <button type="button" className="disclose" aria-expanded={auth} onClick={() => setAuth(!auth)}>
            <Icon name={auth ? "chevron-down" : "chevron-right"} size={12} strokeWidth={2.2} /> {t("Use a user name and password")}
          </button>
        )}
        {source === "url" && auth && (
          <div className="row2">
            <TextField value={user} onChange={setUser} label={t("User name")} placeholder={t("User name")} icon="user" />
            <TextField value={pass} onChange={setPass} label={t("Password")} placeholder={t("Password")} type="password" icon="key" onEnter={submit} />
          </div>
        )}
      </div>
      <footer className="dialog__footer">
        <span className="spacer" />
        <button type="button" className="btn btn--ghost" onClick={() => void win.close()}>{t("Cancel")}</button>
        <button type="button" className="btn btn--primary" disabled={!valid || busy} onClick={submit}>
          {busy ? t("Checking…") : source === "video" ? t("Continue") : source === "torrent" ? t("Add torrent") : t("Continue")}
        </button>
      </footer>
    </WindowFrame>
  );
}
