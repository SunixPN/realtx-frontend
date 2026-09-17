'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'

export function FavoritesEmpty() {
    const t = useTranslations('favorites')
    return (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-error-bg text-error">
                <Heart className="size-7" />
            </div>
            <div>
                <h2 className="text-2xl font-semibold text-text-base">{t('empty_title')}</h2>
                <p className="mt-2 text-sm text-text-muted max-w-sm">{t('empty_body')}</p>
            </div>
            <Link
                href={ROUTES.ROOT}
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
            >
                {t('go_to_search')}
            </Link>
        </div>
    )
}
