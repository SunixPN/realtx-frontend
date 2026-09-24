import { QUERIES } from '@/shared/const/queries'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export const compareKey = (currency: DisplayCurrency = 'USD') =>
    [QUERIES.COMPARE, currency] as const

export const compareIdsKey = () => [QUERIES.COMPARE_IDS] as const

export const comparePreferencesKey = () => [QUERIES.COMPARE_PREFERENCES] as const

export function isCompareKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.COMPARE
}
export function isCompareIdsKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.COMPARE_IDS
}
