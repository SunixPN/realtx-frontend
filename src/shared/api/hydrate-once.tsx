'use client'
import { useMemo, type ReactNode } from 'react'
import { HydrationBoundary, useQueryClient, type DehydratedState } from '@tanstack/react-query'

// Серверный префетч — только стартовые данные. Next повторно рендерит RSC
// страницы, например когда серверный экшен ставит cookie (обновление access-токена).
// Серверный fetch при этом отдаёт закэшированный (revalidate) ответ, но с новым
// dataUpdatedAt, и обычный HydrationBoundary затирал им более свежие клиентские
// данные. Поэтому гидратируем только запросы, которых в клиентском кэше ещё нет.
export function HydrateOnce({ state, children }: { state: DehydratedState; children: ReactNode }) {
    const queryClient = useQueryClient()
    const fresh = useMemo<DehydratedState>(() => ({
        ...state,
        queries: state.queries.filter(q => queryClient.getQueryData(q.queryKey) === undefined),
    }), [state, queryClient])
    return <HydrationBoundary state={fresh}>{children}</HydrationBoundary>
}
