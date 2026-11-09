import { describe, expect, it } from "vitest";
import { LANGUAGES, resolveLanguage, setLanguage, t, tr } from "./i18n";

describe("English-only localization", () => {
  it("exposes only English (United States) and safely falls back for system locales", () => {
    expect(LANGUAGES).toEqual([{ code: "en", name: "English (United States)" }]);
    expect(resolveLanguage(undefined, ["vi-VN"])).toBe("en");
    expect(resolveLanguage("de", ["de-DE"])).toBe("en");
  });

  it("sets the document locale to en-US", () => {
    expect(setLanguage(undefined)).toBe("en");
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("keeps interpolation, plural forms, and branded product text", () => {
    expect(t("Open Prism")).toBe("Open 12e downloader");
    expect(t("{count} files", { count: 2 })).toBe("2 files");
    expect(t("{count} files", { count: 1 })).toBe("1 file");
  });

  it("inserts React elements into translated text", () => {
    const parts = tr("Click {button} to go on", { button: <b>Next</b> }) as React.ReactNode[];
    expect(parts).toHaveLength(3);
  });
});
