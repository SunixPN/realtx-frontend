import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SWRConfig, unstable_serialize } from 'swr'
import { getTranslations } from 'next-intl/server'
import { estateByIdKey, type EstateType } from '@/entities/estate'
import { PropertyDetailWidget } from '@/widgets/property-detail-widget/property-detail-widget'
import { API_ROUTES } from '@/shared/const/api-routes'
import { serverFetch } from '@/shared/api/server-fetch'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
type RouteParams = { id: string }
type RouteSearch = { currency?: string }
const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']
function resolveCurrency(raw: string | undefined): DisplayCurrency {
    const up = raw?.toUpperCase()
    return VALID_CURRENCIES.includes(up as DisplayCurrency) ? (up as DisplayCurrency) : 'USD'
}
function fetchEstate(id: number, currency: DisplayCurrency) {
    return serverFetch<EstateType>(API_ROUTES.ESTATE.BY_ID(id), { displayCurrency: currency })
}
export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<RouteParams>
    searchParams: Promise<RouteSearch>
}): Promise<Metadata> {
    const t = await getTranslations('estate')
    const { id } = await params
    const { currency: cur } = await searchParams
    const numId = Number(id)
    if (!Number.isFinite(numId)) return { title: t('property_not_found_title') }
    try {
        const currency = resolveCurrency(cur)
        const estate = await fetchEstate(numId, currency)
        const rooms = estate.rooms ? t('property_meta_rooms', { n: estate.rooms }) : t('property_meta_flat')
        const addr = estate.address ?? t('default_town')
        return {
            title: `${rooms} · ${addr} — RealtX`,
            description: estate.description ?? undefined,
        }
    } catch {
        return { title: t('property_not_found_title') }
    }
}
export default async function PropertyPage({
    params,
    searchParams,
}: {
    params: Promise<RouteParams>
    searchParams: Promise<RouteSearch>
}) {
    const { id } = await params
    const { currency: cur } = await searchParams
    const numId = Number(id)
    if (!Number.isFinite(numId)) notFound()
    const currency = resolveCurrency(cur)
    let estate: EstateType
    try {
        estate = await fetchEstate(numId, currency)
    } catch {
        notFound()
    }
    const fallback = {
        [unstable_serialize(estateByIdKey(numId, currency))]: estate!,
    }
    return (
        <SWRConfig value={{ fallback }}>
            <div className="min-h-screen bg-surface-subtle">
                <PropertyDetailWidget id={numId} />
            </div>
        </SWRConfig>
    )
}
