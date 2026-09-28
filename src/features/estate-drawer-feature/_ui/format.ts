import { PRICE_CURRENCY_LABELS } from '@/entities/estate'
const NUMBER_FORMATTER = new Intl.NumberFormat('ru-RU')
export function formatNumber(n: number): string {
    return NUMBER_FORMATTER.format(Math.round(n))
}
export function formatPriceNum(price: number | null): string {
    if (price == null) return '—'
    return formatNumber(price)
}
export function formatStorey(s: number | null, total: number | null): string {
    if (s == null && total == null) return '—'
    return `${s ?? '—'} / ${total ?? '—'}`
}
export function formatPriceStr(price: number | null, currency: number | null): string {
    if (price == null) return '—'
    const sym = currency === 933 ? 'Br' : (currency !== null ? (PRICE_CURRENCY_LABELS[currency] ?? '') : '')
    return `${formatNumber(price)} ${sym}`.trim()
}
