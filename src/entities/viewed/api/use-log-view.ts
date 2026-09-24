'use client'
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { mutate as swrMutate } from 'swr'
import { api } from '@/shared/api/api'
import { API_ROUTES } from '@/shared/const/api-routes'
import { QUERIES } from '@/shared/const/queries'
import { viewedIdsKey } from './viewed-keys'
import type { ViewedIdsType } from './viewed-types'

// Логируем факт просмотра ровно один раз за маунт компонента-деталки.
// Живёт на клиенте, поэтому Next.js RSC-префетч ссылок с /viewed сюда
// не заходит и viewedAt не двигает.
export function useLogView(estateId: number, enabled: boolean) {
    const queryClient = useQueryClient()
    const loggedRef = useRef<number | null>(null)

    useEffect(() => {
        if (!enabled) return
        if (loggedRef.current === estateId) return
        loggedRef.current = estateId
        api.post(API_ROUTES.VIEWED.LOG(estateId))
            .then(() => {
                queryClient.invalidateQueries({ queryKey: [QUERIES.VIEWED] })
                swrMutate(
                    viewedIdsKey(),
                    (old?: ViewedIdsType) => {
                        if (!old) return { ids: [estateId] }
                        return old.ids.includes(estateId) ? old : { ids: [...old.ids, estateId] }
                    },
                    { revalidate: false },
                )
            })
            .catch(() => {})
    }, [estateId, enabled, queryClient])
}
