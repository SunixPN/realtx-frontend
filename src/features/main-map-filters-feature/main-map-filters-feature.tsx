'use client'

import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { mapPointsQuery } from '@/entities/estate'
import { useEstateFilters } from './_hooks/use-estate-filters'
import { useDisplayCurrency } from './_hooks/use-display-currency'
import { FilterBar } from './_ui/filter-bar'
import { FiltersDrawer } from './_ui/filters-drawer'

type Props = {
    drawerOpen: boolean
    onToggleDrawer: () => void
    onCloseDrawer: () => void
}

export default function MainMapFiltersFeature({ drawerOpen, onToggleDrawer, onCloseDrawer }: Props) {
    const { filters, setFilters, clearFilters, isPending } = useEstateFilters()
    const { currency, setCurrency } = useDisplayCurrency()

    const { data: points = [] } = useQuery(mapPointsQuery(filters, currency))

    return (
        <>
            {isPending && (
                <div
                    className="absolute top-4 z-50 flex size-9 items-center justify-center rounded-full border border-border bg-surface-page shadow-lg transition-[right] duration-[320ms]"
                    style={{ right: drawerOpen ? 'calc(420px + 1rem)' : '1rem' }}
                >
                    <Loader2 className="size-4 animate-spin text-brand" aria-label="Загрузка" />
                </div>
            )}

            <div className="absolute top-4 left-4 z-30 max-w-[calc(100%-2rem)]">
                <FilterBar
                    filters={filters}
                    onChange={setFilters}
                    onClear={clearFilters}
                    onOpenDrawer={onToggleDrawer}
                    drawerOpen={drawerOpen}
                    total={points.length}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                />
            </div>

            {/* Drawer рендерится всегда — slide-анимация требует элемент в DOM */}
            <FiltersDrawer
                isOpen={drawerOpen}
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
                onClose={onCloseDrawer}
                total={points.length}
                currency={currency}
                onCurrencyChange={setCurrency}
            />
        </>
    )
}
