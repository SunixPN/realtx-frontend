'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { viewedIdsKey } from './viewed-keys'
import type { ViewedIdsType, ViewedItemType } from './viewed-types'
import type { EstateType, HouseEstatesResponseType } from '@/entities/estate'

export function useRemoveViewed() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(API_ROUTES.VIEWED.REMOVE(id))
            return id
        },
        onMutate: (id) => {
            queryClient.setQueriesData<ViewedItemType[]>(
                { queryKey: [QUERIES.VIEWED] },
                (old) => old?.filter(item => item.id !== id),
            )
            swrMutate(
                viewedIdsKey(),
                (old?: ViewedIdsType) =>
                    old ? { ids: old.ids.filter(x => x !== id) } : { ids: [] },
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.ESTATE_BY_ID && k[1] === id,
                (data: EstateType | undefined) => data ? { ...data, isViewed: false } : data,
                { revalidate: false },
            )
            swrMutate(
                (k: unknown) => Array.isArray(k) && k[0] === QUERIES.HOUSE_ESTATES,
                (data: HouseEstatesResponseType | undefined) =>
                    data
                        ? { ...data, items: data.items.map(i => i.id === id ? { ...i, isViewed: false } : i) }
                        : data,
                { revalidate: false },
            )
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
