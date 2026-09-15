'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/shared/firebase/firebase';
import { googleLoginMutation } from '@/features/google-auth-button-feature/_api/google-login-mutation';
import { showToast } from '@/shared/helpers/show-toast';
import { ROUTES } from '@/shared/const/routes';

const POPUP_CLOSE_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export const useGoogleAuth = () => {
    const router = useRouter();
    const [isPopupPending, setIsPopupPending] = useState(false);

    const { mutate, isPending: isMutationPending } = useMutation({
        ...googleLoginMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            googleLoginMutation.onSuccess?.(data, variables, onMutateResult, context);
            router.push(ROUTES.ROOT);
        },
    });

    const signInWithGoogle = async () => {
        setIsPopupPending(true);
        let settled = false;
        const settle = () => {
            if (settled) return;
            settled = true;
            setIsPopupPending(false);
        };

        const onFocus = () => {
            window.removeEventListener('focus', onFocus);
            setTimeout(settle, 1500);
        };
        window.addEventListener('focus', onFocus);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(firebaseAuth, provider);
            window.removeEventListener('focus', onFocus);
            const idToken = await result.user.getIdToken();
            mutate({ idToken });
        } catch (error) {
            const code = (error as { code?: string })?.code;
            if (!POPUP_CLOSE_CODES.has(code ?? '')) {
                showToast({ status: 'error', text: 'Не удалось войти через Google' });
            }
        } finally {
            window.removeEventListener('focus', onFocus);
            settle();
        }
    };

    return {
        signInWithGoogle,
        isLoading: isPopupPending || isMutationPending,
    };
};
