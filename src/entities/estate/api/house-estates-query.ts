'use client'

import useSWR from 'swr'
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

// bbox округляем до 5 знаков (~1 м), чтобы кэш совпадал между кликами по одному дому.
function bboxKeyParts(b: HouseBbox) {
    return [
        Number(b.minLat.toFixed(5)),
        Number(b.maxLat.toFixed(5)),
        Number(b.minLng.toFixed(5)),
        Number(b.maxLng.toFixed(5)),
    ] as const
}

export const houseEstatesKey = (
    bbox: HouseBbox,
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
) => [QUERIES.HOUSE_ESTATES, displayCurrency, bboxKeyParts(bbox), normalizeFilters(filters)] as const

type Key = ReturnType<typeof houseEstatesKey>

const fetcher = async ([, displayCurrency, bboxParts, normFilters]: Key): Promise<HouseEstatesResponseType> => {
    const [minLat, maxLat, minLng, maxLng] = bboxParts
    const r = await api.get<HouseEstatesResponseType>(API_ROUTES.ESTATE.HOUSE, {
        params: { minLat, maxLat, minLng, maxLng, ...normFilters, displayCurrency },
    })
    return r.data
}

export function useHouseEstates(
    bbox: HouseBbox,
    filters: MapFiltersType = {},
    displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD',
) {
    return useSWR<HouseEstatesResponseType>(
        houseEstatesKey(bbox, filters, displayCurrency),
        fetcher as (k: Key) => Promise<HouseEstatesResponseType>,
    )
}
