'use server'

import { cookies } from 'next/headers'
import { TOKENS } from '@/shared/const/tokens'

export async function clearTokensAction() {
    const store = await cookies()
    store.delete(TOKENS.ACCESS_TOKEN)
    store.delete(TOKENS.REFRESH_TOKEN)
}
