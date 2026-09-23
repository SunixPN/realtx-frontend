import { QUERIES } from '@/shared/const/queries'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export const viewedKey = (currency: DisplayCurrency = 'USD') =>
    [QUERIES.VIEWED, currency] as const
export const viewedIdsKey = () => [QUERIES.VIEWED_IDS] as const

export function isViewedKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.VIEWED
}
export function isViewedIdsKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.VIEWED_IDS
}
export function isAnyViewedKey(key: unknown): boolean {
    return isViewedKey(key) || isViewedIdsKey(key)
}
