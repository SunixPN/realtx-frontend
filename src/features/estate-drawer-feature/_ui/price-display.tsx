'use client'

import { useTranslations } from 'next-intl'
import { BynSign } from '@/shared/ui/byn-sign/byn-sign'
import { formatNumber } from './format'

// 'USD'|'BYN'|'EUR' → числовой ISO 4217 (как хранится в entity)
const ALPHA_TO_NUM: Record<string, number> = { USD: 840, BYN: 933, EUR: 978 }

type Props = {
    price: number | null
    /** Выбранная валюта отображения: 'USD'|'BYN'|'EUR' (из useDisplayCurrency). */
    currency: string
    className?: string
}

/**
 * Цена с символом ВЫБРАННОЙ валюты (не оригинальной из объявления).
 * BYN — через <BynSign>, чтобы шрифт nbrb применился корректно.
 */
export function PriceDisplay({ price, currency, className }: Props) {
    if (price == null) return <span className={className}>—</span>

    const formatted = formatNumber(price)
    const code = ALPHA_TO_NUM[currency] ?? null

    if (code === 933) {
        return (
            <span className={className}>
                {formatted}<BynSign />
            </span>
        )
    }

    const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency
    return (
        <span className={className}>
            {formatted} {sym}
        </span>
    )
}

export function PricePerM2Display({ price, currency, className }: Props) {
    const t = useTranslations('estate')
    if (price == null) return <span className={className}>—</span>
    return (
        <span className={className}>
            <PriceDisplay price={Math.round(price)} currency={currency} /> {t('per_m2_suffix')}
        </span>
    )
}
