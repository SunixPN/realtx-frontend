'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UILinkChecker } from '@/shared/ui/ui-link-checker';
import { UIExpiredLink } from '@/shared/ui/ui-expired-link';
import { ROUTES } from '@/shared/const/routes';
import { useResetVerify } from '@/features/reset-confirm-feature/_api/reset-verify-query';
import ResetConfirmForm from '@/features/reset-confirm-feature/_ui/reset-confirm-form/reset-confirm-form';
import ResetSuccessView from '@/features/reset-confirm-feature/_ui/reset-success-view/reset-success-view';
import { UIAuthShell } from '@/shared/ui/ui-auth-shell';

export default function ResetConfirmFeature() {
    const t = useTranslations('auth.reset_confirm');
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const [isDone, setIsDone] = useState(false);

    const { isLoading, error } = useResetVerify(token);
    const isError = !!error;

    const renderContent = () => {
        if (isDone) return <ResetSuccessView />;

        if (!token || isError) {
            return (
                <UIExpiredLink
                    title={t('expired_title')}
                    subtitle={t('expired_subtitle')}
                    actionLabel={t('expired_action')}
                    actionHref={ROUTES.RESET}
                />
            );
        }

        if (isLoading) {
            return (
                <UILinkChecker
                    title={t('checking_title')}
                    subtitle={t('checking_subtitle')}
                    note={<>{t('checking_note')}</>}
                />
            );
        }

        return <ResetConfirmForm token={token} onSuccess={() => setIsDone(true)} />;
    };

    return <UIAuthShell>{renderContent()}</UIAuthShell>;
}
