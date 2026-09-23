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

// Небольшой отступ чтобы точечный bbox (min=max, когда все квартиры на одной точке)
// не давал пустой результат из-за float-погрешности хранения координат в БД.
// 1e-5° ≈ 1 м — достаточно для одного здания, слишком мало чтобы захватить соседнее.
const BBOX_EPS = 1e-5

const fetcher = async ([, displayCurrency, bboxParts, normFilters]: Key): Promise<HouseEstatesResponseType> => {
    const [minLat, maxLat, minLng, maxLng] = bboxParts
    const r = await api.get<HouseEstatesResponseType>(API_ROUTES.ESTATE.HOUSE, {
        params: {
            minLat: +(minLat - BBOX_EPS).toFixed(8),
            maxLat: +(maxLat + BBOX_EPS).toFixed(8),
            minLng: +(minLng - BBOX_EPS).toFixed(8),
            maxLng: +(maxLng + BBOX_EPS).toFixed(8),
            ...normFilters,
            displayCurrency,
        },
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
