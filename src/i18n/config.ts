export const defaultLocale = 'en';
export const locales = ['en', 'hi', 'bho', 'pa'] as const;
export type Locale = typeof locales[number];

export function getLocale(locale: string): Locale {
  if (!locales.includes(locale as Locale)) {
    return defaultLocale;
  }
  return locale as Locale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
