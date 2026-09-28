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
    const [isLeaving, setIsLeaving] = useState(false);

    const logout = async () => {
        try {
            await trigger();
        } catch {
            return;
        }
        setIsLeaving(true);
        await clearTokensAction();
        showToastAfterReload({ status: 'success', text: t('toast_success') });
        window.location.replace(ROUTES.SIGN_IN);
    };

    return { logout, isPending: isMutating || isLeaving };
}
