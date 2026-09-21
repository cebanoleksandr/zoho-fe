import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import uk from './locales/uk.json';
import pl from './locales/pl.json';
import es from './locales/es.json';

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
  { code: 'pl', label: 'Polski' },
  { code: 'es', label: 'Español' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      pl: { translation: pl },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  });

export default i18n;
