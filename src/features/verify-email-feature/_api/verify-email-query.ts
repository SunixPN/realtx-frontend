'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'

type VerifyEmailResponse = { message: string }

export const verifyEmailKey = (token: string) => [QUERIES.VERIFY_EMAIL, token] as const

type Key = ReturnType<typeof verifyEmailKey>

const fetcher = async ([, token]: Key): Promise<VerifyEmailResponse> => {
    const r = await api.post<VerifyEmailResponse>(API_ROUTES.AUTH.VERIFY_EMAIL, { token })
    return r.data
}

export function useVerifyEmail(token: string) {
    return useSWR<VerifyEmailResponse>(
        token ? verifyEmailKey(token) : null,
        fetcher as (k: Key) => Promise<VerifyEmailResponse>,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            shouldRetryOnError: false,
            dedupingInterval: Infinity,
        },
    )
}
