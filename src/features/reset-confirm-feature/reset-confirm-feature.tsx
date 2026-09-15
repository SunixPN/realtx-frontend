'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { UILinkChecker } from '@/shared/ui/ui-link-checker';
import { UIExpiredLink } from '@/shared/ui/ui-expired-link';
import { ROUTES } from '@/shared/const/routes';
import { resetVerifyQuery } from '@/features/reset-confirm-feature/_api/reset-verify-query';
import ResetConfirmForm from '@/features/reset-confirm-feature/_ui/reset-confirm-form/reset-confirm-form';
import ResetSuccessView from '@/features/reset-confirm-feature/_ui/reset-success-view/reset-success-view';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

export default function ResetConfirmFeature() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const [isDone, setIsDone] = useState(false);

    const { isLoading, isError } = useQuery(resetVerifyQuery(token));

    const renderContent = () => {
        if (isDone) return <ResetSuccessView />;

        if (!token || isError) {
            return (
                <UIExpiredLink
                    title="Ссылка не работает"
                    subtitle="Она либо уже использована, либо ей больше часа. Запросите новую — придёт за пару секунд."
                    actionLabel="Запросить новую ссылку"
                    actionHref={ROUTES.RESET}
                />
            );
        }

        if (isLoading) {
            return (
                <UILinkChecker
                    title="Проверяем ссылку"
                    subtitle="Секунду — убеждаемся, что ссылка действительна."
                    note={
                        <>Ссылка одноразовая — если открылась дважды или прошёл час с момента отправки, увидите ошибку.</>
                    }
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
