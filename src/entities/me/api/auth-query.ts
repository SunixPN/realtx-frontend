'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { TOKENS } from '@/shared/const/tokens'
import { AuthUserType } from '@/entities/me/types/me-type'
import readCookieAction from "@/shared/actions/read-cookie-action";

export const authKey = QUERIES.AUTH_QUERY

type AuthState = { user: AuthUserType } | null

const fetcher = async (): Promise<AuthState> => {
    if (typeof window === 'undefined') return null
    const token = await readCookieAction(TOKENS.ACCESS_TOKEN)
    // На мобильном Chrome при убийстве процесса session-кука access_token стирается,
    // а refresh_token (persistent) переживает. proxy.ts не срабатывает при восстановлении
    // вкладки из снапшота — дёргаем refresh руками, чтобы поднять сессию до /auth/me.
    if (!token) {
        try {
            const res = await fetch('/api/auth/refresh', { method: 'POST' })
            if (!res.ok) return null
        } catch {
            return null
        }
    }
    const { data: user } = await api.get<AuthUserType>(API_ROUTES.AUTH.ME)
    return { user }
}

export function useAuth() {
    return useSWR<AuthState>(authKey, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: false,
        dedupingInterval: 60_000,
    })
}
