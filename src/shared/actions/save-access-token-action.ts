'use server'

import { cookies } from 'next/headers'
import { TOKENS } from '@/shared/const/tokens'
import { env } from '@/shared/config/env'

export async function saveAccessTokenAction(token: string) {
    const store = await cookies()
    const domain = env.COOKIE_DOMAIN || undefined
    store.set(TOKENS.ACCESS_TOKEN, token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 15 * 60,
        ...(domain ? { domain } : {}),
    })
}
