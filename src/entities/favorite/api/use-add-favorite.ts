'use client'

import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { QUERIES } from '@/shared/const/queries'
import { isAnyFavoriteKey } from './favorite-keys'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'

export function useAddFavorite() {
    const { mutate } = useSWRConfig()
    return useSWRMutation<void, Error, string, number>(
        MUTATIONS.ADD_FAVORITE,
        async (_key, { arg: id }) => {
            await api.post(API_ROUTES.FAVORITES.ADD(id))
            // Прокатываем isFavorite=true по кэшам деталки и списков «в этом доме»,
            // чтобы при возврате на карточку не было мигания.
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
        },
        {
            onSuccess: () => {
                mutate(isAnyFavoriteKey)
            },
        },
    )
}
