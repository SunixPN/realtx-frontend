import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { normalizeFilters, type MapFiltersType } from '../model/estate-filters'
import type { HouseEstatesResponseType } from './estate-types'

export type HouseBbox = {
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
}

/**
 * bbox приходит от Mapbox-кластера — clusterProperties.minLng/maxLng/minLat/maxLat.
 * Ключ округляем до 5 знаков (~1 м), чтобы кэш совпадал между кликами по одному дому.
 * Фильтры пробрасываются ровно как в mapPointsQuery — иначе счётчик на метке
 * ("2 квартиры") не сходится с содержимым drawer'а (там всплывали все 6).
 */
export const houseEstatesQuery = (
    bbox: HouseBbox,
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
) => {
    const normFilters = normalizeFilters(filters)
    const key = [
        bbox.minLat.toFixed(5),
        bbox.maxLat.toFixed(5),
        bbox.minLng.toFixed(5),
        bbox.maxLng.toFixed(5),
    ]
    return queryOptions({
        queryKey: [QUERIES.HOUSE_ESTATES, displayCurrency, ...key, ...Object.values(normFilters)],
        queryFn: () =>
            api.get<HouseEstatesResponseType>(API_ROUTES.ESTATE.HOUSE, {
                params: { ...bbox, ...normFilters, displayCurrency },
            }),
        select: (r) => r.data,
        staleTime: 10 * 60 * 1000,
    })
}
