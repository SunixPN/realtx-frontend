'use client'
import useSWR from 'swr'
import { api } from './api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
export type CurrencyRatesType = {
    effectiveOn: string
    usdToByn: number
    eurToByn: number
}
export const currencyRatesKey = () => [QUERIES.CURRENCY_RATES] as const
const fetcher = async (): Promise<CurrencyRatesType> => {
    const r = await api.get<CurrencyRatesType>(API_ROUTES.CURRENCY.RATES)
    return r.data
}

export function useCurrencyRates() {
    return useSWR<CurrencyRatesType>(currencyRatesKey(), fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60 * 60 * 1000,
    })
}
