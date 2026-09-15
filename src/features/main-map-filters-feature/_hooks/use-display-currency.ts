'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export type DisplayCurrency = 'USD' | 'BYN' | 'EUR'

const STORAGE_KEY = 'realtx.displayCurrency'
const VALID = new Set<DisplayCurrency>(['USD', 'BYN', 'EUR'])
const DEFAULT: DisplayCurrency = 'USD'

/**
 * Валюта отображения — НЕ фильтр. Живёт отдельным query-параметром `?currency=USD`
 * и синхронизируется с localStorage, чтобы после перезагрузки без URL-параметра
 * пользователь видел последний выбранный вариант. Приоритет: URL > localStorage > USD.
 *
 * localStorage читается только в useEffect на клиенте, а первый рендер (в т.ч. SSR)
 * использует URL или DEFAULT — иначе SSR отдаёт USD, а клиент на первом рендере
 * читает BYN из localStorage → hydration mismatch.
 */
export function useDisplayCurrency() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const fromUrl = searchParams.get('currency')?.toUpperCase()
    const urlCurrency = fromUrl && VALID.has(fromUrl as DisplayCurrency) ? (fromUrl as DisplayCurrency) : null

    // Стартуем с URL (или DEFAULT) — так же, как на сервере. После маунта
    // подтягиваем localStorage, если URL-параметра нет.
    const [storedCurrency, setStoredCurrency] = useState<DisplayCurrency | null>(null)

    const currency: DisplayCurrency = urlCurrency ?? storedCurrency ?? DEFAULT

    const setCurrency = useCallback((next: DisplayCurrency) => {
        setStoredCurrency(next)
        const sp = new URLSearchParams(Array.from(searchParams.entries()))
        if (next === DEFAULT) sp.delete('currency')
        else sp.set('currency', next)
        const qs = sp.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [searchParams, router, pathname])

    return { currency, setCurrency }
}
