import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { dehydrate, HydrationBoundary, noop } from '@tanstack/react-query'
import { SWRConfig, unstable_serialize } from 'swr'
import {
    compareKey,
    compareIdsKey,
    comparePreferencesKey,
    type CompareListType,
    type CompareIdsType,
    type ComparePreferencesType,
} from '@/entities/compare'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { getQueryClient } from '@/shared/api/query'
import { CompareWidget } from '@/widgets/compare-widget'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_compare') }
}

const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ currency?: string }>
}) {
    const { currency: currParam } = await searchParams
    const up = currParam?.toUpperCase() as DisplayCurrency | undefined
    const currency: DisplayCurrency = up && VALID_CURRENCIES.includes(up) ? up : 'USD'

    const queryClient = getQueryClient()

    await queryClient.query({
        queryKey: compareKey(currency),
        queryFn: () => serverFetch<CompareListType>(API_ROUTES.COMPARE.LIST, { displayCurrency: currency }),
    }).catch(noop)

    await queryClient.query({
        queryKey: compareIdsKey(),
        queryFn: () => serverFetch<CompareIdsType>(API_ROUTES.COMPARE.IDS),
    }).catch(noop)

    const prefs = await serverFetch<ComparePreferencesType>(API_ROUTES.COMPARE.PREFERENCES).catch(() => null)

    const fallback: Record<string, unknown> = {}
    if (prefs) {
        fallback[unstable_serialize(comparePreferencesKey())] = prefs
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SWRConfig value={{ fallback }}>
                <CompareWidget />
            </SWRConfig>
        </HydrationBoundary>
    )
}
