'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { resetConfirmMutation } from '@/features/reset-confirm-feature/_api/reset-confirm-mutation';
import { resetConfirmSchema, ResetConfirmValues } from '@/features/reset-confirm-feature/_schemas/reset-confirm-schema';

type UseResetConfirmFormArgs = {
    token:     string;
    onSuccess: () => void;
};

export const useResetConfirmForm = ({ token, onSuccess }: UseResetConfirmFormArgs) => {
    const form = useForm<ResetConfirmValues>({
        resolver: zodResolver(resetConfirmSchema),
        defaultValues: { password: '', passwordConfirm: '' },
    });

    const { mutate: confirm, isPending: isSubmitting } = useMutation({
        ...resetConfirmMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            resetConfirmMutation.onSuccess?.(data, variables, onMutateResult, context);
            onSuccess();
        },
    });

    const onSubmit = (values: ResetConfirmValues) => {
        confirm({ token, password: values.password });
    };

    return { form, onSubmit, isSubmitting };
};
