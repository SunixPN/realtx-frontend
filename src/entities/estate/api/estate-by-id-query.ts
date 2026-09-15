import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import type { EstateType } from './estate-types'

export const estateByIdQuery = (id: number, displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD') =>
    queryOptions({
        queryKey: [QUERIES.ESTATE_BY_ID, id, displayCurrency],
        queryFn: () => api.get<EstateType>(API_ROUTES.ESTATE.BY_ID(id), { params: { displayCurrency } }),
        select: (r) => r.data,
        staleTime: 10 * 60 * 1000,
    })
