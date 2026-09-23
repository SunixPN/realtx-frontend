'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { favoriteIdsKey } from './favorite-keys'
import type { FavoriteIdsType, FavoriteItemType } from './favorite-types'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'

export function useRemoveFavorite() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(API_ROUTES.FAVORITES.REMOVE(id))
            return id
        },
        onMutate: (id) => {
            // Optimistic: patch all cached favorites list variants
            queryClient.setQueriesData<FavoriteItemType[]>(
                { queryKey: [QUERIES.FAVORITES] },
                (old) => old?.filter(item => item.id !== id),
            )
            // SWR: patch favoriteIds + estate caches
            swrMutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) =>
                    old ? { ids: old.ids.filter(x => x !== id) } : { ids: [] },
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
                (data: EstateType | undefined) => data ? { ...data, isFavorite: false } : data,
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
                (data: HouseEstatesResponseType | undefined) =>
                    data
                        ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isFavorite: false } : i) }
                        : data,
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
