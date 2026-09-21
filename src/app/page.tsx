import { MapProvider } from '@/shared/map'
import MapWidget from '@/widgets/map-widget/map-widget'
import {
    mapPointsKey,
    districtProfitabilityKey,
    districtsGeojsonKey,
    parseFiltersFromSearchParams,
    normalizeFilters,
    type EstateMapPointType,
    type DistrictProfitabilityType,
    type DistrictGeoJSONType,
} from '@/entities/estate'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { getQueryClient } from '@/shared/api/query'
import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query'

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>
}) {
    const params = await searchParams
    const filters = parseFiltersFromSearchParams(new URLSearchParams(params))
    const currency = (params.currency ?? 'USD') as 'USD' | 'BYN' | 'EUR'
    const mapMode = params.mapMode === 'heat' ? 'heat' : 'objects'
    const normFilters = normalizeFilters(filters)
    const qs = new URLSearchParams()
    qs.set('displayCurrency', currency)
    for (const [k, v] of Object.entries(normFilters)) {
        if (Array.isArray(v)) v.forEach((item) => qs.append(k, String(item)))
        else qs.set(k, String(v))
    }

    const isDefault = Object.keys(normFilters).length === 0 && currency === 'USD'
    const fetchOptions = isDefault
        ? { revalidate: 60 * 60 * 2, skipAuth: true }
        : undefined

    const queryClient = getQueryClient()

    if (mapMode === 'heat') {
        await Promise.all([
            queryClient.query({
                queryKey: mapPointsKey(filters, currency),
                queryFn: () =>
                    serverFetch<EstateMapPointType[]>(API_ROUTES.ESTATE.MAP_POINTS, qs, fetchOptions),
            }).catch(noop),
            queryClient.query({
                queryKey: districtProfitabilityKey(filters, currency),
                queryFn: () =>
                    serverFetch<DistrictProfitabilityType[]>(
                        API_ROUTES.ESTATE.DISTRICT_PROFITABILITY,
                        qs,
                        fetchOptions,
                    ),
            }).catch(noop),
            queryClient.query({
                queryKey: districtsGeojsonKey(),
                queryFn: () =>
                    serverFetch<DistrictGeoJSONType>(
                        API_ROUTES.ESTATE.DISTRICTS_GEOJSON,
                        undefined,
                        { revalidate: 60 * 60 * 2, skipAuth: true },
                    ),
            }).catch(noop),
        ])
    } else {
        await queryClient.query({
            queryKey: mapPointsKey(filters, currency),
            queryFn: () =>
                serverFetch<EstateMapPointType[]>(API_ROUTES.ESTATE.MAP_POINTS, qs, fetchOptions),
        }).catch(noop)
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MapProvider>
                <MapWidget />
            </MapProvider>
        </HydrationBoundary>
    )
}
