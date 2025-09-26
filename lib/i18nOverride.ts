// Runtime override for chrome.i18n to support user-selectable language without a full i18n refactor
// Loads static message bundles and switches based on window.localStorage 'preferredLanguage'.

// Import message bundles statically so they're bundled at build time
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from "../locales/en/messages.json";
// @ts-ignore
import es from "../locales/es/messages.json";
// @ts-ignore
import de from "../locales/de/messages.json";
// @ts-ignore
import pt from "../locales/pt/messages.json";
// @ts-ignore
import fr from "../locales/fr/messages.json";

// Keep a reference to the original getMessage in case we need to fall back
const originalGetMessage = typeof chrome !== "undefined" && chrome.i18n && chrome.i18n.getMessage
  ? chrome.i18n.getMessage.bind(chrome.i18n)
  : undefined;

// Map language code to bundle
const bundles: Record<string, any> = { en, es, de, pt, fr };

function resolvePreferredLanguage(): string {
  try {
    const stored = window.localStorage.getItem("preferredLanguage");
    if (stored && bundles[stored]) return stored;
  } catch {}
  // Try browser UI language, fallback to en
  try {
    const ui = (chrome?.i18n?.getUILanguage?.() || navigator.language || "en").toLowerCase();
    const base = ui.split("-")[0];
    if (bundles[base]) return base;
  } catch {}
  return "en";
}

let currentLang = resolvePreferredLanguage();

function interpolate(message: string, substitutions?: (string | number)[]): string {
  if (!substitutions || substitutions.length === 0) return message;
  let out = message;
  substitutions.forEach((val, idx) => {
    const re = new RegExp(`\\$${idx + 1}\\$`, "g");
    out = out.replace(re, String(val));
  });
  return out;
}

function getFromBundle(key: string, substitutions?: any[]): string | undefined {
  const bundle = bundles[currentLang];
  const entry = bundle?.[key];
  const msg = entry?.message as string | undefined;
  if (!msg) return undefined;
  return interpolate(msg, substitutions);
}

// Override only if chrome.i18n exists
if (typeof chrome !== "undefined" && chrome.i18n) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chrome.i18n.getMessage = (name: string, substitutions?: any): string => {
    // If the preferred language changed (e.g., another script updated it), refresh currentLang
    try {
      const pref = window.localStorage.getItem("preferredLanguage");
      if (pref && pref !== currentLang && bundles[pref]) {
        currentLang = pref;
      }
    } catch {}

    const subArr = Array.isArray(substitutions)
      ? substitutions
      : substitutions != null
      ? [substitutions]
      : undefined;

    const overridden = getFromBundle(name, subArr);
    if (overridden != null) return overridden;

    // Fallback to original if available
    if (originalGetMessage) return originalGetMessage(name, substitutions as any);

    // Ultimate fallback: return the key
    return name;
  };
}
