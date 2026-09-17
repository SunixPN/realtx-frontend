'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { IconCheck } from '@/shared/ui/ui-icons';
import { ROUTES } from '@/shared/const/routes';

export default function ResetSuccessView() {
    const t = useTranslations('auth.reset_confirm');
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <IconCheck size={28} strokeWidth={3} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">{t('success_title')}</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    {t('success_subtitle')}
                </p>
            </div>

            <Link
                href={ROUTES.SIGN_IN}
                className="flex h-11 items-center justify-center rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover"
            >
                {t('success_action')}
            </Link>
        </div>
    );
}
