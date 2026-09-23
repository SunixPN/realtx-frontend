'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { favoriteIdsKey } from './favorite-keys'
import type { FavoriteIdsType, FavoriteItemType } from './favorite-types'

export function useBulkRemoveFavorites() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (ids: number[]) => {
            await api.delete(API_ROUTES.FAVORITES.BULK_REMOVE, { data: { ids } })
            return ids
        },
        onMutate: (ids) => {
            queryClient.setQueriesData<FavoriteItemType[]>(
                { queryKey: [QUERIES.FAVORITES] },
                (old) => old?.filter(item => !ids.includes(item.id)),
            )
            swrMutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) =>
                    old ? { ids: old.ids.filter(id => !ids.includes(id)) } : { ids: [] },
                { revalidate: false },
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERIES.FAVORITES] })
            swrMutate(authKey)
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
