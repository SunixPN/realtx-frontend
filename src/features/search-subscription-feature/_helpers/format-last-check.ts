'use client'

import { useTranslations } from 'next-intl'

export function useFormatLastCheck(): (iso: string | null) => string {
    const t = useTranslations('subscriptions')
    return (iso) => {
        if (!iso) return t('last_check_never')
        const then = new Date(iso).getTime()
        const now = Date.now()
        const diffMin = Math.max(1, Math.round((now - then) / 60_000))
        if (diffMin < 60) return t('last_check_min', { n: diffMin })
        const hours = Math.round(diffMin / 60)
        if (hours < 24) return t('last_check_hour', { n: hours })
        const days = Math.round(hours / 24)
        return t('last_check_day', { n: days })
    }
}
