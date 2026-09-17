'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { PriceChange, PriceHistoryPoint } from '@/entities/estate'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { PriceChangeBadge } from './price-change-badge'
import { PriceHistoryChart } from './price-history-chart'

type Props = {
    history: PriceHistoryPoint[]
    priceChange: PriceChange | null
    currency: DisplayCurrency
}

export function PriceHistorySection({ history, priceChange, currency }: Props) {
    const t = useTranslations('estate')
    const locale = useLocale()

    if (history.length < 2) return null

    const firstDate = history[0]?.date
    const formattedDate = firstDate
        ? new Date(firstDate).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null

    return (
        <section className="flex flex-col gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
            <div>
                <h3 className="text-base font-semibold text-[var(--text-base)]">{t('price_history_title')}</h3>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                    {t('price_history_note')}
                    {formattedDate && t('price_history_since', { date: formattedDate })}
                </p>
            </div>

            {priceChange && (
                <PriceChangeBadge change={priceChange} currency={currency} variant="full" />
            )}

            <PriceHistoryChart history={history} currency={currency} />
        </section>
    )
}
