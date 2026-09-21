'use client'
import useSWR, { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'
const fetcher = async (): Promise<SearchSubscriptionType[]> => {
    const r = await api.get<SearchSubscriptionType[]>(API_ROUTES.SUBSCRIPTIONS.LIST)
    return r.data
}
type Options = { enabled?: boolean } & SWRConfiguration<SearchSubscriptionType[]>
export function useSubscriptions(options?: Options) {
    const enabled = options?.enabled ?? true
    return useSWR<SearchSubscriptionType[]>(
        enabled ? subscriptionsKey() : null,
        fetcher,
        { keepPreviousData: true, ...options },
    )
}
