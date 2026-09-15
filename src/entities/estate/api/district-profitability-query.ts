import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { DistrictProfitabilityType } from './estate-types'

export const districtProfitabilityQuery = (
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
) => {
    const params = { ...normalizeFilters(filters), displayCurrency }
    return queryOptions({
        queryKey: [QUERIES.DISTRICT_PROFITABILITY, displayCurrency, ...Object.values(normalizeFilters(filters))],
        queryFn: async () => {
            const r = await api.get<DistrictProfitabilityType[]>(API_ROUTES.ESTATE.DISTRICT_PROFITABILITY, { params })
            return r.data
        },
        staleTime: 60 * 1000,
    })
}
