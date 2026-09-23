'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { favoriteIdsKey } from './favorite-keys'
import type { FavoriteIdsType } from './favorite-types'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'

export function useAddFavorite() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            await api.post(API_ROUTES.FAVORITES.ADD(id))
            return id
        },
        onMutate: (id) => {
            // SWR: optimistically add to favoriteIds
            swrMutate(
                favoriteIdsKey(),
                (old?: FavoriteIdsType) => {
                    if (!old) return { ids: [id] }
                    return old.ids.includes(id) ? old : { ids: [...old.ids, id] }
                },
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
                (data: EstateType | undefined) => data ? { ...data, isFavorite: true } : data,
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
                (data: HouseEstatesResponseType | undefined) =>
                    data
                        ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isFavorite: true } : i) }
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
