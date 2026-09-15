'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { UILinkChecker } from '@/shared/ui/ui-link-checker';
import { UIExpiredLink } from '@/shared/ui/ui-expired-link';
import { ROUTES } from '@/shared/const/routes';
import { verifyEmailQuery } from '@/features/verify-email-feature/_api/verify-email-query';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

export default function VerifyEmailFeature() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const { isSuccess, isError, isLoading } = useQuery(verifyEmailQuery(token));

    useEffect(() => {
        if (isSuccess) router.replace(`${ROUTES.PROFILE}?email-verified=1`);
    }, [isSuccess, router]);

    const renderContent = () => {
        if (!token || isError) {
            return (
                <UIExpiredLink
                    title="Ссылка не работает"
                    subtitle="Она либо уже использована, либо срок её действия истёк. Запросите новую в профиле."
                    actionLabel="Перейти в профиль"
                    actionHref={ROUTES.PROFILE}
                />
            );
        }

        // Пока идёт запрос — и после успеха до срабатывания редиректа: показываем чекер
        return (
            <UILinkChecker
                title={isLoading ? 'Проверяем ссылку' : 'Почта подтверждена'}
                subtitle={
                    isLoading
                        ? 'Секунду — подтверждаем ваш email.'
                        : 'Открываем ваш профиль…'
                }
                note={<>Ссылка одноразовая — работает только при первом переходе.</>}
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
