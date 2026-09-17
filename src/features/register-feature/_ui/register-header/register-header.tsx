'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/const/routes';

export default function RegisterHeader() {
    const t = useTranslations('auth.register');
    return (
        <header>
            <h1 className="text-2xl font-semibold text-text-base">{t('title')}</h1>
            <p className="mt-1.5 text-sm text-text-muted">
                {t('have_account')}{' '}
                <Link href={ROUTES.SIGN_IN} className="font-medium text-brand hover:underline">
                    {t('sign_in')}
                </Link>
            </p>
        </header>
    );
}
