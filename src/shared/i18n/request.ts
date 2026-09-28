import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from './config';
import { APP_TIME_ZONE } from '@/shared/const/time-zone';
export default getRequestConfig(async () => {
    const store = await cookies();
    const raw = store.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
    const messages = (await import(`./messages/${locale}.json`)).default;
    return { locale, messages, timeZone: APP_TIME_ZONE };
});
