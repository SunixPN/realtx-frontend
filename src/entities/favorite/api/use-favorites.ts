'use client'

import { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { favoritesKey } from './favorite-keys'
import type { FavoriteItemType, FavoriteSort } from './favorite-types'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import {useQuery} from "@tanstack/react-query";

type Key = readonly [FavoriteSort, DisplayCurrency]

const fetcher = async ([sort, currency]: Key): Promise<FavoriteItemType[]> => {
    const r = await api.get<FavoriteItemType[]>(API_ROUTES.FAVORITES.LIST, {
        params: { sort, displayCurrency: currency },
    })
    return r.data
}

type Options = { enabled?: boolean } & SWRConfiguration<FavoriteItemType[]>

export function useFavorites(
    sort: FavoriteSort = 'recent',
    currency: DisplayCurrency = 'USD',
    options?: Options,
) {
    return useQuery({
        queryKey: favoritesKey(sort, currency),
        queryFn: () => fetcher([sort, currency]),
    })
}
