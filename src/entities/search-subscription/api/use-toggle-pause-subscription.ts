'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'
type Arg = { id: string; paused: boolean }
export function useTogglePauseSubscription() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<SearchSubscriptionType, Error, string, Arg>(
        MUTATIONS.PAUSE_SUBSCRIPTION,
        async (_key, { arg }) => {
            mutate(
                subscriptionsKey(),
                (current: SearchSubscriptionType[] | undefined) =>
                    current
                        ? current.map(s => s.id === arg.id ? { ...s, paused: arg.paused } : s)
                        : current,
                { revalidate: false },
            )
            const r = await api.patch<SearchSubscriptionType>(
                API_ROUTES.SUBSCRIPTIONS.PAUSE(arg.id),
                { paused: arg.paused },
            )
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
