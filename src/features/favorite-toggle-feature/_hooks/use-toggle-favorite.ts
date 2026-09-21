'use client'
import { useEffect, useState } from 'react'
import { useAddFavorite, useRemoveFavorite } from '@/entities/favorite'
import { useAuth } from '@/entities/me/api/auth-query'
import { ROUTES } from '@/shared/const/routes'
import useRouter from '@/shared/lib/use-router'

type Override = { id: number; value: boolean }
export function useToggleFavorite(estateId: number, serverIsFavorite: boolean) {
    const router = useRouter()
    const { data: auth } = useAuth()
    const [override, setOverride] = useState<Override | null>(null)
    const isFavorite = override && override.id === estateId ? override.value : serverIsFavorite
    useEffect(() => {
        if (!override) return
        if (override.id !== estateId || override.value === serverIsFavorite) {
            setOverride(null)
        }
    }, [estateId, serverIsFavorite, override])
    const { trigger: add, isMutating: isAdding } = useAddFavorite()
    const { trigger: remove, isMutating: isRemoving } = useRemoveFavorite()
    const toggle = async () => {
        if (!auth?.user) {
            router.push(ROUTES.SIGN_IN)
            return
        }
        const next = !isFavorite
        setOverride({ id: estateId, value: next })
        try {
            if (next) {
                await add(estateId, { throwOnError: true })
            } else {
                await remove(estateId, { throwOnError: true })
            }
        } catch {
            setOverride(null) 
        }
    }
    return { isFavorite, toggle, isPending: isAdding || isRemoving }
}
