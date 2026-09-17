'use client'

import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import type { EstateType } from './estate-types'
import { estateByIdKey } from './estate-query-keys'

export { estateByIdKey }

type Key = ReturnType<typeof estateByIdKey>

const fetcher = async ([, id, displayCurrency]: Key): Promise<EstateType> => {
    const r = await api.get<EstateType>(API_ROUTES.ESTATE.BY_ID(id), { params: { displayCurrency } })
    return r.data
}

export function useEstateById(id: number, displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD') {
    return useSWR<EstateType>(estateByIdKey(id, displayCurrency), fetcher as (k: Key) => Promise<EstateType>)
}
