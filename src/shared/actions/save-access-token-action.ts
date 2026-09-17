'use server'

import { cookies } from 'next/headers'
import { TOKENS } from '@/shared/const/tokens'

export async function saveAccessTokenAction(token: string) {
    const store = await cookies()
    store.set(TOKENS.ACCESS_TOKEN, token, { httpOnly: true, path: '/', sameSite: 'lax' })
}
