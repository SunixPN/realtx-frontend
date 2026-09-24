'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAddCompare, useRemoveCompare, AddCompareError } from '@/entities/compare'
import { useAuth } from '@/entities/me/api/auth-query'
import { ROUTES } from '@/shared/const/routes'
import useRouter from '@/shared/lib/use-router'
import { showToast } from '@/shared/helpers/show-toast'

type Override = { id: number; value: boolean }

export function useToggleCompare(estateId: number, serverIsInCompare: boolean) {
    const router = useRouter()
    const t = useTranslations('compare')
    const { data: auth } = useAuth()
    const [override, setOverride] = useState<Override | null>(null)
    const isInCompare = override && override.id === estateId ? override.value : serverIsInCompare
    useEffect(() => {
        if (!override) return
        if (override.id !== estateId || override.value === serverIsInCompare) {
            setOverride(null)
        }
    }, [estateId, serverIsInCompare, override])
    const { trigger: add, isMutating: isAdding } = useAddCompare()
    const { trigger: remove, isMutating: isRemoving } = useRemoveCompare()

    const add_ = async () => {
        if (!auth?.user) { router.push(ROUTES.SIGN_IN); return }
        setOverride({ id: estateId, value: true })
        try {
            await add(estateId)
        } catch (e) {
            setOverride(null)
            if (e instanceof AddCompareError) {
                if (e.code === 'COMPARE_LIMIT_REACHED') {
                    showToast({ status: 'error', text: t('limit_reached_toast', { limit: e.limit ?? 4 }) })
                } else if (e.code === 'ALREADY_IN_COMPARE') {
                    // Already in — behave as success (override next render will resync)
                } else {
                    showToast({ status: 'error', text: t('add_error_toast') })
                }
            } else {
                showToast({ status: 'error', text: t('add_error_toast') })
            }
        }
    }

    const remove_ = async () => {
        if (!auth?.user) { router.push(ROUTES.SIGN_IN); return }
        setOverride({ id: estateId, value: false })
        try {
            await remove(estateId)
        } catch {
            setOverride(null)
            showToast({ status: 'error', text: t('remove_error_toast') })
        }
    }

    const goToCompare = () => { router.push(ROUTES.COMPARE) }

    return {
        isInCompare,
        add: add_,
        remove: remove_,
        goToCompare,
        isPending: isAdding || isRemoving,
    }
}
