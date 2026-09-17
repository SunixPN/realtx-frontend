'use client'

import useSWR, { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { favoriteIdsKey } from './favorite-keys'
import type { FavoriteIdsType } from './favorite-types'

const fetcher = async (): Promise<FavoriteIdsType> => {
    const r = await api.get<FavoriteIdsType>(API_ROUTES.FAVORITES.IDS)
    return r.data
}

type Options = { enabled?: boolean } & SWRConfiguration<FavoriteIdsType>

export function useFavoriteIds(options?: Options) {
    const enabled = options?.enabled ?? true
    return useSWR<FavoriteIdsType>(
        enabled ? favoriteIdsKey() : null,
        fetcher,
        options,
    )
}
