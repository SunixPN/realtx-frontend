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
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

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

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <UIAuthFooter />
        </div>
    );
}
