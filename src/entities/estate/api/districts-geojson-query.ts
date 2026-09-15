import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import type { DistrictGeoJSONType } from './estate-types'

export const districtsGeojsonQuery = () =>
    queryOptions({
        queryKey: [QUERIES.DISTRICTS_GEOJSON],
        queryFn: async () => {
            const r = await api.get<DistrictGeoJSONType>(API_ROUTES.ESTATE.DISTRICTS_GEOJSON)
            return r.data
        },
        staleTime: Infinity,
    })
