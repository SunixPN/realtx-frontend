'use client'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { FavoriteItemType } from '@/entities/favorite'
type FavoritesHeaderProps = {
    items: FavoriteItemType[]
}
export function FavoritesHeader({ items }: FavoritesHeaderProps) {
    const t = useTranslations('favorites')
    const count = items.length
    const drops = items.filter(i => i.priceDeltaUsd !== null && i.priceDeltaUsd < 0).length
    const rises = items.filter(i => i.priceDeltaUsd !== null && i.priceDeltaUsd > 0).length
    const removed = items.filter(i => !i.isActive).length
    return (
        <div className="min-w-0">
            <div className="hidden text-sm text-text-muted sm:block">{t('subtitle')}</div>
            <h1 className="flex items-center gap-2.5 text-xl font-semibold text-text-base sm:mt-1 sm:gap-3 sm:text-2xl">
                <Heart className="size-5 fill-error text-error sm:size-6" aria-hidden />
                {t('title')}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted sm:mt-1.5">
                <span>{t('count', { count })}</span>
                {drops > 0 && (
                    <span className="inline-flex items-center rounded-full bg-success-bg px-2 py-0.5 text-xs font-medium text-success">
                        {t('price_drops', { count: drops })}
                    </span>
                )}
                {rises > 0 && (
                    <span className="inline-flex items-center rounded-full bg-error-bg px-2 py-0.5 text-xs font-medium text-error">
                        {t('price_rises', { count: rises })}
                    </span>
                )}
                {removed > 0 && (
                    <span className="inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-muted">
                        {t('delisted_count', { count: removed })}
                    </span>
                )}
            </div>
        </div>
    )
}
