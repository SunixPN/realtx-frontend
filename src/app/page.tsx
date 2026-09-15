import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { MapProvider } from '@/shared/map'
import MapWidget from '@/widgets/map-widget/map-widget'
import {
    mapPointsQuery,
    districtProfitabilityQuery,
    districtsGeojsonQuery,
    parseFiltersFromSearchParams,
} from '@/entities/estate'

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>
}) {
    const params = await searchParams
    const filters = parseFiltersFromSearchParams(new URLSearchParams(params))
    const currency = (params.currency ?? 'USD') as 'USD' | 'BYN' | 'EUR'
    const mapMode = params.mapMode === 'heat' ? 'heat' : 'objects'

    const queryClient = new QueryClient()

    if (mapMode === 'heat') {
        await Promise.all([
            queryClient.prefetchQuery(districtProfitabilityQuery(filters, currency)),
            queryClient.prefetchQuery(districtsGeojsonQuery()),
        ])
    } else {
        await queryClient.prefetchQuery(mapPointsQuery(filters, currency))
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MapProvider>
                <MapWidget />
            </MapProvider>
        </HydrationBoundary>
    )
}
