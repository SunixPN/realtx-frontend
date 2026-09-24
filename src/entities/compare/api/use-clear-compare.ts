'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { compareIdsKey } from './compare-keys'
import { COMPARE_LIMIT, type CompareListType } from './compare-types'

export function useClearCompare() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            await api.delete(API_ROUTES.COMPARE.CLEAR)
        },
        onMutate: () => {
            queryClient.setQueriesData<CompareListType>(
                { queryKey: [QUERIES.COMPARE] },
                (old) => old ? { ...old, items: [], count: 0 } : old,
            )
            swrMutate(compareIdsKey(), { ids: [], limit: COMPARE_LIMIT }, { revalidate: false })
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
