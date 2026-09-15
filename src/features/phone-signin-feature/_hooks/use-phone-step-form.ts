'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithPhoneNumber, type RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '@/shared/firebase/firebase';
import { phoneSchema, PhoneValues } from '@/features/phone-signin-feature/_schemas/phone-signin-schema';
import { phoneConfirmationStore } from '@/entities/phone-auth/state/phone-confirmation-store';
import { showToast } from '@/shared/helpers/show-toast';
import { DEFAULT_COUNTRY_CODE } from '@/shared/const/countries';

type UsePhoneStepFormArgs = {
    getVerifier:   () => RecaptchaVerifier | null;
    resetVerifier: () => RecaptchaVerifier | null;
    onSuccess:     (phone: string) => void;
};

export const usePhoneStepForm = ({ getVerifier, resetVerifier, onSuccess }: UsePhoneStepFormArgs) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PhoneValues>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { countryCode: DEFAULT_COUNTRY_CODE, phone: '' },
    });

    const onSubmit = async (values: PhoneValues) => {
        const verifier = getVerifier();
        if (!verifier) return;

        setIsSubmitting(true);
        try {
            const fullPhone = values.countryCode + values.phone.replace(/\D/g, '');
            const confirmation = await signInWithPhoneNumber(firebaseAuth, fullPhone, verifier);
            phoneConfirmationStore.set(confirmation, fullPhone);
            onSuccess(fullPhone);
        } catch {
            showToast({ status: 'error', text: 'Не удалось отправить SMS' });
            resetVerifier();
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, onSubmit, isSubmitting };
};
