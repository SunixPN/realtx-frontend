import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
import {getQueryClient} from "@/shared/api/query";
import {dehydrate, HydrationBoundary, noop} from "@tanstack/react-query";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_favorites') }
}

const VALID_SORTS = new Set<FavoriteSort>(['recent', 'price-drop', 'price-asc'])
const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

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

    const queryClient = getQueryClient()

    await queryClient.query({
        queryKey: favoritesKey(sort, currency),
        queryFn: () => serverFetch<FavoriteItemType[]>(API_ROUTES.FAVORITES.LIST, { sort, displayCurrency: currency })
    }).catch(noop)

    await queryClient.query({
        queryKey: favoriteIdsKey(),
        queryFn: () => serverFetch<FavoriteIdsType>(API_ROUTES.FAVORITES.IDS)
    }).catch(noop)

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <FavoritesWidget />
        </HydrationBoundary>

    )
}
