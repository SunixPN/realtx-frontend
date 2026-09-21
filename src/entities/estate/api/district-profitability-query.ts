'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { DistrictProfitabilityType } from './estate-types'
import { districtProfitabilityKey } from './estate-query-keys'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
export { districtProfitabilityKey }

const fetcher = async (
    displayCurrency: DisplayCurrency,
    normFilters: ReturnType<typeof normalizeFilters>,
): Promise<DistrictProfitabilityType[]> => {
    const r = await api.get<DistrictProfitabilityType[]>(API_ROUTES.ESTATE.DISTRICT_PROFITABILITY, {
        params: { ...normFilters, displayCurrency },
    })
    return r.data
}

export function useDistrictProfitability(
    filters: MapFiltersType = {},
    displayCurrency: DisplayCurrency = 'USD',
    options?: { enabled?: boolean },
) {
    const enabled = options?.enabled ?? true
    const normFilters = normalizeFilters(filters)
    return useQuery({
        queryKey: districtProfitabilityKey(filters, displayCurrency),
        queryFn: () => fetcher(displayCurrency, normFilters),
        enabled,
        placeholderData: (prev) => prev,
    })
}
