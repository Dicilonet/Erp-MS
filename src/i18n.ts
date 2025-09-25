// src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Lista de idiomas soportados
const locales = ['en', 'de', 'es'];

export default getRequestConfig(async ({ locale }) => {
  // Valida que el idioma de la URL esté en nuestra lista
  if (!locales.includes(locale as any)) notFound();

  return {
    // Carga los mensajes de traducción dinámicamente
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});