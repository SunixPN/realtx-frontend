'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { subscriptionsKey } from './subscription-keys'
import { toBackendFilters } from '../_helpers/filters-bridge'
import type { SearchSubscriptionType, UpdateSubscriptionDtoType } from './subscription-types'
type Arg = { id: string; patch: UpdateSubscriptionDtoType }
export function useUpdateSubscription() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<SearchSubscriptionType, Error, string, Arg>(
        MUTATIONS.UPDATE_SUBSCRIPTION,
        async (_key, { arg }) => {
            const body: Record<string, unknown> = { ...arg.patch }
            if (arg.patch.filters !== undefined) body.filters = toBackendFilters(arg.patch.filters)
            const r = await api.patch<SearchSubscriptionType>(
                API_ROUTES.SUBSCRIPTIONS.UPDATE(arg.id),
                body,
            )
            return r.data
        },
        {
            onSuccess: (updated) => {
                mutate(
                    subscriptionsKey(),
                    (current: SearchSubscriptionType[] | undefined) =>
                        current ? current.map(s => s.id === updated.id ? updated : s) : current,
                    { revalidate: true },
                )
            },
        },
    )
}
