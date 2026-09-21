'use client'
import { useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import {
    parseFiltersFromSearchParams,
    serializeFiltersToSearchParams,
    type MapFiltersType,
} from '@/entities/estate'

const PRESERVED_PARAMS = ['currency', 'mapMode'] as const
function preserve(source: URLSearchParams, target: URLSearchParams) {
    for (const key of PRESERVED_PARAMS) {
        const v = source.get(key)
        if (v) target.set(key, v)
    }
}

function writeUrl(pathname: string, sp: URLSearchParams) {
    const qs = sp.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    window.history.replaceState(null, '', url)
}
export function useEstateFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const filters = parseFiltersFromSearchParams(searchParams)
    const setFilters = useCallback(
        (updater: MapFiltersType | ((prev: MapFiltersType) => MapFiltersType)) => {
            const current = parseFiltersFromSearchParams(searchParams)
            const next = typeof updater === 'function' ? updater(current) : updater
            const sp = serializeFiltersToSearchParams(next)
            preserve(new URLSearchParams(searchParams.toString()), sp)
            writeUrl(pathname, sp)
        },
        [searchParams, pathname]
    )
    const clearFilters = useCallback(() => {
        const sp = new URLSearchParams()
        preserve(new URLSearchParams(searchParams.toString()), sp)
        writeUrl(pathname, sp)
    }, [searchParams, pathname])
    return { filters, setFilters, clearFilters, isPending: false }
}
