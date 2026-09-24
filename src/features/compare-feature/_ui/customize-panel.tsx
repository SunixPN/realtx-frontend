'use client'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { UICheckbox } from '@/shared/ui/ui-checkbox'
import { SECTIONS } from '../_lib/compare-sections'

type Props = {
    draft: Set<string>
    toggle: (labelKey: string) => void
    setSection: (labelKeys: string[], hide: boolean) => void
    reset: () => void
    apply: () => void
    isMutating: boolean
    onClose: () => void
    /** Хедер отдельно, чтобы на мобиле его можно было сделать sticky и без крестика (сжимаемая шапка BottomSheet). */
    hideHeader?: boolean
    className?: string
}

export function CustomizePanel({
    draft,
    toggle,
    setSection,
    reset,
    apply,
    isMutating,
    onClose,
    hideHeader = false,
    className,
}: Props) {
    const t = useTranslations('compare')
    const totalRows = SECTIONS.reduce((n, s) => n + s.rows.length, 0)
    const hiddenCount = draft.size
    const visibleCount = totalRows - hiddenCount

    return (
        <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
            {!hideHeader && (
                <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                    <div>
                        <div className="text-sm font-semibold text-text-base">{t('customize_title')}</div>
                        <div className="mt-0.5 text-xs text-text-muted">{t('customize_hint', { visible: visibleCount, total: totalRows })}</div>
                    </div>
                    <button
                        type="button"
                        onClick={reset}
                        className="shrink-0 text-xs font-medium text-brand hover:underline cursor-pointer"
                    >
                        {t('reset_defaults')}
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3">
                {SECTIONS.map((section) => {
                    const sectionKeys = section.rows.map(r => r.labelKey)
                    const allHidden = sectionKeys.every(k => draft.has(k))
                    return (
                        <div key={section.titleKey} className="mb-4 last:mb-0">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                    {t(section.titleKey)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSection(sectionKeys, !allHidden)}
                                    className="text-xs font-medium text-text-muted hover:text-brand transition-colors cursor-pointer"
                                >
                                    {allHidden ? t('section_show_all') : t('section_hide_all')}
                                </button>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {section.rows.map((row) => {
                                    const checked = !draft.has(row.labelKey)
                                    return (
                                        <UICheckbox
                                            key={row.labelKey}
                                            checked={checked}
                                            onChange={() => toggle(row.labelKey)}
                                            label={t(row.labelKey)}
                                            className="py-1"
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-raised px-4 py-3">
                <button
                    type="button"
                    onClick={reset}
                    className="text-sm font-medium text-text-muted hover:text-brand transition-colors cursor-pointer"
                >
                    {t('reset_defaults')}
                </button>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-text-base hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={apply}
                        disabled={isMutating}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60 transition-all cursor-pointer"
                    >
                        {t('apply')}
                    </button>
                </div>
            </div>
        </div>
    )
}
