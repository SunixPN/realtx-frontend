'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { favoriteIdsKey, isAnyFavoriteKey, isFavoritesKey } from './favorite-keys'
import type { FavoriteIdsType } from './favorite-types'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'
export function useAddFavorite() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<void, Error, string, number>(
        MUTATIONS.ADD_FAVORITE,
        async (_key, { arg: id }) => {
            mutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) => {
                    if (!old) return { ids: [id] }
                    return old.ids.includes(id) ? old : { ids: [...old.ids, id] }
                },
                { revalidate: false },
            )
            mutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
                (data: EstateType | undefined) => data ? { ...data, isFavorite: true } : data,
                { revalidate: false },
            )
            mutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
                (data: HouseEstatesResponseType | undefined) =>
                    data ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isFavorite: true } : i) } : data,
                { revalidate: false },
            )
            await api.post(API_ROUTES.FAVORITES.ADD(id))
        },
        {
            onSuccess: () => {
                mutate(isFavoritesKey)
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
