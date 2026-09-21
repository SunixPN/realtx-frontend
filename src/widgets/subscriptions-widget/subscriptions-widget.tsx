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
    const { data: items = [] } = useSubscriptions()
    const [mode, setMode] = useState<Mode | null>(null)
    const openCreate = () => setMode({ kind: 'create', initialFilters: {} })
    const openEdit = (s: SearchSubscriptionType) => setMode({ kind: 'edit', subscription: s })
    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-6 py-6">
            <header className="flex items-end justify-between gap-6 border-b border-border pb-5">
                <SubscriptionsHeader items={items} onCreate={openCreate} />
            </header>
            {items.length === 0 ? (
                <SubscriptionsEmpty />
            ) : (
                <ul className="flex flex-col gap-3">
                    {items.map(s => (
                        <li key={s.id}>
                            <SubscriptionRow subscription={s} onEdit={openEdit} />
                        </li>
                    ))}
                </ul>
            )}
            <footer className="rounded-lg border border-border bg-surface-subtle p-4 text-xs leading-relaxed text-text-muted">
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
