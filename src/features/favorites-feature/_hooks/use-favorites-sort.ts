'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { FavoriteSort } from '@/entities/favorite'

const VALID_SORTS = new Set<FavoriteSort>(['recent', 'price-drop', 'price-asc'])
const DEFAULT_SORT: FavoriteSort = 'recent'

export function useFavoritesSort() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const raw = searchParams.get('sort') as FavoriteSort | null
    const sort: FavoriteSort = raw && VALID_SORTS.has(raw) ? raw : DEFAULT_SORT

    const setSort = useCallback((next: FavoriteSort) => {
        const p = new URLSearchParams(searchParams.toString())
        if (next === DEFAULT_SORT) {
            p.delete('sort')
        } else {
            p.set('sort', next)
        }
        router.replace(`${pathname}?${p.toString()}`, { scroll: false })
    }, [searchParams, router, pathname])

    return { sort, setSort }
}
