'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
    const tCommon = useTranslations('common')
    const { filters, setFilters, clearFilters, isPending } = useEstateFilters()
    const { currency, setCurrency } = useDisplayCurrency()

    // Подписки нам нужны только чтобы понять: сохранён ли текущий поиск.
    // Загружаем без принуждения (SWR подтянет фон), но если пользователь
    // не логинен — запрос отвалится и мы просто останемся в состоянии
    // «не сохранено».
    const { data: subscriptions } = useSubscriptions()

    const [savedSubscriptionId, setSavedSubscriptionId] = useState<string | null>(null)
    const [saveMode, setSaveMode] = useState<SaveMode | null>(null)

    // При изменении фильтров/валюты флаг «сохранено» сбрасываем — предположение
    // «этот поиск = сохранённая подписка» перестаёт быть верным.
    // Сравниваем сериализованное представление, чтобы не реагировать на
    // безобидные пересборки объекта.
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
            {isPending && (
                <div
                    className="absolute top-4 z-50 flex size-9 items-center justify-center rounded-full border border-border bg-surface-page shadow-lg transition-[right] duration-[320ms]"
                    style={{ right: drawerOpen ? 'calc(420px + 1rem)' : '1rem' }}
                >
                    <Loader2 className="size-4 animate-spin text-brand" aria-label={tCommon('loading_aria')} />
                </div>
            )}

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
