'use client'
import useSWRMutation from 'swr/mutation'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { comparePreferencesKey } from './compare-keys'
import type { ComparePreferencesType } from './compare-types'

async function put(_key: string, { arg }: { arg: string[] }): Promise<ComparePreferencesType> {
    const r = await api.put<ComparePreferencesType>(API_ROUTES.COMPARE.PREFERENCES, { hiddenRows: arg })
    return r.data
}

export function useUpdateComparePreferences() {
    const { trigger, isMutating } = useSWRMutation(
        'compare-preferences-mutation',
        put,
        {
            throwOnError: false,
            onSuccess: (data) => {
                swrMutate(comparePreferencesKey(), data, { revalidate: false })
            },
        },
    )
    return {
        trigger: (hiddenRows: string[]) => trigger(hiddenRows),
        isMutating,
    }
}
