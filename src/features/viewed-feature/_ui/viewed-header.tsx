'use client'
import { Clock, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useClearViewed } from '@/entities/viewed'

type ViewedHeaderProps = {
    count: number
}

export function ViewedHeader({ count }: ViewedHeaderProps) {
    const t = useTranslations('viewed')
    const { trigger: clear, isMutating } = useClearViewed()

    const onClear = async () => {
        if (count === 0) return
        if (typeof window !== 'undefined' && !window.confirm(t('clear_confirm'))) return
        await clear().catch(() => {})
    }

    return (
        <div className="flex flex-col items-stretch gap-3 border-b border-border pb-4 min-[800px]:flex-row min-[800px]:items-end min-[800px]:justify-between min-[800px]:gap-6 min-[800px]:pb-5">
            <div className="min-w-0">
                <div className="hidden text-sm text-text-muted sm:block">{t('subtitle')}</div>
                <h1 className="flex items-center gap-2.5 text-xl font-semibold text-text-base sm:mt-1 sm:gap-3 sm:text-2xl">
                    <Clock className="size-5 text-text-muted sm:size-6" aria-hidden />
                    {t('title')}
                </h1>
                <div className="mt-2 text-sm text-text-muted sm:mt-1.5">
                    {t('count', { count })}
                </div>
            </div>
            {count > 0 && (
                <button
                    type="button"
                    onClick={onClear}
                    disabled={isMutating}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 self-start rounded-md border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted disabled:opacity-60 min-[800px]:self-auto"
                >
                    <Trash2 className="size-4" aria-hidden />
                    {t('clear_all')}
                </button>
            )}
        </div>
    )
}
