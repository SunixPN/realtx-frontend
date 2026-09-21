'use client'
import { useEffect, useRef, useState } from 'react'
import { useEstateFilters } from './_hooks/use-estate-filters'
import { useDisplayCurrency } from './_hooks/use-display-currency'
import { FilterBar } from './_ui/filter-bar'
import { FiltersDrawer } from './_ui/filters-drawer'
import {
    useSubscriptions,
    type SearchSubscriptionType,
} from '@/entities/search-subscription'
import { EditSubscriptionDrawer } from '@/features/search-subscription-feature'
import type { MapFiltersType } from '@/entities/estate'
type Props = {
    drawerOpen: boolean
    onToggleDrawer: () => void
    onCloseDrawer: () => void
    total: number
}
type SaveMode =
    | { kind: 'create'; initialFilters: MapFiltersType }
    | { kind: 'edit'; subscription: SearchSubscriptionType }
export default function MainMapFiltersFeature({ drawerOpen, onToggleDrawer, onCloseDrawer, total }: Props) {
    const { filters, setFilters, clearFilters } = useEstateFilters()
    const { currency, setCurrency } = useDisplayCurrency()
    const { data: subscriptions } = useSubscriptions()
    const [savedSubscriptionId, setSavedSubscriptionId] = useState<string | null>(null)
    const [saveMode, setSaveMode] = useState<SaveMode | null>(null)
    const lastSerialized = useRef<string>('')
    useEffect(() => {
        const key = JSON.stringify({ ...filters, currency })
        if (lastSerialized.current === '') {
            lastSerialized.current = key
            return
        }
        if (lastSerialized.current !== key) {
            lastSerialized.current = key
            setSavedSubscriptionId(null)
        }
    }, [filters, currency])
    const handleSaveSearch = () => {
        if (savedSubscriptionId) {
            const found = subscriptions?.find(s => s.id === savedSubscriptionId)
            if (found) {
                setSaveMode({ kind: 'edit', subscription: found })
                return
            }
        }
        setSaveMode({ kind: 'create', initialFilters: { ...filters, currency } })
    }
    return (
        <>
            <div className="absolute top-4 left-4 z-30 max-w-[calc(100%-2rem)]">
                <FilterBar
                    filters={filters}
                    onChange={setFilters}
                    onClear={clearFilters}
                    onOpenDrawer={onToggleDrawer}
                    drawerOpen={drawerOpen}
                    total={total}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    saved={savedSubscriptionId !== null}
                    onSaveSearch={handleSaveSearch}
                />
            </div>
            <FiltersDrawer
                isOpen={drawerOpen}
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
                onClose={onCloseDrawer}
                total={total}
                currency={currency}
                onCurrencyChange={setCurrency}
            />
            <EditSubscriptionDrawer
                isOpen={saveMode !== null}
                mode={saveMode}
                onClose={() => setSaveMode(null)}
                onSaved={s => setSavedSubscriptionId(s.id)}
                onDeleted={id => {
                    if (savedSubscriptionId === id) setSavedSubscriptionId(null)
                }}
            />
        </>
    )
}
