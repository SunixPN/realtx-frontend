'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'

type Arg = { id: string; paused: boolean }

export function useTogglePauseSubscription() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (arg: Arg) => {
            const r = await api.patch<SearchSubscriptionType>(
                API_ROUTES.SUBSCRIPTIONS.PAUSE(arg.id),
                { paused: arg.paused },
            )
            return r.data
        },
        onMutate: (arg) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old?.map(s => s.id === arg.id ? { ...s, paused: arg.paused } : s),
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
