// The product currently ships in English (United States) only. Keep the existing translation
// API so the UI, notifications, and backend-provided messages share one localization path.
import { createElement, Fragment, type ReactNode } from "react";
import en from "../locales/en.json";

export type PluralEntry = Partial<Record<Intl.LDMLPluralRule, string>>;
export type Catalog = Record<string, string | PluralEntry>;

/** The only language currently shipped by 12e downloader. */
export const LANGUAGES = [{ code: "en", name: "English (United States)" }] as const;
export type Language = (typeof LANGUAGES)[number]["code"];
export const CATALOGS: Record<Language, Catalog> = { en };

let current: Language = "en";
let plurals = new Intl.PluralRules("en-US");

/** Resolve a saved preference or the system locale; unsupported locales fall back to en-US. */
export function resolveLanguage(setting: string | undefined, preferred: readonly string[] = navigatorLanguages()): Language {
  if (setting) return "en";
  // Read the system preference on first launch (Windows exposes it through navigator.language).
  // English is the only available catalog for now, so all system locales safely use en-US.
  void preferred;
  return "en";
}

function navigatorLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language ?? "en-US"];
}

/** Switches the UI language from the persisted setting. */
export function setLanguage(setting: string | undefined): Language {
  const lang = resolveLanguage(setting);
  if (lang !== current) {
    current = lang;
    plurals = new Intl.PluralRules("en-US");
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = "en-US";
    document.documentElement.dir = "ltr";
  }
  return lang;
}

export function getLanguage(): Language {
  return current;
}

export function getLocale(): string {
  return "en-US";
}

type Vars = Record<string, string | number>;

function lookup(key: string, vars?: Vars): string {
  const entry = CATALOGS.en[key] ?? key;
  if (typeof entry === "string") return entry;
  const n = Number(vars?.count ?? 0);
  return entry[plurals.select(n)] ?? entry.other ?? key;
}

/** The text for `key` with `{name}` placeholders filled in. */
export function t(key: string, vars?: Vars): string {
  const text = lookup(key, vars);
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
}

/** Marks a text for translation where it's defined (module-level tables). */
export const tk = (key: string): string => key;

/** Like `t`, but placeholders can be React nodes (links, bold text, buttons). */
export function tr(key: string, vars: Record<string, ReactNode>): ReactNode {
  const count = vars.count;
  const text = lookup(key, typeof count === "number" || typeof count === "string" ? { count } : undefined);
  return text.split(/(\{\w+\})/).map((part, i) => {
    const name = /^\{(\w+)\}$/.exec(part)?.[1];
    return createElement(Fragment, { key: i }, name && name in vars ? vars[name] : part);
  });
}

// Keep this referenced in environments where navigator is unavailable during module evaluation.
void navigatorLanguages;
