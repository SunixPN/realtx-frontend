'use server'

import { cookies } from 'next/headers'
import { TOKENS } from '@/shared/const/tokens'
import { env } from '@/shared/config/env'

// Удаляем куку через явный set с maxAge:0 — точнее, чем store.delete(),
// потому что можно контролировать все атрибуты. Браузер удалит куку, если
// name+domain+path совпадают с оригиналом.
function expire(
    store: Awaited<ReturnType<typeof cookies>>,
    name: string,
    domain: string | undefined,
) {
    const base = {
        httpOnly: true,
        path: '/',
        sameSite: 'lax' as const,
        maxAge: 0,
    }
    // Host-only (без domain) — на случай остатков со старой версии.
    store.set(name, '', base)
    if (domain) {
        store.set(name, '', { ...base, domain })
    }
}

export async function clearTokensAction() {
    const store = await cookies()
    const domain = env.COOKIE_DOMAIN || undefined
    expire(store, TOKENS.ACCESS_TOKEN, domain)
    expire(store, TOKENS.REFRESH_TOKEN, domain)
}
