'use client'
import { useEffect } from 'react'
import { useMap, easeToWithOffset } from '@/shared/map'
import { useIsMobile } from '@/shared/hooks/use-is-mobile'
import { useEstateSelection } from './_hooks/use-estate-selection'
import { DrawerShell, DRAWER_WIDTH_PX } from './_ui/drawer-shell'
import { EstateDetailView } from './_ui/estate-detail-view'
import { HouseListView } from './_ui/house-list-view'

export function EstateDrawerFeature() {
    const map = useMap()
    const isMobile = useIsMobile()
    const { stack, top, isOpen, openEstate, back, close } = useEstateSelection()
    const showBack = stack.length > 1
    useEffect(() => {
        if (!map || !top) return
        easeToWithOffset(map, top.center, {
            rightPanelPx: isMobile ? 0 : DRAWER_WIDTH_PX,
            bottomPanelPx: isMobile ? Math.round(window.innerHeight * 0.55) : 0,
        })
    }, [map, top, isMobile])
    return (
        <DrawerShell open={isOpen} onClose={close}>
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
