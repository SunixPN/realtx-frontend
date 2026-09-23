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
        <div className="grid w-full grid-cols-3 items-center gap-1 rounded-md border border-border bg-surface-raised p-1 sm:inline-flex sm:w-auto">
            {OPTIONS.map((o) => (
                <button
                    key={o.key}
                    type="button"
                    aria-pressed={value === o.key}
                    aria-label={o.label}
                    onClick={() => onChange(o.key)}
                    className={cn(
                        'flex items-center justify-center gap-1.5 rounded-sm px-2 py-2 text-sm font-medium transition-colors cursor-pointer sm:px-3 sm:py-1.5',
                        value === o.key
                            ? 'bg-brand text-white'
                            : 'text-text-muted hover:bg-surface-muted active:bg-surface-muted',
                    )}
                >
                    {o.icon}
                    <span className="hidden truncate xs:inline">{o.label}</span>
                </button>
            ))}
        </div>
    )
}
