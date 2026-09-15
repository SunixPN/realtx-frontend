import { queryOptions } from '@tanstack/react-query'
import { api } from './api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'

export type CurrencyRatesType = {
    effectiveOn: string
    usdToByn: number
    eurToByn: number
}

// Курсы для конвертации priceMin/priceMax при смене displayCurrency.
// Меняются раз в сутки — держим кеш агрессивно.
export const currencyRatesQuery = () =>
    queryOptions({
        queryKey: [QUERIES.CURRENCY_RATES],
        queryFn: async () => {
            const r = await api.get<CurrencyRatesType>(API_ROUTES.CURRENCY.RATES)
            return r.data
        },
        staleTime: 60 * 60 * 1000,
    })
