'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { authKey } from '@/entities/me/api/auth-query'
import { subscriptionsKey } from './subscription-keys'
import { toBackendFilters } from '../_helpers/filters-bridge'
import type { SearchSubscriptionType, UpdateSubscriptionDtoType } from './subscription-types'

type Arg = { id: string; patch: UpdateSubscriptionDtoType }

export function useUpdateSubscription() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (arg: Arg) => {
            const body: Record<string, unknown> = { ...arg.patch }
            if (arg.patch.filters !== undefined) body.filters = toBackendFilters(arg.patch.filters)
            const r = await api.patch<SearchSubscriptionType>(
                API_ROUTES.SUBSCRIPTIONS.UPDATE(arg.id),
                body,
            )
            return r.data
        },
        onSuccess: (updated) => {
            queryClient.setQueryData<SearchSubscriptionType[]>(
                subscriptionsKey(),
                (old) => old?.map(s => s.id === updated.id ? updated : s),
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
