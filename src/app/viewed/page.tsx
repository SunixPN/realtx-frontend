import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
    viewedKey,
    viewedIdsKey,
    type ViewedItemType,
    type ViewedIdsType,
} from '@/entities/viewed'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { ViewedWidget } from '@/widgets/viewed-widget'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { getQueryClient } from '@/shared/api/query'
import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_viewed') }
}

const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

export default async function ViewedPage({
    searchParams,
}: {
    searchParams: Promise<{ currency?: string }>
}) {
    const { currency: currParam } = await searchParams
    const up = currParam?.toUpperCase() as DisplayCurrency | undefined
    const currency: DisplayCurrency = up && VALID_CURRENCIES.includes(up) ? up : 'USD'

    const queryClient = getQueryClient()

    await queryClient.query({
        queryKey: viewedKey(currency),
        queryFn: () => serverFetch<ViewedItemType[]>(API_ROUTES.VIEWED.LIST, { displayCurrency: currency }),
    }).catch(noop)

    await queryClient.query({
        queryKey: viewedIdsKey(),
        queryFn: () => serverFetch<ViewedIdsType>(API_ROUTES.VIEWED.IDS),
    }).catch(noop)

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ViewedWidget />
        </HydrationBoundary>
    )
}
