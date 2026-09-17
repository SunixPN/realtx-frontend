import { PRICE_CURRENCY_LABELS } from '@/entities/estate'

export function formatNumber(n: number): string {
    return Math.round(n).toLocaleString()
}

/** Только цифры — символ валюты рендерится отдельно через <PriceDisplay>. */
export function formatPriceNum(price: number | null): string {
    if (price == null) return '—'
    return formatNumber(price)
}

export function formatStorey(s: number | null, total: number | null): string {
    if (s == null && total == null) return '—'
    return `${s ?? '—'} / ${total ?? '—'}`
}

/** Для строк-только контекстов (title и т.п.). BYN → «Br». */
export function formatPriceStr(price: number | null, currency: number | null): string {
    if (price == null) return '—'
    const sym = currency === 933 ? 'Br' : (currency !== null ? (PRICE_CURRENCY_LABELS[currency] ?? '') : '')
    return `${formatNumber(price)} ${sym}`.trim()
}

