'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { type MapFiltersType } from '../model/estate-filters'
import type { EstateMapPointType } from './estate-types'
import { mapPointsKey } from './estate-query-keys'

export { mapPointsKey }

type Key = ReturnType<typeof mapPointsKey>

const fetcher = async ([, displayCurrency, normFilters]: Key): Promise<EstateMapPointType[]> => {
    const r = await api.get<EstateMapPointType[]>(API_ROUTES.ESTATE.MAP_POINTS, {
        params: { ...normFilters, displayCurrency },
    })
    return r.data
}

export function useMapPoints(
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
    options?: { enabled?: boolean },
) {
    const enabled = options?.enabled ?? true
    return useSWR<EstateMapPointType[]>(
        enabled ? mapPointsKey(filters, displayCurrency) : null,
        fetcher as (k: Key) => Promise<EstateMapPointType[]>,
        { keepPreviousData: true },
    )
}
