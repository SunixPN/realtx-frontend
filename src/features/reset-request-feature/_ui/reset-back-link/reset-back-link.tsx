'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { IconArrowLeft } from '@/shared/ui/ui-icons';
import { ROUTES } from '@/shared/const/routes';
export default function ResetBackLink() {
    const t = useTranslations('auth.reset_request');
    return (
        <Link
            href={ROUTES.SIGN_IN}
            className="-ml-2 flex w-fit items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-text-muted transition-colors active:bg-surface-muted hover:text-text-base"
        >
            <IconArrowLeft size={14} />
            {t('back_to_signin')}
        </Link>
    );
}
