'use client';

import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@/features/logout-feature/_api/logout-mutation';
import { ROUTES } from '@/shared/const/routes';
import { beginTopLoader } from '@/shared/ui/top-loader/top-loader';
import {clearTokensAction} from "@/shared/actions/clear-tokens-action";

export function useLogout() {
    const router = useRouter();

    const { trigger, isMutating: isPending } = useLogoutMutation();

    const logout = async () => {
        beginTopLoader();
        await trigger();
        await clearTokensAction()
        router.replace(ROUTES.SIGN_IN);
    };

    return { logout, isPending };
}
