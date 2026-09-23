'use client'
import useSWR, { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { viewedIdsKey } from './viewed-keys'
import type { ViewedIdsType } from './viewed-types'

const fetcher = async (): Promise<ViewedIdsType> => {
    const r = await api.get<ViewedIdsType>(API_ROUTES.VIEWED.IDS)
    return r.data
}

type Options = { enabled?: boolean } & SWRConfiguration<ViewedIdsType>

export function useViewedIds(options?: Options) {
    const enabled = options?.enabled ?? true
    return useSWR<ViewedIdsType>(
        enabled ? viewedIdsKey() : null,
        fetcher,
        options,
    )
}
