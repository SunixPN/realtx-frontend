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
        <div>
            <div className="text-sm text-text-muted">{t('subtitle')}</div>
            <h1 className="mt-1 flex items-center gap-3 text-2xl font-semibold text-text-base">
                <Heart className="size-6 fill-error text-error" aria-hidden />
                {t('title')}
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
                {t('count', { count })}
                {drops > 0 && (
                    <span className="font-medium text-success">
                        {t('price_drops', { count: drops })}
                    </span>
                )}
                {rises > 0 && (
                    <span className="font-medium text-error">
                        {t('price_rises', { count: rises })}
                    </span>
                )}
                {removed > 0 && t('delisted_count', { count: removed })}
            </p>
        </div>
    )
}
