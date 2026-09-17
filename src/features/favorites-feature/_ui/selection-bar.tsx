'use client'

import { GitCompare, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBulkRemoveFavorites } from '@/entities/favorite'

type SelectionBarProps = {
    selected: Set<number>
    onClear: () => void
}

export function SelectionBar({ selected, onClear }: SelectionBarProps) {
    const t = useTranslations('favorites')
    const count = selected.size
    const { trigger: bulkRemove, isMutating: isPending } = useBulkRemoveFavorites()

    const handleRemove = async () => {
        try {
            await bulkRemove([...selected])
            onClear()
        } catch {
            // ошибка обрабатывается в мутации (откат кэша)
        }
    }

    return (
        <div className="sticky top-4 z-10 flex items-center justify-between gap-3 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2 text-sm">
                <span className="flex size-6 min-w-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white tabular-nums">
                    {count}
                </span>
                <span className="font-medium text-brand">
                    {t('selected_count', { count })}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-muted cursor-pointer"
                >
                    <GitCompare className="size-4" />
                    {t('compare')}
                </button>
                <button
                    type="button"
                    disabled={isPending}
                    onClick={handleRemove}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-muted disabled:opacity-50 cursor-pointer"
                >
                    <Trash2 className="size-4" />
                    {t('remove_selected')}
                </button>
                <button
                    type="button"
                    aria-label={t('clear_selection_aria')}
                    onClick={onClear}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-md text-brand hover:bg-brand/10"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    )
}
