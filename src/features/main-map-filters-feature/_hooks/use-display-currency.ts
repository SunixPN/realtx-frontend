'use client'
import { useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useCurrencyRates, type CurrencyRatesType } from '@/shared/api/currency-rates-query'
export type DisplayCurrency = 'USD' | 'BYN' | 'EUR'
const VALID = new Set<DisplayCurrency>(['USD', 'BYN', 'EUR'])
const DEFAULT: DisplayCurrency = 'USD'

function rateToByn(c: DisplayCurrency, rates: CurrencyRatesType): number {
    if (c === 'BYN') return 1
    if (c === 'USD') return rates.usdToByn
    return rates.eurToByn
}

function convert(value: number, from: DisplayCurrency, to: DisplayCurrency, rates: CurrencyRatesType): number {
    if (from === to) return value
    const inByn = value * rateToByn(from, rates)
    return Math.round(inByn / rateToByn(to, rates))
}

export function useDisplayCurrency() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { data: rates } = useCurrencyRates()
    const fromUrl = searchParams.get('currency')?.toUpperCase()
    const urlCurrency = fromUrl && VALID.has(fromUrl as DisplayCurrency) ? (fromUrl as DisplayCurrency) : null
    const [storedCurrency] = useState<DisplayCurrency | null>(null)
    const currency: DisplayCurrency = urlCurrency ?? storedCurrency ?? DEFAULT
    const setCurrency = useCallback((next: DisplayCurrency) => {
        if (next === currency) return
        const sp = new URLSearchParams(Array.from(searchParams.entries()))
        if (next === DEFAULT) sp.delete('currency')
        else sp.set('currency', next)
        if (rates) {
            const priceMin = sp.get('priceMin')
            const priceMax = sp.get('priceMax')
            if (priceMin) sp.set('priceMin', String(convert(Number(priceMin), currency, next, rates)))
            if (priceMax) sp.set('priceMax', String(convert(Number(priceMax), currency, next, rates)))
        }
        const qs = sp.toString()
        window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
    }, [searchParams, pathname, currency, rates])
    return { currency, setCurrency }
}
