import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LangCode = "en" | "es" | "de" | "pt" | "fr";

type I18nContextValue = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolveInitialLang(): LangCode {
  try {
    const stored = window.localStorage.getItem("preferredLanguage") as LangCode | null;
    if (stored && ["en","es","de","pt","fr"].includes(stored)) return stored;
  } catch {}
  const ui = (chrome?.i18n?.getUILanguage?.() || navigator.language || "en").toLowerCase();
  const base = ui.split("-")[0] as LangCode;
  return (["en","es","de","pt","fr"] as const).includes(base) ? base : "en";
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>(() => resolveInitialLang());

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    try {
      window.localStorage.setItem("preferredLanguage", l);
    } catch {}
  }, []);

  // Expose stable context value
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  // Optional: notify other listeners if needed
  useEffect(() => {
    // Trigger a custom event in case some parts listen for it
    try {
      window.dispatchEvent(new CustomEvent("preferredLanguageChanged", { detail: { lang } }));
    } catch {}
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
