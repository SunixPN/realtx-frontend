'use client'
import { useTranslations } from 'next-intl'
import type { SubscriptionFrequency } from '@/entities/search-subscription'
export function useFormatFrequency(): (f: SubscriptionFrequency) => string {
    const t = useTranslations('subscriptions')
    return (f) => {
        if (f === 'instant') return t('frequency_instant')
        if (f === 'daily') return t('frequency_daily')
        return t('frequency_weekly')
    }
}
