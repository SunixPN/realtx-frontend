import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SWRConfig, unstable_serialize } from 'swr'
import {
    favoritesKey,
    favoriteIdsKey,
    type FavoriteItemType,
    type FavoriteIdsType,
    type FavoriteSort,
} from '@/entities/favorite'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { FavoritesWidget } from '@/widgets/favorites-widget'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_favorites') }
}

const VALID_SORTS = new Set<FavoriteSort>(['recent', 'price-drop', 'price-asc'])
const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

function FavoritesPageSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-6 py-6">
            <div className="h-14 border-b border-border pb-5" />
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-surface-muted" />
                ))}
            </div>
        </div>
    )
}

export default async function FavoritesPage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string; currency?: string }>
}) {
    const { sort: sortParam, currency: currParam } = await searchParams

    const sort: FavoriteSort = VALID_SORTS.has(sortParam as FavoriteSort)
        ? (sortParam as FavoriteSort)
        : 'recent'

    const up = currParam?.toUpperCase() as DisplayCurrency | undefined
    const currency: DisplayCurrency = up && VALID_CURRENCIES.includes(up) ? up : 'USD'

    let fallback: Record<string, unknown> = {}

    try {
        const [favorites, ids] = await Promise.all([
            serverFetch<FavoriteItemType[]>(API_ROUTES.FAVORITES.LIST, { sort, displayCurrency: currency }),
            serverFetch<FavoriteIdsType>(API_ROUTES.FAVORITES.IDS),
        ])

        fallback = {
            [unstable_serialize(favoritesKey(sort, currency))]: favorites,
            [unstable_serialize(favoriteIdsKey())]: ids,
        }
    } catch {
        // prefetch failed — client загрузит данные сам
    }

    return (
        <SWRConfig value={{ fallback }}>
            <FavoritesWidget />
        </SWRConfig>
    )
}
