'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { EstateMapPointType } from './estate-types'
import { mapPointsKey } from './estate-query-keys'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
export { mapPointsKey }

const fetcher = async (
    displayCurrency: DisplayCurrency,
    normFilters: ReturnType<typeof normalizeFilters>,
): Promise<EstateMapPointType[]> => {
    const r = await api.get<EstateMapPointType[]>(API_ROUTES.ESTATE.MAP_POINTS, {
        params: { ...normFilters, displayCurrency },
    })
    return r.data
}

export function useMapPoints(
    filters: MapFiltersType = {},
    displayCurrency: DisplayCurrency = 'USD',
    options?: { enabled?: boolean },
) {
    const enabled = options?.enabled ?? true
    const normFilters = normalizeFilters(filters)
    return useQuery({
        queryKey: mapPointsKey(filters, displayCurrency),
        queryFn: () => fetcher(displayCurrency, normFilters),
        enabled,
        placeholderData: (prev) => prev,
    })
}
