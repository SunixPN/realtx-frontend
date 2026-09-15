'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Train, MapPin, X } from 'lucide-react'
import { suggestQuery, type SuggestItemType } from '@/entities/estate'
import { usePopoverPosition } from '@/shared/helpers/use-popover-position'
import { cn } from '@/shared/helpers/cn'

type SearchSuggestProps = {
    value: string | undefined
    onChange: (next: string | undefined) => void
}

/**
 * Debounce локальный: сам инпут отражает `input` мгновенно, а `debounced`
 * (для запроса suggest'ов) отстаёт на 250мс — не палим бэк на каждый keystroke.
 */
function useDebounced<T>(value: T, delay: number): T {
    const [d, setD] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setD(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return d
}

export function SearchSuggest({ value, onChange }: SearchSuggestProps) {
    // input — то, что видит пользователь; commited (value) приезжает извне из URL.
    // При наборе не пушим в URL на каждый символ — только при выборе или Enter,
    // иначе router.replace() отменит фокус и подсказки схлопнутся.
    const [input, setInput] = useState(value ?? '')
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Синхронизация: если value поменялось «снаружи» (напр. очистили все фильтры),
    // подтягиваем в локальный input.
    useEffect(() => {
        setInput(value ?? '')
    }, [value])

    const debounced = useDebounced(input.trim(), 250)
    const { data: suggestions = [], isFetching } = useQuery({
        ...suggestQuery(debounced, 10),
        enabled: open,
    })

    const pos = usePopoverPosition(wrapperRef, open)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            const t = e.target as Node
            const inWrapper = wrapperRef.current?.contains(t)
            const inPopover = (t as HTMLElement)?.closest?.('[data-suggest-popover="true"]')
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
                    'flex h-9 w-96 items-center gap-2 rounded-sm border bg-surface-page px-3 transition-colors',
                    open ? 'border-brand ring-2 ring-brand/20' : 'border-border-strong hover:border-text-faint',
                )}
            >
                <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') commit(input.trim() || undefined)
                        if (e.key === 'Escape') setOpen(false)
                    }}
                    placeholder="Адрес или метро"
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-base placeholder:text-text-muted outline-none"
                />
                {input && (
                    <button
                        type="button"
                        aria-label="Очистить"
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
                    style={{
                        position: 'fixed',
                        top: pos.top + 4,
                        left: pos.left,
                        width: pos.width,
                    }}
                    className="z-[9999] max-h-72 overflow-y-auto rounded-sm border border-border bg-surface-raised py-1 shadow-lg"
                >
                    {suggestions.length === 0 && !isFetching && (
                        <li className="px-3 py-2 text-sm text-text-faint">
                            {debounced ? 'Ничего не найдено' : 'Начните вводить'}
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
                                {s.type === 'metro' ? 'метро' : 'адрес'}
                            </span>
                        </li>
                    ))}
                </ul>,
                document.body,
            )}
        </div>
    )
}
