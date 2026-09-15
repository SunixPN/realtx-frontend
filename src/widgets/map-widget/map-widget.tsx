'use client'

import MainMapFeature from '@/features/main-map-feature/main-map-feature'
import MainMapFiltersFeature from '@/features/main-map-filters-feature/main-map-filters-feature'
import { useFiltersDrawer } from '@/features/main-map-filters-feature/_hooks/use-filters-drawer'
import { EstateDrawerFeature, EstateSelectionProvider } from '@/features/estate-drawer-feature'

export default function MapWidget() {
    const drawer = useFiltersDrawer()

    return (
        <EstateSelectionProvider>
            <MainMapFeature
                drawerOpen={drawer.isOpen}
                mapFilter={() => (
                    <MainMapFiltersFeature
                        drawerOpen={drawer.isOpen}
                        onToggleDrawer={drawer.toggle}
                        onCloseDrawer={drawer.close}
                    />
                )}
                drawer={<EstateDrawerFeature />}
            />
        </EstateSelectionProvider>
    )
}
