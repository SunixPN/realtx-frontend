'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'
export function useMarkSeenSubscription() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<SearchSubscriptionType, Error, string, string>(
        MUTATIONS.MARK_SEEN_SUBSCRIPTION,
        async (_key, { arg: id }) => {
            mutate(
                subscriptionsKey(),
                (current: SearchSubscriptionType[] | undefined) =>
                    current
                        ? current.map(s => s.id === id ? { ...s, fresh: 0 } : s)
                        : current,
                { revalidate: false },
            )
            const r = await api.post<SearchSubscriptionType>(API_ROUTES.SUBSCRIPTIONS.MARK_SEEN(id))
            return r.data
        },
        {
            onSuccess: (updated) => {
                mutate(
                    subscriptionsKey(),
                    (current: SearchSubscriptionType[] | undefined) =>
                        current ? current.map(s => s.id === updated.id ? updated : s) : current,
                    { revalidate: false },
                )
            },
            onError: () => {
                mutate(subscriptionsKey())
            },
        },
    )
}
