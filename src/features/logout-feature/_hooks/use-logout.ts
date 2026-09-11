'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logoutMutation } from '@/features/logout-feature/_api/logout-mutation';
import { ROUTES } from '@/shared/const/routes';

export function useLogout() {
    const router = useRouter();

    const { mutate: logout, isPending } = useMutation({
        ...logoutMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            logoutMutation.onSuccess?.(data, variables, onMutateResult, context);
            router.replace(ROUTES.SIGN_IN);
        },
    });

    return { logout, isPending };
}
