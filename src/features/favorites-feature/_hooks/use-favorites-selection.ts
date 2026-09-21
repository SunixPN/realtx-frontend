'use client'
import { useState, useCallback } from 'react'
export function useFavoritesSelection() {
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const toggle = useCallback((id: number) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])
    const selectAll = useCallback((ids: number[]) => {
        setSelected(new Set(ids))
    }, [])
    const clear = useCallback(() => setSelected(new Set()), [])
    return { selected, toggle, selectAll, clear }
}
