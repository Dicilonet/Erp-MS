import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18n = i18next;

// Solo inicializar en el cliente
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector) // Detecta el idioma del navegador
    .use(initReactI18next) // Pasa i18n a react-i18next
    .use(resourcesToBackend((language: string, namespace: string) => import(`../locales/${language}/${namespace}.json`)))
    .init({
      fallbackLng: 'es', // Idioma de respaldo
      debug: process.env.NODE_ENV === 'development',
      ns: ['common', 'dashboard', 'marketing', 'offer', 'todo', 'projects', 'expenses', 'support', 'communications', 'connections', 'settings', 'chat', 'customers', 'articles', 'forms', 'legal', 'admin', 'landing'], // Namespaces a cargar
      defaultNS: 'common',
      interpolation: {
        escapeValue: false, // React ya protege contra XSS
      },
      load: 'languageOnly',
      react: {
        useSuspense: false,
      },
      detection: {
        order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['cookie'],
      },
    });
}

export default i18n;