'use client';

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { firebaseAuth } from '@/shared/firebase/firebase';
import { useGoogleLoginMutation } from '@/features/google-auth-button-feature/_api/google-login-mutation';
import { showToast } from '@/shared/helpers/show-toast';
import { ROUTES } from '@/shared/const/routes';

const POPUP_CLOSE_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export const useGoogleAuth = () => {
    const t = useTranslations('auth');
    const router = useRouter();
    const [isPopupPending, setIsPopupPending] = useState(false);

    const { trigger, isMutating: isMutationPending } = useGoogleLoginMutation();

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
            const auth = await trigger({ idToken });
            if (auth) router.push(ROUTES.ROOT);
        } catch (error) {
            const code = (error as { code?: string })?.code;
            if (!POPUP_CLOSE_CODES.has(code ?? '')) {
                showToast({ status: 'error', text: t('google_error') });
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
