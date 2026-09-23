'use client'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'
export function FavoritesEmpty() {
    const t = useTranslations('favorites')
    return (
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-4 py-12 text-center sm:py-24">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-error-bg text-error sm:size-16">
                <Heart className="size-6 sm:size-7" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-text-base sm:text-2xl">{t('empty_title')}</h2>
                <p className="mt-2 text-sm text-text-muted max-w-sm">{t('empty_body')}</p>
            </div>
            <Link
                href={ROUTES.ROOT}
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover active:bg-brand-hover"
            >
                {t('go_to_search')}
            </Link>
        </div>
    )
}
