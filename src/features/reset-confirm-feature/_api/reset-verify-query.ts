'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'

type VerifyResponse = { valid: true }

export const resetVerifyKey = (token: string) => [QUERIES.RESET_VERIFY, token] as const

type Key = ReturnType<typeof resetVerifyKey>

const fetcher = async ([, token]: Key): Promise<VerifyResponse> => {
    const r = await api.post<VerifyResponse>(API_ROUTES.AUTH.PASSWORD_RESET.VERIFY, { token })
    return r.data
}

export function useResetVerify(token: string) {
    return useSWR<VerifyResponse>(
        token ? resetVerifyKey(token) : null,
        fetcher as (k: Key) => Promise<VerifyResponse>,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
            dedupingInterval: Infinity,
        },
    )
}
