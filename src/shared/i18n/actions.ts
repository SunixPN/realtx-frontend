'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { LOCALE_COOKIE, isLocale, type Locale } from './config';

const ONE_YEAR_SEC = 60 * 60 * 24 * 365;

export async function setLocale(locale: Locale) {
    if (!isLocale(locale)) return;
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: ONE_YEAR_SEC,
        sameSite: 'lax',
    });
    revalidatePath('/', 'layout');
}
