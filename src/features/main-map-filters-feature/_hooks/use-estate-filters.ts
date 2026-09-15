'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import {
    parseFiltersFromSearchParams,
    serializeFiltersToSearchParams,
    type MapFiltersType,
} from '@/entities/estate'

export function useEstateFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    // isPending = идёт SSR-навигация после router.replace (сервер догружает данные для новых фильтров)
    const [isPending, startTransition] = useTransition()

    const filters = parseFiltersFromSearchParams(searchParams)

    const setFilters = useCallback(
        (updater: MapFiltersType | ((prev: MapFiltersType) => MapFiltersType)) => {
            const current = parseFiltersFromSearchParams(searchParams)
            const next = typeof updater === 'function' ? updater(current) : updater
            const sp = serializeFiltersToSearchParams(next)
            const currencyParam = searchParams.get('currency')
            if (currencyParam) sp.set('currency', currencyParam)
            const qs = sp.toString()
            startTransition(() => {
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
            })
        },
        [searchParams, router, pathname]
    )

    const clearFilters = useCallback(() => {
        startTransition(() => {
            router.replace(pathname, { scroll: false })
        })
    }, [router, pathname])

    return { filters, setFilters, clearFilters, isPending }
}
