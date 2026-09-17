'use client'

import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'

export function useDeleteSubscription() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<void, Error, string, string>(
        MUTATIONS.DELETE_SUBSCRIPTION,
        async (_key, { arg: id }) => {
            // Оптимистично убираем из кэша — карточка исчезает мгновенно,
            // возврат назад через rollback в throw-catch снаружи (форма ловит).
            mutate(
                subscriptionsKey(),
                (current: SearchSubscriptionType[] | undefined) =>
                    current ? current.filter(s => s.id !== id) : current,
                { revalidate: false },
            )
            await api.delete(API_ROUTES.SUBSCRIPTIONS.REMOVE(id))
        },
        {
            onSuccess: () => {
                mutate(subscriptionsKey())
            },
            onError: () => {
                // Откатываем — просим ревалидацию, вернёт актуальный список.
                mutate(subscriptionsKey())
            },
        },
    )
}
