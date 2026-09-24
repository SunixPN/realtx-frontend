'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { compareKey } from './compare-keys'
import type { CompareListType } from './compare-types'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

const fetcher = async (currency: DisplayCurrency): Promise<CompareListType> => {
    const r = await api.get<CompareListType>(API_ROUTES.COMPARE.LIST, {
        params: { displayCurrency: currency },
    })
    return r.data
}

export function useCompare(currency: DisplayCurrency = 'USD') {
    return useQuery({
        queryKey: compareKey(currency),
        queryFn: () => fetcher(currency),
    })
}
