'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import {
    parseFiltersFromSearchParams,
    serializeFiltersToSearchParams,
    type MapFiltersType,
} from '@/entities/estate'

// URL-параметры, которые не относятся к фильтрам, но должны переживать
// setFilters/clearFilters — режим карты и валюта отображения.
const PRESERVED_PARAMS = ['currency', 'mapMode'] as const

function preserve(source: URLSearchParams, target: URLSearchParams) {
    for (const key of PRESERVED_PARAMS) {
        const v = source.get(key)
        if (v) target.set(key, v)
    }
}

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
            preserve(new URLSearchParams(searchParams.toString()), sp)
            const qs = sp.toString()
            startTransition(() => {
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
            })
        },
        [searchParams, router, pathname]
    )

    const clearFilters = useCallback(() => {
        const sp = new URLSearchParams()
        preserve(new URLSearchParams(searchParams.toString()), sp)
        const qs = sp.toString()
        startTransition(() => {
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
        })
    }, [searchParams, router, pathname])

    return { filters, setFilters, clearFilters, isPending }
}
