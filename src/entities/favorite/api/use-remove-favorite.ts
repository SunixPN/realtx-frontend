'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { QUERIES } from '@/shared/const/queries'
import {
    favoriteIdsKey,
    isAnyFavoriteKey,
    isFavoritesKey,
} from './favorite-keys'
import type { FavoriteIdsType, FavoriteItemType } from './favorite-types'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'
export function useRemoveFavorite() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<void, Error, string, number>(
        MUTATIONS.REMOVE_FAVORITE,
        async (_key, { arg: id }) => {
            mutate(
                isFavoritesKey,
                (old?: FavoriteItemType[]) => old?.filter(item => item.id !== id) ?? [],
                { revalidate: false },
            )
            mutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) =>
                    old ? { ids: old.ids.filter(x => x !== id) } : { ids: [] },
                { revalidate: false },
            )
            mutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
                (data: EstateType | undefined) => data ? { ...data, isFavorite: false } : data,
                { revalidate: false },
            )
            mutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
                (data: HouseEstatesResponseType | undefined) =>
                    data ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isFavorite: false } : i) } : data,
                { revalidate: false },
            )
            await api.delete(API_ROUTES.FAVORITES.REMOVE(id))
        },
        {
            onSuccess: () => {
                mutate(isAnyFavoriteKey)
            },
            onError: () => {
                mutate(isAnyFavoriteKey)
            },
        },
    )
}
