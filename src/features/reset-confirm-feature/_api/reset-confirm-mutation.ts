'use client'
import useSWRMutation from 'swr/mutation'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { showToast } from '@/shared/helpers/show-toast'
type Body = {
    token:    string
    password: string
}
export type ResetConfirmResponseType = { message: string }
export function useResetConfirmMutation() {
    return useSWRMutation<ResetConfirmResponseType, Error, string, Body>(
        MUTATIONS.RESET_CONFIRM,
        async (_key, { arg }) => {
            const r = await api.post<ResetConfirmResponseType>(API_ROUTES.AUTH.PASSWORD_RESET.CONFIRM, arg)
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
