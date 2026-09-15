import { PRICE_CURRENCY_LABELS } from '@/entities/estate'

export function formatNumber(n: number): string {
    return Math.round(n).toLocaleString('ru-RU')
}

/** Только цифры — символ валюты рендерится отдельно через <PriceDisplay>. */
export function formatPriceNum(price: number | null): string {
    if (price == null) return '—'
    return formatNumber(price)
}

export function formatRooms(rooms: number | null): string {
    if (rooms == null) return '—'
    if (rooms >= 5) return '5+ комн'
    return `${rooms} комн`
}

export function formatArea(v: number | null): string {
    if (v == null) return '—'
    return `${v} м²`
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

export function formatPricePerM2Str(v: number | null, currency: number | null): string {
    if (v == null) return '—'
    return `${formatPriceStr(Math.round(v), currency)} / м²`
}
