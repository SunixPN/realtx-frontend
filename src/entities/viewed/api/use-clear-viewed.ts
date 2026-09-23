'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { viewedIdsKey } from './viewed-keys'
import type { ViewedItemType } from './viewed-types'

export function useClearViewed() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            await api.delete(API_ROUTES.VIEWED.CLEAR)
        },
        onMutate: () => {
            queryClient.setQueriesData<ViewedItemType[]>(
                { queryKey: [QUERIES.VIEWED] },
                () => [],
            )
            swrMutate(viewedIdsKey(), { ids: [] }, { revalidate: false })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERIES.VIEWED] })
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
