import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { SWRConfig, unstable_serialize } from 'swr'
import {
    subscriptionsKey,
    type SearchSubscriptionType,
} from '@/entities/search-subscription'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import { SubscriptionsWidget } from '@/widgets/subscriptions-widget'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_subscriptions') }
}

export default async function SubscriptionsPage() {
    let fallback: Record<string, unknown> = {}

    try {
        const items = await serverFetch<SearchSubscriptionType[]>(API_ROUTES.SUBSCRIPTIONS.LIST)
        fallback = {
            [unstable_serialize(subscriptionsKey())]: items,
        }
    } catch {
        // Гость / нет токена — клиент подгрузит сам после логина.
    }

    return (
        <SWRConfig value={{ fallback }}>
            <SubscriptionsWidget />
        </SWRConfig>
    )
}
