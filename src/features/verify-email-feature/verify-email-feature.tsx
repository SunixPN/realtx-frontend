'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UILinkChecker } from '@/shared/ui/ui-link-checker';
import { UIExpiredLink } from '@/shared/ui/ui-expired-link';
import { ROUTES } from '@/shared/const/routes';
import { useVerifyEmail } from '@/features/verify-email-feature/_api/verify-email-query';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

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
