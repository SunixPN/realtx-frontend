'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, Train, MapPin, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSuggest, type SuggestItemType } from '@/entities/estate'
import { usePopoverPosition } from '@/shared/helpers/use-popover-position'
import { cn } from '@/shared/helpers/cn'
type SearchSuggestProps = {
    value: string | undefined
    onChange: (next: string | undefined) => void
}
function useDebounced<T>(value: T, delay: number): T {
    const [d, setD] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setD(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return d
}
export function SearchSuggest({ value, onChange }: SearchSuggestProps) {
    const t = useTranslations('filters')
    const [input, setInput] = useState(value ?? '')
    const [open, setOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setInput(value ?? '')
    }, [value])

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)')
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    const debounced = useDebounced(input.trim(), 250)
    const { data: suggestions = [], isValidating: isFetching } = useSuggest(debounced, 10, { enabled: open })
    const pos = usePopoverPosition(wrapperRef, open)
    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            const tgt = e.target as Node
            const inWrapper = wrapperRef.current?.contains(tgt)
            const inPopover = (tgt as HTMLElement)?.closest?.('[data-suggest-popover="true"]')
            if (!inWrapper && !inPopover) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])
    const commit = (next: string | undefined) => {
        setInput(next ?? '')
        onChange(next && next.trim() ? next : undefined)
        setOpen(false)
        inputRef.current?.blur()
    }
    const clear = () => {
        setInput('')
        onChange(undefined)
        setOpen(false)
    }
    return (
        <div ref={wrapperRef} className="relative">
            <div
                className={cn(
                    'flex h-9 w-full items-center gap-2 rounded-sm border bg-surface-page px-3 transition-colors lg:w-96',
                    open ? 'border-brand ring-2 ring-brand/20' : 'border-border-strong hover:border-text-faint',
                )}
            >
                <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
                <input
                    ref={inputRef}
                    type="text"
                    size={1}
                    suppressHydrationWarning
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => { if (typeof window !== 'undefined') window.scrollTo(0, 0) }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') commit(input.trim() || undefined)
                        if (e.key === 'Escape') setOpen(false)
                    }}
                    placeholder={t('search_placeholder')}
                    style={{ minWidth: 0 }}
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-base placeholder:text-text-muted outline-none"
                />
                {input && (
                    <button
                        type="button"
                        aria-label={t('search_clear_aria')}
                        onClick={clear}
                        className="shrink-0 cursor-pointer rounded-full p-0.5 text-text-faint hover:bg-surface-subtle hover:text-text-base"
                    >
                        <X className="size-3.5" />
                    </button>
                )}
            </div>
            {open && pos && typeof window !== 'undefined' && createPortal(
                <ul
                    data-suggest-popover="true"
                    style={isMobile
                        ? { position: 'fixed', top: pos.top + 4, left: 8, right: 8 }
                        : { position: 'fixed', top: pos.top + 4, left: pos.left, width: pos.width }}
                    className="z-[9999] max-h-72 overflow-y-auto rounded-sm border border-border bg-surface-raised py-1 shadow-lg"
                >
                    {suggestions.length === 0 && !isFetching && (
                        <li className="px-3 py-2 text-sm text-text-faint">
                            {debounced ? t('search_no_results') : t('search_start_typing')}
                        </li>
                    )}
                    {suggestions.map((s: SuggestItemType) => (
                        <li
                            key={`${s.type}-${s.value}`}
                            onClick={() => commit(s.value)}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-surface-subtle"
                        >
                            {s.type === 'metro'
                                ? <Train className="size-4 shrink-0 text-brand" />
                                : <MapPin className="size-4 shrink-0 text-text-muted" />}
                            <span className="flex-1 truncate">{s.value}</span>
                            <span className="text-xs text-text-faint">
                                {s.type === 'metro' ? t('search_type_metro') : t('search_type_address')}
                            </span>
                        </li>
                    ))}
                </ul>,
                document.body,
            )}
        </div>
    )
}
