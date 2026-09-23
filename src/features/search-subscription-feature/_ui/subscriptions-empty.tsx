'use client'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/const/routes'
export function SubscriptionsEmpty() {
    const t = useTranslations('subscriptions')
    return (
        <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-4 px-4 py-12 text-center sm:py-24">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand sm:size-16">
                <Bell className="size-6 sm:size-7" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-text-base sm:text-2xl">{t('empty_title')}</h2>
                <p className="mt-2 text-sm text-text-muted">{t('empty_body')}</p>
            </div>
            <Link
                href={ROUTES.ROOT}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-brand-hover active:bg-brand-hover sm:w-auto"
            >
                <Plus className="size-5" />
                {t('empty_cta')}
            </Link>
        </div>
    )
}
