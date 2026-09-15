import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'

export type SuggestItemType = {
    type: 'metro' | 'address'
    value: string
}

export const suggestQuery = (q: string, limit = 10) =>
    queryOptions({
        queryKey: [QUERIES.SUGGEST, q, limit],
        queryFn: () =>
            api.get<SuggestItemType[]>(API_ROUTES.ESTATE.SUGGEST, { params: { q, limit } }),
        select: (r) => r.data,
        staleTime: 5 * 60 * 1000,
    })
