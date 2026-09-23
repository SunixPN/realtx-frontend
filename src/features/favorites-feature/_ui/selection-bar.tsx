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
        }
    }
    return (
        <>
            {}
            <div className="sticky top-4 z-10 hidden items-center justify-between gap-3 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3 shadow-md sm:flex">
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
            {}
            <div
                className="fixed inset-x-0 bottom-0 z-30 border-t border-brand/20 bg-surface-page/95 shadow-[0_-4px_16px_rgb(0_0_0/0.08)] backdrop-blur-md sm:hidden"
                style={{
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    animation: 'selection-bar-in 220ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
            >
                <div className="flex items-center gap-2 px-3 py-2.5">
                    <button
                        type="button"
                        aria-label={t('clear_selection_aria')}
                        onClick={onClear}
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors active:bg-surface-muted"
                    >
                        <X className="size-5" />
                    </button>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="flex size-7 min-w-7 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white tabular-nums">
                            {count}
                        </span>
                        <span className="truncate text-sm font-medium text-brand">
                            {t('selected_count', { count })}
                        </span>
                    </div>
                    <button
                        type="button"
                        aria-label={t('compare')}
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-surface-raised text-text-muted transition-colors active:bg-surface-muted"
                    >
                        <GitCompare className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label={t('remove_selected')}
                        disabled={isPending}
                        onClick={handleRemove}
                        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-error/30 bg-error-bg text-error transition-colors active:bg-error/20 disabled:opacity-50"
                    >
                        <Trash2 className="size-5" />
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes selection-bar-in {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
