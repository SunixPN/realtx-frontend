import { SWRConfig, unstable_serialize } from 'swr'
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

    let fallback: Record<string, unknown> = {}

    try {
        if (mapMode === 'heat') {
            const [districts, geojson] = await Promise.all([
                serverFetch<DistrictProfitabilityType[]>(
                    API_ROUTES.ESTATE.DISTRICT_PROFITABILITY,
                    qs,
                ),
                serverFetch<DistrictGeoJSONType>(API_ROUTES.ESTATE.DISTRICTS_GEOJSON),
            ])
            fallback = {
                [unstable_serialize(districtProfitabilityKey(filters, currency))]: districts,
                [unstable_serialize(districtsGeojsonKey())]: geojson,
            }
        } else {
            const points = await serverFetch<EstateMapPointType[]>(
                API_ROUTES.ESTATE.MAP_POINTS,
                qs,
            )
            fallback = {
                [unstable_serialize(mapPointsKey(filters, currency))]: points,
            }
        }
    } catch (e) {
        console.error('[SSR map-points] prefetch failed:', e)
    }

    return (
        <SWRConfig value={{ fallback }}>
            <MapProvider>
                <MapWidget />
            </MapProvider>
        </SWRConfig>
    )
}
