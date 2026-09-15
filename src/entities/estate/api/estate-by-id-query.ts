import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import type { EstateType } from './estate-types'

// Возвращаем .data (не сырой AxiosResponse) — иначе dehydrate() на сервере
// падает в стек-оверфлоу из-за циркулярных ссылок в response.request/config.
export const estateByIdQuery = (id: number, displayCurrency: 'USD' | 'BYN' | 'EUR' = 'USD') =>
    queryOptions({
        queryKey: [QUERIES.ESTATE_BY_ID, id, displayCurrency],
        queryFn: async () => {
            const r = await api.get<EstateType>(API_ROUTES.ESTATE.BY_ID(id), { params: { displayCurrency } })
            return r.data
        },
        staleTime: 10 * 60 * 1000,
    })
