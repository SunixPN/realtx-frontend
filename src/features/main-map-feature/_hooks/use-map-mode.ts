'use client'

import { useCallback, useTransition } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export type MapMode = 'objects' | 'heat'

export function useMapMode() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const mode = (searchParams.get('mapMode') as MapMode | null) ?? 'objects'

    const setMode = useCallback(
        (newMode: MapMode) => {
            const sp = new URLSearchParams(searchParams.toString())
            if (newMode === 'objects') {
                sp.delete('mapMode')
            } else {
                sp.set('mapMode', newMode)
            }
            const qs = sp.toString()
            startTransition(() => {
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
            })
        },
        [searchParams, router, pathname],
    )

    return { mode, setMode, isPending }
}
