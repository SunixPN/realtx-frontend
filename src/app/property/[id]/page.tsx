import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { estateByIdQuery, type EstateType } from '@/entities/estate'
import { PropertyDetailWidget } from '@/widgets/property-detail-widget/property-detail-widget'
import type { DisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'

type RouteParams = { id: string }
type RouteSearch = { currency?: string }

const VALID_CURRENCIES: DisplayCurrency[] = ['USD', 'BYN', 'EUR']

function resolveCurrency(raw: string | undefined): DisplayCurrency {
    const up = raw?.toUpperCase()
    return VALID_CURRENCIES.includes(up as DisplayCurrency) ? (up as DisplayCurrency) : 'USD'
}

// Заголовок вкладки/шеринга — данные уже в кэше QueryClient'а из prefetch'а
// на странице, поэтому дублирующий getQueryData возьмёт из памяти.
export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<RouteParams>
    searchParams: Promise<RouteSearch>
}): Promise<Metadata> {
    const { id } = await params
    const { currency: cur } = await searchParams
    const numId = Number(id)
    if (!Number.isFinite(numId)) return { title: 'Объект не найден — RealtX' }

    const currency = resolveCurrency(cur)
    const qc = new QueryClient()
    try {
        await qc.prefetchQuery(estateByIdQuery(numId, currency))
    } catch {
        return { title: 'Объект не найден — RealtX' }
    }
    const estate = qc.getQueryData<EstateType>(estateByIdQuery(numId, currency).queryKey)
    if (!estate) return { title: 'Объект не найден — RealtX' }

    const rooms = estate.rooms ? `${estate.rooms}-комн` : 'квартира'
    const addr = estate.address ?? 'Минск'
    return {
        title: `${rooms} · ${addr} — RealtX`,
        description: estate.description ?? undefined,
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
    const queryClient = new QueryClient()
    try {
        await queryClient.prefetchQuery(estateByIdQuery(numId, currency))
    } catch {
        notFound()
    }

    const estate = queryClient.getQueryData<EstateType>(estateByIdQuery(numId, currency).queryKey)
    if (!estate) notFound()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-surface-subtle">
                <PropertyDetailWidget id={numId} />
            </div>
        </HydrationBoundary>
    )
}
