import { en, type Dict } from "./en";
import { sw } from "./sw";

export type Locale = "en" | "sw";

const KEY = "vetcare-locale";

/** Default is always English unless the user explicitly chose Kiswahili. */
export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(KEY);
  return v === "sw" ? "sw" : "en";
}

export function setStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    /* ignore */
  }
}

/**
 * English is the default. We do not auto-switch from browser language —
 * user must pick Kiswahili in the UI.
 */
export function detectLocale(): Locale {
  return getStoredLocale();
}

export function t(locale: Locale): Dict {
  return locale === "sw" ? sw : en;
}

export { en, sw };
