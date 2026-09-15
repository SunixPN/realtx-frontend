'use client'

import { useEffect } from 'react'
import { useMap, easeToWithOffset } from '@/shared/map'
import { useEstateSelection } from './_hooks/use-estate-selection'
import { DrawerShell, DRAWER_WIDTH_PX } from './_ui/drawer-shell'
import { EstateDetailView } from './_ui/estate-detail-view'
import { HouseListView } from './_ui/house-list-view'

/**
 * Смонтированный поверх карты drawer. Читает selection из контекста
 * и рендерит либо деталку, либо список квартир в доме. Клик по маркеру
 * с карты (use-map-markers) вызывает openEstate/openHouse из контекста.
 */
export function EstateDrawerFeature() {
    const map = useMap()
    const { stack, top, isOpen, openEstate, back, close } = useEstateSelection()
    const showBack = stack.length > 1


    useEffect(() => {
        if (!map || !top) return
        easeToWithOffset(map, top.center, { rightPanelPx: DRAWER_WIDTH_PX })
    }, [map, top])

    return (
        <DrawerShell open={isOpen}>
            {top?.kind === 'estate' && (
                <EstateDetailView
                    id={top.id}
                    onBack={back}
                    onClose={close}
                    showBack={showBack}
                />
            )}
            {top?.kind === 'house' && (
                <HouseListView
                    bbox={top.bbox}
                    onSelect={(id, center) => openEstate(id, center)}
                    onClose={close}
                />
            )}
        </DrawerShell>
    )
}
