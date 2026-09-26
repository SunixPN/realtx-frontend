'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLogoutMutation } from '@/features/logout-feature/_api/logout-mutation';
import { ROUTES } from '@/shared/const/routes';
import { clearTokensAction } from '@/shared/actions/clear-tokens-action';
import { showToastAfterReload } from '@/shared/helpers/show-toast';

export function useLogout() {
    const t = useTranslations('auth.logout');
    const { trigger, isMutating } = useLogoutMutation();
    // Держим pending до выгрузки страницы, а не только пока идёт запрос
    const [isLeaving, setIsLeaving] = useState(false);

    const logout = async () => {
        try {
            await trigger();
        } catch {
            return; // тост с ошибкой показал onError
        }
        setIsLeaving(true);
        await clearTokensAction();
        showToastAfterReload({ status: 'success', text: t('toast_success') });
        // Полная перезагрузка, а не router.replace: сбрасывает все клиентские кэши
        // прошлого пользователя (SWR, React Query — избранное, сравнение и т.д.),
        // а текущая страница остаётся на экране, пока грузится новая
        window.location.replace(ROUTES.SIGN_IN);
    };

    return { logout, isPending: isMutating || isLeaving };
}
