'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import type { SearchSubscriptionType } from './subscription-types'

export function useDeleteSubscription() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(API_ROUTES.SUBSCRIPTIONS.REMOVE(id))
            return id
        },
        onMutate: (id) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old?.filter(s => s.id !== id),
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionsKey() })
            swrMutate(authKey)
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
