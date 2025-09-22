import { i18n } from 'webextension-polyfill';

export function useTranslation() {
  const t = (key: string) => {
    return i18n.getMessage(key);
  };

  return { t };
}
