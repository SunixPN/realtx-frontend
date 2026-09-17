'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { type MapFiltersType } from '../model/estate-filters'
import type { DistrictProfitabilityType } from './estate-types'
import { districtProfitabilityKey } from './estate-query-keys'

export { districtProfitabilityKey }

type Key = ReturnType<typeof districtProfitabilityKey>

const fetcher = async ([, displayCurrency, normFilters]: Key): Promise<DistrictProfitabilityType[]> => {
    const r = await api.get<DistrictProfitabilityType[]>(API_ROUTES.ESTATE.DISTRICT_PROFITABILITY, {
        params: { ...normFilters, displayCurrency },
    })
    return r.data
}

export function useDistrictProfitability(
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
    options?: { enabled?: boolean },
) {
    const enabled = options?.enabled ?? true
    return useSWR<DistrictProfitabilityType[]>(
        enabled ? districtProfitabilityKey(filters, displayCurrency) : null,
        fetcher as (k: Key) => Promise<DistrictProfitabilityType[]>,
        { keepPreviousData: true },
    )
}
