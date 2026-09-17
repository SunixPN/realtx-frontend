import { QUERIES } from '@/shared/const/queries'
import type { FavoriteSort } from './favorite-types'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export const favoritesKey = (sort: FavoriteSort = 'recent', currency: DisplayCurrency = 'USD') =>
    [QUERIES.FAVORITES, sort, currency] as const

export const favoriteIdsKey = () => [QUERIES.FAVORITE_IDS] as const

export function isFavoritesKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.FAVORITES
}

export function isFavoriteIdsKey(key: unknown): boolean {
    return Array.isArray(key) && key[0] === QUERIES.FAVORITE_IDS
}

export function isAnyFavoriteKey(key: unknown): boolean {
    return isFavoritesKey(key) || isFavoriteIdsKey(key)
}
