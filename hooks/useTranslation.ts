export function useTranslation() {
  const t = (key: string, substitutions?: any) => {
    // Use chrome.i18n so it is routed through our override
    return chrome?.i18n?.getMessage?.(key, substitutions) ?? key;
  };

  return { t };
}
