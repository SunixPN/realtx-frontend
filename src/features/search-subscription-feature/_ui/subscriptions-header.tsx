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
            <div className="min-w-0">
                <div className="hidden text-sm text-text-muted sm:block">{t('notifications_label')}</div>
                <h1 className="text-xl font-semibold text-text-base sm:mt-1 sm:text-2xl">{t('title')}</h1>
                <p className="mt-1.5 max-w-2xl text-sm text-text-muted">
                    {t('active_status', { active, total: items.length })}
                    {totalFresh > 0 && (
                        <>
                            {t('today_fresh', { count: totalFresh })}
                        </>
                    )}
                </p>
            </div>
            <div className="sm:shrink-0">
                <UIButton
                    size="md"
                    iconLeft={<Plus className="size-4" />}
                    onClick={onCreate}
                    className="w-full sm:w-auto"
                >
                    {t('new_button')}
                </UIButton>
            </div>
        </>
    )
}
