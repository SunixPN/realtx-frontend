'use client'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCompare, useClearCompare } from '@/entities/compare'
import { useDisplayCurrency } from '@/features/main-map-filters-feature/_hooks/use-display-currency'
import { CompareTable } from './compare-table'
import { CompareEmpty } from './compare-empty'
import { DifferenceToggle } from './difference-toggle'
import { CustomizeButton } from './customize-button'
import { useDifferenceMode } from '../_hooks/use-difference-mode'

export function CompareScreen() {
    const t = useTranslations('compare')
    const { currency } = useDisplayCurrency()
    const { data, isLoading } = useCompare(currency)
    const { mode, setMode } = useDifferenceMode()
    const { trigger: clear, isMutating: isClearing } = useClearCompare()

    const items = data?.items ?? []

    if (!isLoading && items.length === 0) {
        return (
            <div className="mx-auto w-full max-w-[1520px] px-3 py-3 sm:px-4 md:px-6 md:py-6">
                <CompareEmpty />
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-4 px-3 py-3 sm:px-4 md:gap-6 md:px-6 md:py-6">
            <header className="flex flex-col items-stretch gap-3 border-b border-border pb-4 min-[800px]:flex-row min-[800px]:items-end min-[800px]:justify-between min-[800px]:gap-6 min-[800px]:pb-5">
                <div>
                    <div className="text-sm text-text-muted">{t('title')}</div>
                    <h1 className="mt-1 text-2xl font-semibold text-text-base">
                        {t('title_count', { count: items.length })}
                    </h1>
                    <p className="mt-1.5 max-w-2xl text-sm text-text-muted">{t('subtitle')}</p>
                </div>
                <div className="flex flex-col items-stretch gap-2 min-[600px]:flex-row min-[600px]:items-center">
                    <DifferenceToggle mode={mode} onChange={setMode} />
                    <CustomizeButton />
                    <button
                        type="button"
                        onClick={() => clear()}
                        disabled={isClearing || items.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-text-base hover:bg-surface-muted disabled:opacity-60 transition-colors cursor-pointer"
                    >
                        <Trash2 className="size-4" aria-hidden />
                        {t('clear_all')}
                    </button>
                </div>
            </header>

            {items.length > 0 && <CompareTable items={items} mode={mode} />}

            <footer className="text-xs text-text-faint">{t('footer_hint')}</footer>
        </div>
    )
}
