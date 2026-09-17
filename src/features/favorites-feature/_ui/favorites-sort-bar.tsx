'use client'

import { ArrowDownAZ, Clock, TrendingDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import type { FavoriteSort } from '@/entities/favorite'

type FavoritesSortBarProps = {
    value: FavoriteSort
    onChange: (sort: FavoriteSort) => void
}

export function FavoritesSortBar({ value, onChange }: FavoritesSortBarProps) {
    const t = useTranslations('favorites')
    const OPTIONS: { key: FavoriteSort; label: string; icon: React.ReactNode }[] = [
        { key: 'recent',     label: t('sort_recent'),     icon: <Clock className="size-4" /> },
        { key: 'price-drop', label: t('sort_price_drop'), icon: <TrendingDown className="size-4" /> },
        { key: 'price-asc',  label: t('sort_price_asc'),  icon: <ArrowDownAZ className="size-4" /> },
    ]
    return (
        <div className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised p-1">
            {OPTIONS.map((o) => (
                <button
                    key={o.key}
                    type="button"
                    aria-pressed={value === o.key}
                    onClick={() => onChange(o.key)}
                    className={cn(
                        'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                        value === o.key
                            ? 'bg-brand text-white'
                            : 'text-text-muted hover:bg-surface-muted',
                    )}
                >
                    {o.icon}
                    {o.label}
                </button>
            ))}
        </div>
    )
}
