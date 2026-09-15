import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { EstateMapPointType } from './estate-types'

// Возвращаем .data (не сырой AxiosResponse) — иначе dehydrate() на сервере
// падает в стек-оверфлоу из-за циркулярных ссылок в response.request/config.
export const mapPointsQuery = (filters: MapFiltersType = {}, displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD') => {
    const params = { ...normalizeFilters(filters), displayCurrency }
    return queryOptions({
        queryKey: [QUERIES.MAP_POINTS, displayCurrency, ...Object.values(normalizeFilters(filters))],
        queryFn: async () => {
            const r = await api.get<EstateMapPointType[]>(API_ROUTES.ESTATE.MAP_POINTS, { params })
            return r.data
        },
        staleTime: 24 * 60 * 60 * 1000,
    })
}
