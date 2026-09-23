'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'

export function useMarkSeenSubscription() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const r = await api.post<SearchSubscriptionType>(API_ROUTES.SUBSCRIPTIONS.MARK_SEEN(id))
            return r.data
        },
        onMutate: (id) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old?.map(s => s.id === id ? { ...s, fresh: 0 } : s),
            )
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old?.map(s => s.id === updated.id ? updated : s),
            )
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionsKey() })
        },
        onSettled: () => {
            swrMutate(authKey)
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
