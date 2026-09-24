'use client'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'

export function CompareEmpty() {
    const t = useTranslations('compare')
    return (
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 py-16 text-center md:py-24">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Scale className="size-7" aria-hidden />
            </div>
            <div>
                <h1 className="text-2xl font-semibold text-text-base">{t('empty_title')}</h1>
                <p className="mt-2 text-md text-text-muted">{t('empty_desc')}</p>
            </div>
            <Link
                href={ROUTES.ROOT}
                className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors cursor-pointer"
            >
                {t('cta_search')}
            </Link>
        </div>
    )
}
