'use client'
import useSWR, { type SWRConfiguration } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { comparePreferencesKey } from './compare-keys'
import type { ComparePreferencesType } from './compare-types'

const fetcher = async (): Promise<ComparePreferencesType> => {
    const r = await api.get<ComparePreferencesType>(API_ROUTES.COMPARE.PREFERENCES)
    return r.data
}

type Options = { enabled?: boolean } & SWRConfiguration<ComparePreferencesType>

export function useComparePreferences(options?: Options) {
    const enabled = options?.enabled ?? true
    return useSWR<ComparePreferencesType>(
        enabled ? comparePreferencesKey() : null,
        fetcher,
        options,
    )
}
