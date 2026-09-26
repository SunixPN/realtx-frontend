'use client'
import useSWRMutation from 'swr/mutation'
import { useTranslations } from 'next-intl'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { showToast } from '@/shared/helpers/show-toast'
export function useLogoutMutation() {
    const t = useTranslations('auth.logout')
    return useSWRMutation<void, Error, string, void>(
        MUTATIONS.LOGOUT,
        async () => {
            await api.post(API_ROUTES.AUTH.LOGOUT)
        },
        {
            onError: (error) => {
                showToast({ status: 'error', text: error?.message ?? t('toast_error') })
            },
            throwOnError: true,
        },
    )
}
