'use client'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapCanvas, useMap, useViewportHeight } from '@/shared/map'
import {
    useMapPoints,
    useDistrictProfitability,
    useDistrictsGeojson,
    parseFiltersFromSearchParams,
} from '@/entities/estate'
import { useFavoriteIds } from '@/entities/favorite'
import { useAuth } from '@/entities/me/api/auth-query'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useEstateSelection } from '@/features/estate-drawer-feature'
import { useMapMarkers, type MarkerClickHandlers } from './_hooks/use-map-markers'
import { useMapMode } from './_hooks/use-map-mode'
import { useDistrictHeatLayers } from './_hooks/use-district-heat-layers'
import { MapLoadingBadge } from './_ui/map-loading-badge'
import { MapModeToggle } from './_ui/map-mode-toggle'
import { DistrictRanking } from './_ui/district-ranking'
type MainMapFeatureProps = {
    mapFilter?: (ctx: { total: number }) => ReactNode
    drawer?: ReactNode
    drawerOpen?: boolean
}
export default function MainMapFeature({ mapFilter, drawer, drawerOpen = false }: MainMapFeatureProps) {
    useViewportHeight()
    const searchParams = useSearchParams()
    const filters = parseFiltersFromSearchParams(searchParams)
    const { currency } = useDisplayCurrency()
    const { mode, deferredMode, setMode } = useMapMode()
    const map = useMap()
    const { data: points = [], isFetching: fetchingPoints } = useMapPoints(filters, currency)
    const { data: districts = [], isFetching: fetchingDistricts } = useDistrictProfitability(filters, currency, {
        enabled: deferredMode === 'heat',
    })
    const { data: geojson } = useDistrictsGeojson({ enabled: deferredMode === 'heat' })
    const { data: auth } = useAuth()
    const { data: favoriteIdsData } = useFavoriteIds({ enabled: !!auth?.user })
    const favoriteIds = useMemo(
        () => new Set(favoriteIdsData?.ids ?? []),
        [favoriteIdsData],
    )
    const { openEstate, openHouse } = useEstateSelection()
    const handlers = useMemo<MarkerClickHandlers>(() => ({
        onEstateClick: openEstate,
        onHouseClick: openHouse,
    }), [openEstate, openHouse])
    useMapMarkers(deferredMode === 'objects' ? map : null, points, handlers, favoriteIds)
    useDistrictHeatLayers(map, deferredMode, districts, geojson)
    const isFetching = fetchingPoints || fetchingDistricts
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    return (
        <div className="map-container relative w-full" style={{ height: 'calc(var(--app-height, 100dvh) - var(--header-height))' }}>
            {mapFilter && mapFilter({ total: points.length })}
            <div
                className="absolute z-30 left-2 right-2 bottom-2 lg:left-4 lg:right-auto lg:top-20 lg:bottom-auto"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <MapModeToggle mode={mode} onChange={setMode} />
            </div>
            {deferredMode === 'heat' && districts.length > 0 && (
                <div
                    className="absolute z-30 left-2 right-2 bottom-16 lg:left-4 lg:right-auto lg:bottom-6"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    <DistrictRanking districts={districts} />
                </div>
            )}
            <MapCanvas className="w-full h-full" />
            {mounted && isFetching && <MapLoadingBadge drawerOpen={drawerOpen} />}
            {drawer}
        </div>
    )
}
