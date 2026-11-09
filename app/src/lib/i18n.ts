// The UI currently ships English (United States) only. Keep the existing translation
// API so app surfaces can support additional catalogs later without call-site rewrites.
import { createElement, Fragment, type ReactNode } from "react";
import en from "../locales/en.json";

export type PluralEntry = Partial<Record<Intl.LDMLPluralRule, string>>;
export type Catalog = Record<string, string | PluralEntry>;
export const LANGUAGES = [{ code: "en", name: "English (United States)" }] as const;
export type Language = (typeof LANGUAGES)[number]["code"];
export const CATALOGS: Record<Language, Catalog> = { en };

let plurals = new Intl.PluralRules("en-US");

/** Resolve saved selection/system preference. English is the sole supported catalog for now. */
export function resolveLanguage(setting: string | undefined, preferred: readonly string[] = navigatorLanguages()): Language {
  // Read the OS/browser preference on first launch; unsupported locales safely use en-US.
  void setting;
  void preferred;
  return "en";
}

function navigatorLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language ?? "en-US"];
}

export function setLanguage(setting: string | undefined): Language {
  const lang = resolveLanguage(setting);
  plurals = new Intl.PluralRules("en-US");
  if (typeof document !== "undefined") {
    document.documentElement.lang = "en-US";
    document.documentElement.dir = "ltr";
  }
  return lang;
}

export function getLanguage(): Language { return "en"; }
export function getLocale(): string { return "en-US"; }

type Vars = Record<string, string | number>;
const brand = (text: string) => text.replace(/Prism/g, "12e downloader");

function lookup(key: string, vars?: Vars): string {
  const entry = CATALOGS.en[key] ?? key;
  if (typeof entry === "string") return brand(entry);
  const n = Number(vars?.count ?? 0);
  return brand(entry[plurals.select(n)] ?? entry.other ?? key);
}

export function t(key: string, vars?: Vars): string {
  const text = lookup(key, vars);
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
}

/** Marks a text for translation where it is declared in a module-level table. */
export const tk = (key: string): string => brand(key);

export function tr(key: string, vars: Record<string, ReactNode>): ReactNode {
  const count = vars.count;
  const text = lookup(key, typeof count === "number" || typeof count === "string" ? { count } : undefined);
  return text.split(/(\{\w+\})/).map((part, i) => {
    const name = /^\{(\w+)\}$/.exec(part)?.[1];
    return createElement(Fragment, { key: i }, name && name in vars ? vars[name] : part);
  });
}

// Keep system locale discovery safe during non-browser test/module evaluation.
void navigatorLanguages;
