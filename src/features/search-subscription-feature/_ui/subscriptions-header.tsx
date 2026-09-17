'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UIButton } from '@/shared/ui/ui-button'
import type { SearchSubscriptionType } from '@/entities/search-subscription'

type Props = {
    items: SearchSubscriptionType[]
    onCreate: () => void
}

export function SubscriptionsHeader({ items, onCreate }: Props) {
    const t = useTranslations('subscriptions')
    const active = items.filter(s => !s.paused).length
    const totalFresh = items.reduce((sum, s) => sum + s.fresh, 0)

    return (
        <>
            <div>
                <div className="text-sm text-text-muted">{t('notifications_label')}</div>
                <h1 className="mt-1 text-2xl font-semibold text-text-base">{t('title')}</h1>
                <p className="mt-1.5 max-w-2xl text-sm text-text-muted">
                    {t('active_status', { active, total: items.length })}
                    {totalFresh > 0 && (
                        <>
                            {t('today_fresh', { count: totalFresh })}
                        </>
                    )}
                </p>
            </div>
            <UIButton size="md" iconLeft={<Plus className="size-4" />} onClick={onCreate}>
                {t('new_button')}
            </UIButton>
        </>
    )
}
