'use client'
import useSWR, { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { compareIdsKey } from './compare-keys'
import type { CompareIdsType } from './compare-types'

const fetcher = async (): Promise<CompareIdsType> => {
    const r = await api.get<CompareIdsType>(API_ROUTES.COMPARE.IDS)
    return r.data
}

type Options = { enabled?: boolean } & SWRConfiguration<CompareIdsType>

export function useCompareIds(options?: Options) {
    const enabled = options?.enabled ?? true
    return useSWR<CompareIdsType>(
        enabled ? compareIdsKey() : null,
        fetcher,
        options,
    )
}
