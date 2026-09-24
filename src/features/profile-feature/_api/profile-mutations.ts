'use client'
import useSWRMutation from 'swr/mutation'
import { useSWRConfig } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { MUTATIONS } from '@/shared/const/mutations'
import { authKey } from '@/entities/me/api/auth-query'
import type { AuthUserType } from '@/entities/me/types/me-type'

export type UpdateProfileBody = {
    name?: string
    city?: string | null
    notifyByEmail?: boolean
}

// Бек на все профильные мутации отвечает свежим `me` — сразу кладём его в кеш
function useMeMutation<Body>(key: string, request: (body: Body) => Promise<AuthUserType>) {
    const { mutate } = useSWRConfig()
    return useSWRMutation<AuthUserType, Error, string, Body>(
        key,
        async (_key, { arg }) => request(arg),
        {
            onSuccess: (user) => { mutate(authKey, { user }, { revalidate: false }) },
            throwOnError: true,
        },
    )
}

export function useUpdateProfileMutation() {
    return useMeMutation<UpdateProfileBody>(MUTATIONS.UPDATE_PROFILE, async (body) => {
        const { data } = await api.patch<AuthUserType>(API_ROUTES.AUTH.ME, body)
        return data
    })
}

export function useAddEmailMutation() {
    return useMeMutation<{ email: string }>(MUTATIONS.ADD_EMAIL, async (body) => {
        const { data } = await api.post<AuthUserType>(API_ROUTES.AUTH.ADD_EMAIL, body)
        return data
    })
}

export function usePhoneConfirmMutation() {
    return useMeMutation<{ idToken: string }>(MUTATIONS.PHONE_CONFIRM, async (body) => {
        const { data } = await api.post<AuthUserType>(API_ROUTES.AUTH.PHONE_CONFIRM, body)
        return data
    })
}

export function useResendVerificationMutation() {
    return useSWRMutation<void, Error, string, void>(
        MUTATIONS.RESEND_VERIFICATION,
        async () => { await api.post(API_ROUTES.AUTH.RESEND_VERIFICATION) },
        { throwOnError: true },
    )
}

export function useDeleteAccountMutation() {
    return useSWRMutation<void, Error, string, void>(
        MUTATIONS.DELETE_ACCOUNT,
        async () => { await api.delete(API_ROUTES.AUTH.DELETE_ACCOUNT) },
        { throwOnError: true },
    )
}
