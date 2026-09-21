'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { useTranslations } from 'next-intl'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { AuthResponseType } from '@/entities/me/types/me-type'
import { showToast } from '@/shared/helpers/show-toast'
import { authKey } from '@/entities/me/api/auth-query'
import { saveAccessTokenAction } from '@/shared/actions/save-access-token-action'
type Body = {
    name?: string
    email: string
    password: string
}
export function useRegisterMutation() {
    const { mutate } = useSWRConfig()
    const t = useTranslations('auth.register')
    return useSWRMutation<AuthResponseType, Error, string, Body>(
        MUTATIONS.REGISTER,
        async (_key, { arg }) => {
            const r = await api.post<AuthResponseType>(API_ROUTES.AUTH.REGISTER, arg)
            return r.data
        },
        {
            onSuccess: async (data) => {
                await saveAccessTokenAction(data.accessToken)
                showToast({ status: 'success', text: t('toast_success') })
                mutate(authKey)
            },
            onError: (error) => {
                showToast({ status: 'error', text: error?.message })
            },
            throwOnError: false,
        },
    )
}
