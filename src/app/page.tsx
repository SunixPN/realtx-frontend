import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { MapProvider } from '@/shared/map'
import MapWidget from '@/widgets/map-widget/map-widget'
import { mapPointsQuery, parseFiltersFromSearchParams } from '@/entities/estate'

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>
}) {
    const params = await searchParams
    const filters = parseFiltersFromSearchParams(new URLSearchParams(params))

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(mapPointsQuery(filters, filters.currency ?? "USD"))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MapProvider>
                <MapWidget />
            </MapProvider>
        </HydrationBoundary>
    )
}
