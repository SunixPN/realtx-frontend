'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { compareIdsKey } from './compare-keys'
import type { CompareIdsType, CompareListType } from './compare-types'
import { patchEstateIsInCompare } from './patch-estate-compare'

export function useRemoveCompare() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(API_ROUTES.COMPARE.REMOVE(id))
            return id
        },
        onMutate: (id) => {
            queryClient.setQueriesData<CompareListType>(
                { queryKey: [QUERIES.COMPARE] },
                (old) => old
                    ? { ...old, items: old.items.filter(i => i.id !== id), count: Math.max(0, old.count - 1) }
                    : old,
            )
            swrMutate(
                compareIdsKey(),
                (old?: CompareIdsType) =>
                    old ? { ids: old.ids.filter(x => x !== id), limit: old.limit } : { ids: [], limit: 4 },
                { revalidate: false },
            )
            patchEstateIsInCompare(id, false)
        },
        onError: (_error, id) => {
            // Unroll optimistic patch if server rejected
            swrMutate(compareIdsKey())
            patchEstateIsInCompare(id, true)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERIES.COMPARE] })
            queryClient.invalidateQueries({ queryKey: [QUERIES.FAVORITES] })
            swrMutate(authKey)
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
