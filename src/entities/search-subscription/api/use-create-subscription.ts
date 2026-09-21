'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import { toBackendFilters } from '../_helpers/filters-bridge'
import type { CreateSubscriptionDtoType, SearchSubscriptionType } from './subscription-types'
export function useCreateSubscription() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<SearchSubscriptionType, Error, string, CreateSubscriptionDtoType>(
        MUTATIONS.CREATE_SUBSCRIPTION,
        async (_key, { arg }) => {
            const payload = { ...arg, filters: toBackendFilters(arg.filters) }
            const r = await api.post<SearchSubscriptionType>(API_ROUTES.SUBSCRIPTIONS.CREATE, payload)
            return r.data
        },
        {
            onSuccess: (created) => {
                mutate(
                    subscriptionsKey(),
                    (current: SearchSubscriptionType[] | undefined) =>
                        current ? [created, ...current] : [created],
                    { revalidate: true },
                )
                mutate(authKey)
            },
        },
    )
}
