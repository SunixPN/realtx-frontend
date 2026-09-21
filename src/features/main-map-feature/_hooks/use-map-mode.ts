'use client'
import { useCallback, useDeferredValue, useEffect, useState } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
export type MapMode = 'objects' | 'heat'

export function useMapMode() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const initial = (searchParams.get('mapMode') as MapMode | null) ?? 'objects'
    const [mode, setModeState] = useState<MapMode>(initial)
    const deferredMode = useDeferredValue(mode)
    useEffect(() => {
        const urlMode = (searchParams.get('mapMode') as MapMode | null) ?? 'objects'
        if (urlMode !== mode) setModeState(urlMode)
    }, [searchParams])
    const setMode = useCallback(
        (next: MapMode) => {
            setModeState(next)
            const sp = new URLSearchParams(searchParams.toString())
            if (next === 'objects') sp.delete('mapMode')
            else sp.set('mapMode', next)
            const qs = sp.toString()
            window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
        },
        [searchParams, pathname],
    )
    return { mode, deferredMode, setMode }
}
