'use client'

import useSWRMutation from 'swr/mutation'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { showToast } from '@/shared/helpers/show-toast'

type Body = { email: string }

export type ResetRequestResponseType = { message: string }

export function useResetRequestMutation() {
    return useSWRMutation<ResetRequestResponseType, Error, string, Body>(
        MUTATIONS.RESET_REQUEST,
        async (_key, { arg }) => {
            const r = await api.post<ResetRequestResponseType>(API_ROUTES.AUTH.PASSWORD_RESET.REQUEST, arg)
            return r.data
        },
        {
            onError: (error) => {
                showToast({ status: 'error', text: error?.message })
            },
            throwOnError: false,
        },
    )
}
