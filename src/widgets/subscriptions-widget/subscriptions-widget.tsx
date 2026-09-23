'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    useSubscriptions,
    type SearchSubscriptionType,
} from '@/entities/search-subscription'
import type { MapFiltersType } from '@/entities/estate'
import {
    EditSubscriptionDrawer,
    SubscriptionRow,
    SubscriptionsEmpty,
    SubscriptionsHeader,
} from '@/features/search-subscription-feature'
type Mode =
    | { kind: 'create'; initialFilters: MapFiltersType }
    | { kind: 'edit'; subscription: SearchSubscriptionType }
export function SubscriptionsWidget() {
    const t = useTranslations('subscriptions')
    const { data: items = [], isLoading } = useSubscriptions()
    const [mode, setMode] = useState<Mode | null>(null)
    const openCreate = () => setMode({ kind: 'create', initialFilters: {} })
    const openEdit = (s: SearchSubscriptionType) => setMode({ kind: 'edit', subscription: s })

    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-4 px-3 py-3 sm:px-4 md:gap-6 md:px-6 md:py-6">
            <header className="flex flex-col items-stretch gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:pb-5">
                <SubscriptionsHeader items={items} onCreate={openCreate} />
            </header>
            {items.length === 0 && !isLoading ? (
                <SubscriptionsEmpty />
            ) : (
                <ul className="flex flex-col gap-2 sm:gap-3">
                    {items.map(s => (
                        <li key={s.id}>
                            <SubscriptionRow subscription={s} onEdit={openEdit} />
                        </li>
                    ))}
                </ul>
            )}
            <footer className="rounded-lg border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-muted sm:p-4">
                {t('footer_disclaimer')}
            </footer>
            <EditSubscriptionDrawer
                isOpen={mode !== null}
                mode={mode}
                onClose={() => setMode(null)}
            />
        </div>
    )
}
