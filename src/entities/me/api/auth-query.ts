'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { AuthUserType } from '@/entities/me/types/me-type'

export const authKey = QUERIES.AUTH_QUERY

type AuthState = { user: AuthUserType } | null

const fetcher = async (): Promise<AuthState> => {
    if (typeof window === 'undefined') return null
    const { data: user } = await api.get<AuthUserType>(API_ROUTES.AUTH.ME)
    return { user }
}

export function useAuth() {
    return useSWR<AuthState>(authKey, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: false,
        dedupingInterval: 60_000,
        shouldRetryOnError: false,
    })
}