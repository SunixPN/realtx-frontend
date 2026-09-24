'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'

export function AddColumnCta() {
    const t = useTranslations('compare')
    return (
        <Link
            href={ROUTES.ROOT}
            className="flex min-h-full flex-col items-center justify-center gap-2 border-l-2 border-dashed border-border p-6 text-sm text-text-muted hover:bg-surface-muted transition-colors cursor-pointer"
        >
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Plus className="size-5" aria-hidden />
            </div>
            {t('add_column_cta')}
        </Link>
    )
}
