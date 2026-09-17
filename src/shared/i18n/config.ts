export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string | undefined): value is Locale {
    return !!value && (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_LABELS: Record<Locale, string> = {
    ru: 'Русский',
    en: 'English',
};

export const LOCALE_SHORT: Record<Locale, string> = {
    ru: 'RU',
    en: 'EN',
};
