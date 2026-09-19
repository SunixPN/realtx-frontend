'use client';

import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useLogoutMutation } from '@/features/logout-feature/_api/logout-mutation';
import { ROUTES } from '@/shared/const/routes';
import { beginTopLoader } from '@/shared/ui/top-loader/top-loader';
import { clearTokensAction } from "@/shared/actions/clear-tokens-action";
import { authKey } from "@/entities/me/api/auth-query";

export function useLogout() {
    const router = useRouter();

    const { trigger, isMutating: isPending } = useLogoutMutation();

    const logout = async () => {
        beginTopLoader();
        await trigger();
        await clearTokensAction();
        // Сбрасываем SWR-кеш юзера синхронно, чтобы Header/guard-и увидели null
        // ещё до навигации — иначе proxy может увидеть stale куки и отправить нас
        // обратно на root по обновлённому || условию.
        await mutate(authKey, null, { revalidate: false });
        router.replace(ROUTES.SIGN_IN);
        router.refresh();
    };

    return { logout, isPending };
}
