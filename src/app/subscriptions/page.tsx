import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
    subscriptionsKey,
    type SearchSubscriptionType,
} from '@/entities/search-subscription'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { SubscriptionsWidget } from '@/widgets/subscriptions-widget'
import {getQueryClient} from "@/shared/api/query";
import {dehydrate, HydrationBoundary, noop} from "@tanstack/react-query";

export const dynamic = 'force-dynamic'
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_subscriptions') }
}
export default async function SubscriptionsPage() {
    const queryClient = getQueryClient()

    await queryClient.query({
        queryKey: subscriptionsKey(),
        queryFn: () => serverFetch<SearchSubscriptionType[]>(API_ROUTES.SUBSCRIPTIONS.LIST)
    }).catch(noop)

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SubscriptionsWidget />
        </HydrationBoundary>
    )
}
