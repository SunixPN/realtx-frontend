'use client'
import useSWR from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
export type SuggestItemType = {
    type: 'metro' | 'address'
    value: string
}
export const suggestKey = (q: string, limit = 10) =>
    [QUERIES.SUGGEST, q, limit] as const
type Key = ReturnType<typeof suggestKey>
const fetcher = async ([, q, limit]: Key): Promise<SuggestItemType[]> => {
    const r = await api.get<SuggestItemType[]>(API_ROUTES.ESTATE.SUGGEST, { params: { q, limit } })
    return r.data
}
export function useSuggest(q: string, limit = 10, options?: { enabled?: boolean }) {
    const enabled = options?.enabled ?? true
    return useSWR<SuggestItemType[]>(
        enabled ? suggestKey(q, limit) : null,
        fetcher as (k: Key) => Promise<SuggestItemType[]>,
    )
}
