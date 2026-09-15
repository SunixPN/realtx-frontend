'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { currencyRatesQuery, type CurrencyRatesType } from '@/shared/api/currency-rates-query'

export type DisplayCurrency = 'USD' | 'BYN' | 'EUR'

const VALID = new Set<DisplayCurrency>(['USD', 'BYN', 'EUR'])
const DEFAULT: DisplayCurrency = 'USD'

// Курс валюты к BYN (BYN — pivot). 1 BYN = 1 BYN.
function rateToByn(c: DisplayCurrency, rates: CurrencyRatesType): number {
    if (c === 'BYN') return 1
    if (c === 'USD') return rates.usdToByn
    return rates.eurToByn
}

// Конверсия: (value * rateFromToByn) / rateToToByn.
// Округляем до целого — цены в фильтре пользователь вводит целыми.
function convert(value: number, from: DisplayCurrency, to: DisplayCurrency, rates: CurrencyRatesType): number {
    if (from === to) return value
    const inByn = value * rateToByn(from, rates)
    return Math.round(inByn / rateToByn(to, rates))
}

/**
 * Валюта отображения — НЕ фильтр. Живёт отдельным query-параметром `?currency=USD`.
 * При смене валюты конвертирует priceMin/priceMax в URL по актуальному курсу
 * НБ РБ — иначе фильтр «100 000 USD» превращается в «100 000 BYN» и выдача
 * обнуляется.
 */
export function useDisplayCurrency() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const { data: rates } = useQuery(currencyRatesQuery())

    const fromUrl = searchParams.get('currency')?.toUpperCase()
    const urlCurrency = fromUrl && VALID.has(fromUrl as DisplayCurrency) ? (fromUrl as DisplayCurrency) : null

    const [storedCurrency] = useState<DisplayCurrency | null>(null)

    const currency: DisplayCurrency = urlCurrency ?? storedCurrency ?? DEFAULT

    const setCurrency = useCallback((next: DisplayCurrency) => {
        if (next === currency) return
        const sp = new URLSearchParams(Array.from(searchParams.entries()))
        if (next === DEFAULT) sp.delete('currency')
        else sp.set('currency', next)

        // Конвертируем priceMin/priceMax из текущей валюты в новую.
        // Без курса — не трогаем, чтобы не потерять пользовательский ввод.
        if (rates) {
            const priceMin = sp.get('priceMin')
            const priceMax = sp.get('priceMax')
            if (priceMin) sp.set('priceMin', String(convert(Number(priceMin), currency, next, rates)))
            if (priceMax) sp.set('priceMax', String(convert(Number(priceMax), currency, next, rates)))
        }

        const qs = sp.toString()
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, [searchParams, router, pathname, currency, rates])

    return { currency, setCurrency }
}
