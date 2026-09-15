'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { resetRequestMutation } from '@/features/reset-request-feature/_api/reset-request-mutation';
import { resetRequestSchema, ResetRequestValues } from '@/features/reset-request-feature/_schemas/reset-request-schema';

type UseResetRequestFormArgs = {
    onSent: (email: string) => void;
};

export const useResetRequestForm = ({ onSent }: UseResetRequestFormArgs) => {
    const form = useForm<ResetRequestValues>({
        resolver: zodResolver(resetRequestSchema),
        defaultValues: { email: '' },
    });

    const { mutate: request, isPending: isSubmitting } = useMutation({
        ...resetRequestMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            resetRequestMutation.onSuccess?.(data, variables, onMutateResult, context);
            onSent(variables.email);
        },
    });

    const onSubmit = (values: ResetRequestValues) => {
        request(values);
    };

    return { form, onSubmit, isSubmitting };
};
