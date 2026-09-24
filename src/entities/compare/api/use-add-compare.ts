'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { AxiosError } from 'axios'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { authKey } from '@/entities/me/api/auth-query'
import { compareIdsKey } from './compare-keys'
import { COMPARE_LIMIT, type CompareIdsType } from './compare-types'
import { patchEstateIsInCompare } from './patch-estate-compare'

export type AddCompareErrorCode = 'COMPARE_LIMIT_REACHED' | 'ALREADY_IN_COMPARE' | 'UNKNOWN'
export class AddCompareError extends Error {
    code: AddCompareErrorCode
    limit?: number
    constructor(code: AddCompareErrorCode, limit?: number) {
        super(code)
        this.code = code
        this.limit = limit
    }
}

export function useAddCompare() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            try {
                await api.post(API_ROUTES.COMPARE.ADD(id))
                return id
            } catch (e) {
                // Axios response interceptor wraps errors into ApiError with a `.status` field.
                const status =
                    (e as { status?: number })?.status
                    ?? (e as AxiosError<{ error?: { statusCode?: number } }>).response?.status
                    ?? (e as AxiosError<{ error?: { statusCode?: number } }>).response?.data?.error?.statusCode
                if (status === 422) throw new AddCompareError('COMPARE_LIMIT_REACHED', COMPARE_LIMIT)
                if (status === 409) throw new AddCompareError('ALREADY_IN_COMPARE')
                throw new AddCompareError('UNKNOWN')
            }
        },
        onMutate: (id) => {
            swrMutate(
                compareIdsKey(),
                (old?: CompareIdsType) => {
                    if (!old) return { ids: [id], limit: COMPARE_LIMIT }
                    return old.ids.includes(id) ? old : { ids: [...old.ids, id], limit: old.limit }
                },
                { revalidate: false },
            )
            patchEstateIsInCompare(id, true)
        },
        onError: (error, id) => {
            // Force revalidate ids to unroll optimistic patch if server rejected
            swrMutate(compareIdsKey())
            // 409 means the estate is already in compare — keep the optimistic flag
            if (error instanceof AddCompareError && error.code === 'ALREADY_IN_COMPARE') return
            patchEstateIsInCompare(id, false)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERIES.COMPARE] })
            queryClient.invalidateQueries({ queryKey: [QUERIES.FAVORITES] })
            swrMutate(authKey)
        },
    })
    return {
        trigger: mutation.mutateAsync,
        isMutating: mutation.isPending,
    }
}
