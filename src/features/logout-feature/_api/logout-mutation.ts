'use client'

import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { useTranslations } from 'next-intl'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { showToast } from '@/shared/helpers/show-toast'
import { authKey } from '@/entities/me/api/auth-query'
import { clearTokensAction } from '@/shared/actions/clear-tokens-action'

export function useLogoutMutation() {
    const { mutate } = useSWRConfig()
    const t = useTranslations('auth.logout')
    return useSWRMutation<void, Error, string, void>(
        MUTATIONS.LOGOUT,
        async () => {
            await api.post(API_ROUTES.AUTH.LOGOUT)
        },
        {
            onSuccess: async () => {
                await clearTokensAction()
                mutate(authKey, null, { revalidate: false })
                showToast({ status: 'success', text: t('toast_success') })
            },
            onError: (error) => {
                showToast({ status: 'error', text: error?.message ?? t('toast_error') })
            },
            throwOnError: false,
        },
    )
}
