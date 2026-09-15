'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signInWithPhoneNumber, type RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '@/shared/firebase/firebase';
import { codeSchema, CodeValues } from '@/features/phone-signin-feature/_schemas/phone-signin-schema';
import { phoneLoginMutation } from '@/features/phone-signin-feature/_api/phone-login-mutation';
import { phoneConfirmationStore } from '@/entities/phone-auth/state/phone-confirmation-store';
import { showToast } from '@/shared/helpers/show-toast';
import { ROUTES } from '@/shared/const/routes';

type UseCodeStepFormArgs = {
    resetVerifier: () => RecaptchaVerifier | null;
    onResendDone:  () => void;
};

export const useCodeStepForm = ({ resetVerifier, onResendDone }: UseCodeStepFormArgs) => {
    const router = useRouter();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const form = useForm<CodeValues>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: '' },
    });

    const { mutate: login, isPending: isMutationPending } = useMutation({
        ...phoneLoginMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            phoneLoginMutation.onSuccess?.(data, variables, onMutateResult, context);
            phoneConfirmationStore.clear();
            router.push(ROUTES.ROOT);
        },
    });

    const onSubmit = async (values: CodeValues) => {
        const { confirmation } = phoneConfirmationStore.get();
        if (!confirmation) {
            showToast({ status: 'error', text: 'Сессия истекла, запросите код заново' });
            return;
        }
        setIsConfirming(true);
        try {
            const result = await confirmation.confirm(values.code);
            const idToken = await result.user.getIdToken();
            login({ idToken });
        } catch {
            form.setError('code', { message: 'Неверный код' });
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
            showToast({ status: 'success', text: 'Код отправлен повторно' });
            onResendDone();
        } catch {
            showToast({ status: 'error', text: 'Не удалось отправить SMS' });
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
