'use client'
import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import type { DistrictGeoJSONType } from './estate-types'
import { districtsGeojsonKey } from './estate-query-keys'
export { districtsGeojsonKey }
const fetcher = async (): Promise<DistrictGeoJSONType> => {
    const r = await api.get<DistrictGeoJSONType>(API_ROUTES.ESTATE.DISTRICTS_GEOJSON)
    return r.data
}
export function useDistrictsGeojson(options?: { enabled?: boolean }) {
    const enabled = options?.enabled ?? true
    return useSWR<DistrictGeoJSONType>(enabled ? districtsGeojsonKey() : null, fetcher)
}
