'use client'

import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { PriceChange } from '@/entities/estate'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { formatNumber } from './format'

function pickDelta(change: PriceChange, currency: DisplayCurrency): number | null {
    return currency === 'USD' ? change.deltaUsd
         : currency === 'BYN' ? change.deltaByn
         : change.deltaEur
}

function pickPct(change: PriceChange, currency: DisplayCurrency): number | null {
    return currency === 'USD' ? change.deltaPctUsd
         : currency === 'BYN' ? change.deltaPctByn
         : change.deltaPctEur
}

function DeltaValue({ v, currency }: { v: number; currency: DisplayCurrency }) {
    const abs = Math.abs(v)
    const sign = v < 0 ? '−' : '+'
    const n = formatNumber(abs)
    if (currency === 'BYN') return <>{sign}{n} <BynSign /></>
    const sym = currency === 'USD' ? '$' : '€'
    return <>{sign}{n} {sym}</>
}

function formatPct(pct: number): string {
    const sign = pct < 0 ? '−' : '+'
    return `${sign}${Math.abs(pct).toFixed(1).replace('.', ',')} %`
}

type Props = {
    change: PriceChange
    currency: DisplayCurrency
    variant?: 'compact' | 'full'
}

export function PriceChangeBadge({ change, currency, variant = 'compact' }: Props) {
    const t = useTranslations('estate')
    const delta = pickDelta(change, currency)
    const pct = pickPct(change, currency)
    if (delta === null && pct === null) return null

    const dir = pct !== null ? pct : delta ?? 0
    const isZero = (delta === null || delta === 0) && (pct === null || pct === 0)
    const down = dir < 0
    const Icon = isZero ? Minus : down ? TrendingDown : TrendingUp

    if (variant === 'compact') {
        if (isZero) return null
        return (
            <span
                className={[
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                    down
                        ? 'border-[var(--success-100,#bbf7d0)] bg-[var(--success-50,#f0fdf4)] text-[var(--success-700,#15803d)]'
                        : 'border-[var(--danger-100,#fecdd3)] bg-[var(--danger-50,#fff1f2)] text-[var(--danger-700,#be123c)]',
                ].join(' ')}
            >
                <Icon className="size-3" aria-hidden />
                <span className="tabular-nums">
                    {pct !== null ? formatPct(pct) : (delta !== null ? <DeltaValue v={delta} currency={currency} /> : null)}
                </span>
            </span>
        )
    }

    const tone = isZero
        ? {
              wrap: 'border-[var(--border-default)] bg-[var(--surface-muted)]',
              icon: 'text-[var(--text-faint)]',
              text: 'text-[var(--text-muted)]',
          }
        : down
          ? {
                wrap: 'border-[var(--success-100,#bbf7d0)] bg-[var(--success-50,#f0fdf4)]',
                icon: 'text-[var(--success-600,#16a34a)]',
                text: 'text-[var(--success-700,#15803d)]',
            }
          : {
                wrap: 'border-[var(--danger-100,#fecdd3)] bg-[var(--danger-50,#fff1f2)]',
                icon: 'text-[var(--danger-600,#dc2626)]',
                text: 'text-[var(--danger-700,#be123c)]',
            }

    return (
        <div className={`flex items-center gap-2.5 rounded-md border px-3 py-2 ${tone.wrap}`}>
            <Icon className={`size-5 shrink-0 ${tone.icon}`} aria-hidden />
            <div>
                <div className={`text-base font-semibold tabular-nums ${tone.text}`}>
                    {isZero ? (
                        t('price_no_change')
                    ) : (
                        <>
                            {delta !== null && <DeltaValue v={delta} currency={currency} />}
                            {pct !== null && <> ({formatPct(pct)})</>}
                        </>
                    )}
                </div>
                <div className="text-xs text-[var(--text-faint)]">
                    {t('price_changes_count', { count: change.changes })}
                </div>
            </div>
        </div>
    )
}
