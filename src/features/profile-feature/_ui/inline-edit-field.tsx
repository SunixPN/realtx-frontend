'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { IconLoader } from '@/shared/ui/ui-icons'
import { ProfileRow } from './profile-row'

type InlineEditFieldProps = {
    label: string
    value: string | null
    placeholder: string
    maxLength: number
    /** Пустое значение допустимо (очистить поле) */
    allowEmpty?: boolean
    emptyError?: string
    autoComplete?: string
    onSave: (value: string) => Promise<void>
}

export function InlineEditField({
    label,
    value,
    placeholder,
    maxLength,
    allowEmpty = false,
    emptyError,
    autoComplete,
    onSave,
}: InlineEditFieldProps) {
    const t = useTranslations('profile')
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value ?? '')
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) inputRef.current?.focus()
    }, [editing])

    const start = () => {
        setDraft(value ?? '')
        setError(null)
        setEditing(true)
    }
    const cancel = () => {
        setEditing(false)
        setError(null)
    }
    const submit = async (e?: FormEvent) => {
        e?.preventDefault()
        const next = draft.trim()
        if (!next && !allowEmpty) {
            setError(emptyError ?? null)
            return
        }
        if (next === (value ?? '')) {
            setEditing(false)
            return
        }
        setSaving(true)
        try {
            await onSave(next)
            setEditing(false)
        } catch {
            // Тост показывает вызывающая сторона — поле остаётся в режиме редактирования
        } finally {
            setSaving(false)
        }
    }

    if (!editing) {
        return (
            <ProfileRow
                label={label}
                value={
                    value
                        ? <span className="truncate text-base text-text-base">{value}</span>
                        : <span className="text-base text-text-faint">{t('not_specified')}</span>
                }
                action={
                    <button
                        type="button"
                        aria-label={t('edit_aria', { field: label.toLowerCase() })}
                        onClick={start}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted hover:text-text-base"
                    >
                        <Pencil className="size-4" />
                    </button>
                }
            />
        )
    }

    return (
        <ProfileRow
            label={label}
            value={
                <form onSubmit={submit} className="flex w-full min-w-0 flex-col gap-1" noValidate>
                    <div className="flex min-w-0 items-center gap-1.5">
                        <input
                            ref={inputRef}
                            value={draft}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            disabled={saving}
                            aria-label={label}
                            aria-invalid={!!error || undefined}
                            onChange={(e) => { setDraft(e.target.value); setError(null) }}
                            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); cancel() } }}
                            className={cn(
                                'h-10 min-w-0 flex-1 rounded-md border bg-surface-page px-3 text-base text-text-base outline-none transition-colors placeholder:text-text-faint',
                                error
                                    ? 'border-error focus:ring-2 focus:ring-error/20'
                                    : 'border-border focus:border-brand focus:ring-2 focus:ring-brand/20',
                            )}
                        />
                        <button
                            type="submit"
                            aria-label={t('save')}
                            disabled={saving}
                            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
                        >
                            {saving ? <IconLoader size={16} className="animate-spin" /> : <Check className="size-4" />}
                        </button>
                        <button
                            type="button"
                            aria-label={t('cancel')}
                            onClick={cancel}
                            disabled={saving}
                            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-surface-muted disabled:opacity-60"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                    {error && <span className="text-xs text-error">{error}</span>}
                </form>
            }
        />
    )
}
