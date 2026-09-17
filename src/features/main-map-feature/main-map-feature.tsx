'use client'

import { ReactNode, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapCanvas, useMap } from '@/shared/map'
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
    const searchParams = useSearchParams()
    const filters = parseFiltersFromSearchParams(searchParams)
    const { currency } = useDisplayCurrency()
    const { mode, deferredMode, setMode } = useMapMode()

    const map = useMap()

    // Точки на карте — только в режиме объектов. Ключ фильтруем по deferredMode,
    // чтобы клик по табу мгновенно перерисовал сам таб, а SWR-фетч и пересборка
    // маркеров ушли в низкоприоритетную транзицию.
    const { data: points = [], isValidating: fetchingPoints } = useMapPoints(filters, currency, {
        enabled: deferredMode === 'objects',
    })

    // Выгодность районов — только в режиме тепловой карты.
    const { data: districts = [], isValidating: fetchingDistricts } = useDistrictProfitability(filters, currency, {
        enabled: deferredMode === 'heat',
    })

    // GeoJSON полигонов — статичен, грузим один раз при переключении в heat.
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

    // В режиме heat передаём null в useMapMarkers — хук очистит маркеры и source.
    // Читаем deferredMode: пересборка маркеров/heat-слоёв идёт в транзиции, таб не залипает.
    useMapMarkers(deferredMode === 'objects' ? map : null, points, handlers, favoriteIds)

    useDistrictHeatLayers(map, deferredMode, districts, geojson)

    const isFetching = fetchingPoints || fetchingDistricts

    return (
        <div className="map-container relative w-full" style={{ height: 'calc(100vh - var(--header-height))' }}>
            {mapFilter && mapFilter({ total: points.length })}
            <div className="absolute top-20 left-4 z-30">
                <MapModeToggle mode={mode} onChange={setMode} />
            </div>
            {deferredMode === 'heat' && districts.length > 0 && (
                <div className="absolute bottom-6 left-4 z-30">
                    <DistrictRanking districts={districts} />
                </div>
            )}
            <MapCanvas className="w-full h-full" />
            {isFetching && <MapLoadingBadge drawerOpen={drawerOpen} />}
            {drawer}
        </div>
    )
}
