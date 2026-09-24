'use client'
import type { ReactNode } from 'react'
import { cn } from '@/shared/helpers/cn'

export function ProfileSection({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="rounded-lg border border-border bg-surface-page p-4 sm:p-5">
            <div className="mb-3 sm:mb-4">
                <h2 className="text-lg font-semibold text-text-base">{title}</h2>
                {description && <p className="mt-1 max-w-2xl text-xs text-text-faint">{description}</p>}
            </div>
            <div className="flex flex-col gap-2">{children}</div>
        </section>
    )
}

export function SegmentRow<T extends string>({
    label,
    value,
    options,
    onChange,
    disabled,
}: {
    label: string
    value: T
    options: { key: T; label: string; icon?: ReactNode }[]
    onChange: (value: T) => void
    disabled?: boolean
}) {
    return (
        <div className="flex flex-col gap-2 border-b border-border py-3 last:border-0 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-medium text-text-base">{label}</div>
            <div
                role="radiogroup"
                aria-label={label}
                className="flex w-full items-stretch gap-1 rounded-md border border-border bg-surface-page p-1 md:inline-flex md:w-auto"
            >
                {options.map((o) => (
                    <button
                        key={o.key}
                        type="button"
                        role="radio"
                        aria-checked={value === o.key}
                        disabled={disabled}
                        onClick={() => onChange(o.key)}
                        className={cn(
                            'flex flex-auto cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1.5 text-center text-sm font-medium transition-colors disabled:cursor-wait sm:px-3 md:flex-initial',
                            value === o.key
                                ? 'bg-brand text-white'
                                : 'text-text-muted hover:bg-surface-muted',
                        )}
                    >
                        {o.icon}
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export function ActionRow({
    icon,
    title,
    note,
    action,
    tone = 'neutral',
    onClick,
    disabled,
}: {
    icon: ReactNode
    title: string
    note: string
    action: string
    tone?: 'neutral' | 'danger'
    onClick: () => void
    disabled?: boolean
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3 sm:gap-4">
            <div className="flex min-w-0 items-start gap-3">
                <span className={cn('mt-0.5 shrink-0', tone === 'danger' ? 'text-error' : 'text-text-faint')}>
                    {icon}
                </span>
                <div className="min-w-0">
                    <div className={cn('text-sm font-medium', tone === 'danger' ? 'text-error' : 'text-text-base')}>
                        {title}
                    </div>
                    <div className="mt-0.5 max-w-lg text-xs text-text-faint">{note}</div>
                </div>
            </div>
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={cn(
                    'shrink-0 cursor-pointer rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                    tone === 'danger'
                        ? 'border-error/20 bg-error-bg text-error hover:border-error/40'
                        : 'border-border text-text-muted hover:bg-surface-muted hover:text-text-base',
                )}
            >
                {action}
            </button>
        </div>
    )
}
