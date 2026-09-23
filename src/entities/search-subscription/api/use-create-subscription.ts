'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import { toBackendFilters } from '../_helpers/filters-bridge'
import type { CreateSubscriptionDtoType, SearchSubscriptionType } from './subscription-types'

export function useCreateSubscription() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (arg: CreateSubscriptionDtoType) => {
            const payload = { ...arg, filters: toBackendFilters(arg.filters) }
            const r = await api.post<SearchSubscriptionType>(API_ROUTES.SUBSCRIPTIONS.CREATE, payload)
            return r.data
        },
        onSuccess: (created) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old ? [created, ...old] : [created],
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
