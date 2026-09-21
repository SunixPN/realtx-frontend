'use client'
import  { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'
import {useQuery} from "@tanstack/react-query";
const fetcher = async (): Promise<SearchSubscriptionType[]> => {
    const r = await api.get<SearchSubscriptionType[]>(API_ROUTES.SUBSCRIPTIONS.LIST)
    return r.data
}
type Options = { enabled?: boolean } & SWRConfiguration<SearchSubscriptionType[]>
export function useSubscriptions(options?: Options) {
    return useQuery({
        queryKey: subscriptionsKey(),
        queryFn: () => fetcher()
    })
}
