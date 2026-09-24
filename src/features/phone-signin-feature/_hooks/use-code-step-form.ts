'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useRouter from '@/shared/lib/use-router';
import { signInWithPhoneNumber, type RecaptchaVerifier } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { firebaseAuth } from '@/shared/firebase/firebase';
import { createCodeSchema, CodeValues } from '@/features/phone-signin-feature/_schemas/phone-signin-schema';
import { usePhoneLoginMutation } from '@/features/phone-signin-feature/_api/phone-login-mutation';
import { phoneConfirmationStore } from '@/entities/phone-auth/state/phone-confirmation-store';
import { showToast } from '@/shared/helpers/show-toast';
import { ROUTES } from '@/shared/const/routes';

type UseCodeStepFormArgs = {
    resetVerifier: () => RecaptchaVerifier | null;
    onResendDone:  () => void;
    /**
     * Что делать с Firebase ID токеном после верного кода. По умолчанию — вход.
     * Вернуть true, если всё прошло успешно (ошибки показывает сам колбэк).
     */
    onVerified?:   (idToken: string) => Promise<boolean>;
};

export const useCodeStepForm = ({ resetVerifier, onResendDone, onVerified }: UseCodeStepFormArgs) => {
    const router = useRouter();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const tV = useTranslations('validation');
    const tPhone = useTranslations('auth.phone');
    const schema = useMemo(() => createCodeSchema(tV), [tV]);

    const form = useForm<CodeValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: '' },
    });

    const { trigger: login, isMutating: isMutationPending } = usePhoneLoginMutation();

    const onSubmit = async (values: CodeValues) => {
        const { confirmation } = phoneConfirmationStore.get();
        if (!confirmation) {
            showToast({ status: 'error', text: tPhone('toast_session_expired') });
            return;
        }
        setIsConfirming(true);
        let idToken: string;
        try {
            const result = await confirmation.confirm(values.code);
            idToken = await result.user.getIdToken();
        } catch {
            form.setError('code', { message: tPhone('error_invalid_code') });
            setIsConfirming(false);
            return;
        }
        try {
            if (onVerified) {
                if (await onVerified(idToken)) phoneConfirmationStore.clear();
                return;
            }
            const auth = await login({ idToken });
            if (auth) {
                phoneConfirmationStore.clear();
                router.push(ROUTES.ROOT);
            }
        } finally {
            setIsConfirming(false);
        }
    };

    const resend = async () => {
        const { phone } = phoneConfirmationStore.get();
        if (!phone) return;
        const verifier = resetVerifier();
        if (!verifier) return;
        setIsResending(true);
        try {
            const confirmation = await signInWithPhoneNumber(firebaseAuth, phone, verifier);
            phoneConfirmationStore.set(confirmation, phone);
            showToast({ status: 'success', text: tPhone('toast_sms_resent') });
            onResendDone();
        } catch {
            showToast({ status: 'error', text: tPhone('toast_sms_failed') });
        } finally {
            setIsResending(false);
        }
    };

    return {
        form,
        onSubmit,
        resend,
        isSubmitting: isConfirming || isMutationPending,
        isResending,
    };
};
