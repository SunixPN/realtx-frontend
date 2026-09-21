'use client';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useResetConfirmMutation } from '@/features/reset-confirm-feature/_api/reset-confirm-mutation';
import { createResetConfirmSchema, ResetConfirmValues } from '@/features/reset-confirm-feature/_schemas/reset-confirm-schema';
type UseResetConfirmFormArgs = {
    token:     string;
    onSuccess: () => void;
};
export const useResetConfirmForm = ({ token, onSuccess }: UseResetConfirmFormArgs) => {
    const tV = useTranslations('validation');
    const schema = useMemo(() => createResetConfirmSchema(tV), [tV]);
    const form = useForm<ResetConfirmValues>({
        resolver: zodResolver(schema),
        defaultValues: { password: '', passwordConfirm: '' },
    });
    const { trigger, isMutating: isSubmitting } = useResetConfirmMutation();
    const onSubmit = async (values: ResetConfirmValues) => {
        const result = await trigger({ token, password: values.password });
        if (result) onSuccess();
    };
    return { form, onSubmit, isSubmitting };
};
