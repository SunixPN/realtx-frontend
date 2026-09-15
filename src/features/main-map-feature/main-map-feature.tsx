'use client'

import { ReactNode, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MapCanvas, useMap } from '@/shared/map'
import { mapPointsQuery, parseFiltersFromSearchParams } from '@/entities/estate'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { useEstateSelection } from '@/features/estate-drawer-feature'
import { useMapMarkers, type MarkerClickHandlers } from './_hooks/use-map-markers'
import { MapLoadingBadge } from './_ui/map-loading-badge'
import {keepPreviousData} from "@tanstack/query-core";

type MainMapFeatureProps = {
    mapFilter?: () => ReactNode
    drawer?: ReactNode
    drawerOpen?: boolean
}

export default function MainMapFeature({ mapFilter, drawer, drawerOpen = false }: MainMapFeatureProps) {
    const searchParams = useSearchParams()
    const filters = parseFiltersFromSearchParams(searchParams)
    const { currency } = useDisplayCurrency()

    const { data: points = [], isFetching } = useQuery({
        ...mapPointsQuery(filters, currency),
        placeholderData: keepPreviousData
    })

    const map = useMap()
    const { openEstate, openHouse } = useEstateSelection()
    const handlers = useMemo<MarkerClickHandlers>(() => ({
        onEstateClick: openEstate,
        onHouseClick: openHouse,
    }), [openEstate, openHouse])
    useMapMarkers(map, points, handlers)

    return (
        <div className="map-container relative w-full" style={{ height: 'calc(100vh - var(--header-height))' }}>
            {mapFilter && mapFilter()}
            <MapCanvas className="w-full h-full" />
            {isFetching && <MapLoadingBadge drawerOpen={drawerOpen} />}
            {drawer}
        </div>
    )
}
