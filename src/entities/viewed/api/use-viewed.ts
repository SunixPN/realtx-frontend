'use client'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { viewedKey } from './viewed-keys'
import type { ViewedItemType } from './viewed-types'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useQuery } from '@tanstack/react-query'

const fetcher = async (currency: DisplayCurrency): Promise<ViewedItemType[]> => {
    const r = await api.get<ViewedItemType[]>(API_ROUTES.VIEWED.LIST, {
        params: { displayCurrency: currency },
    })
    return r.data
}

export function useViewed(currency: DisplayCurrency = 'USD') {
    return useQuery({
        queryKey: viewedKey(currency),
        queryFn: () => fetcher(currency),
    })
}
