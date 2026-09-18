'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UILinkChecker } from '@/shared/ui/ui-link-checker';
import { UIExpiredLink } from '@/shared/ui/ui-expired-link';
import { ROUTES } from '@/shared/const/routes';
import { useVerifyEmail } from '@/features/verify-email-feature/_api/verify-email-query';
import { UIAuthShell } from '@/shared/ui/ui-auth-shell';

export default function VerifyEmailFeature() {
    const t = useTranslations('auth.verify_email');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const { data, error, isLoading } = useVerifyEmail(token);
    const isSuccess = !!data;
    const isError = !!error;

    useEffect(() => {
        if (isSuccess) router.replace(`${ROUTES.PROFILE}?email-verified=1`);
    }, [isSuccess, router]);

    const renderContent = () => {
        if (!token || isError) {
            return (
                <UIExpiredLink
                    title={t('expired_title')}
                    subtitle={t('expired_subtitle')}
                    actionLabel={t('expired_action')}
                    actionHref={ROUTES.PROFILE}
                />
            );
        }

        return (
            <UILinkChecker
                title={isLoading ? t('checking_title') : t('verified_title')}
                subtitle={isLoading ? t('checking_subtitle') : t('verified_subtitle')}
                note={<>{t('note')}</>}
            />
        );
    };

    return <UIAuthShell>{renderContent()}</UIAuthShell>;
}
