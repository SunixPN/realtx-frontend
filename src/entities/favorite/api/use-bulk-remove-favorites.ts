'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { authKey } from '@/entities/me/api/auth-query'
import {
    favoriteIdsKey,
    isFavoritesKey,
    isAnyFavoriteKey,
} from './favorite-keys'
import type { FavoriteIdsType, FavoriteItemType } from './favorite-types'
export function useBulkRemoveFavorites() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<void, Error, string, number[]>(
        MUTATIONS.BULK_REMOVE_FAVORITES,
        async (_key, { arg: ids }) => {
            mutate(
                isFavoritesKey,
                (old?: FavoriteItemType[]) => old?.filter(item => !ids.includes(item.id)) ?? [],
                { revalidate: false },
            )
            mutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) =>
                    old ? { ids: old.ids.filter(id => !ids.includes(id)) } : { ids: [] },
                { revalidate: false },
            )
            await api.delete(API_ROUTES.FAVORITES.BULK_REMOVE, { data: { ids } })
        },
        {
            onSuccess: () => {
                mutate(isAnyFavoriteKey)
                mutate(authKey)
            },
            onError: () => {
                mutate(isAnyFavoriteKey)
                mutate(authKey)
            },
        },
    )
}
