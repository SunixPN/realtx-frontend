'use client'
import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { UIBottomSheet, useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet'
import { useIsMobile } from '@/shared/hooks/use-is-mobile'
import { useCustomizeRows } from '../_hooks/use-customize-rows'
import { CustomizePanel } from './customize-panel'

export function CustomizeButton() {
    const t = useTranslations('compare')
    const {
        open, setOpen, hiddenRows, draft,
        toggle, setSection, reset, apply, isMutating,
    } = useCustomizeRows()

    const rootRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile(768)
    const hiddenCount = hiddenRows.size

    // Анимация закрытия popover на десктопе (аналог user-menu в хедере).
    const CLOSE_MS = 120
    const [closing, setClosing] = useState(false)
    const startClose = () => {
        setClosing(true)
        setTimeout(() => { setOpen(false); setClosing(false) }, CLOSE_MS)
    }

    // Клик вне попапа (desktop) закрывает его. На мобиле есть BottomSheet, туда не долетает.
    useEffect(() => {
        if (!open || isMobile) return
        const onDown = (e: MouseEvent) => {
            const el = rootRef.current
            if (el && e.target instanceof Node && !el.contains(e.target)) startClose()
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open, isMobile])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') isMobile ? setOpen(false) : startClose() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, isMobile, setOpen])

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => { if (open && !isMobile) startClose(); else setOpen(v => !v) }}
                aria-haspopup="dialog"
                aria-expanded={open}
                className={cn(
                    'relative inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-2 text-sm font-medium text-text-base hover:bg-surface-muted transition-colors cursor-pointer',
                    hiddenCount > 0 && 'border-brand/40',
                )}
            >
                <SlidersHorizontal className="size-4" aria-hidden />
                <span>{t('customize')}</span>
                {hiddenCount > 0 && (
                    <span className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold leading-5 text-white tabular-nums">
                        {hiddenCount}
                    </span>
                )}
            </button>

            {/* Desktop popover */}
            {!isMobile && (open || closing) && (
                <div
                    role="dialog"
                    aria-label={t('customize_title')}
                    style={{
                        animation: closing
                            ? `dropdown-out ${CLOSE_MS}ms ease-in forwards`
                            : 'dropdown-in 160ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
                        transformOrigin: 'top right',
                        maxHeight: 'min(560px, calc(100vh - 140px))',
                    }}
                    className="absolute right-0 top-full z-30 mt-2 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
                >
                    <CustomizePanel
                        draft={draft}
                        toggle={toggle}
                        setSection={setSection}
                        reset={reset}
                        apply={apply}
                        isMutating={isMutating}
                        onClose={startClose}
                    />
                </div>
            )}

            {/* Mobile bottom sheet — рендерим только на мобиле, т.к. UIBottomSheet
                портится в document.body и Tailwind-скрытие обёртки на неё не действует. */}
            {isMobile && (
                <UIBottomSheet
                    open={open}
                    onClose={() => setOpen(false)}
                    snapPoints={[0.85]}
                    ariaLabel={t('customize_title')}
                    contentClassName="flex flex-col"
                >
                    <SheetHeader onClose={() => setOpen(false)} />

                    <CustomizePanel
                        hideHeader
                        draft={draft}
                        toggle={toggle}
                        setSection={setSection}
                        reset={reset}
                        apply={apply}
                        isMutating={isMutating}
                        onClose={() => setOpen(false)}
                    />
                </UIBottomSheet>
            )}
        </div>
    )
}

function SheetHeader({ onClose }: { onClose: () => void }) {
    const t = useTranslations('compare')
    const drag = useBottomSheetDrag()
    return (
        <div
            {...(drag?.handlers ?? {})}
            style={drag?.style}
            className="flex items-start justify-between gap-3 border-b border-border px-4 pb-3 select-none touch-pan-y cursor-grab active:cursor-grabbing"
        >
            <div>
                <div className="text-base font-semibold text-text-base">{t('customize_title')}</div>
                <div className="mt-0.5 text-xs text-text-muted">{t('customize_hint_mobile')}</div>
            </div>
            <button
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="rounded-md p-1 text-text-muted hover:bg-surface-muted transition-colors cursor-pointer"
            >
                <X className="size-5" aria-hidden />
            </button>
        </div>
    )
}
