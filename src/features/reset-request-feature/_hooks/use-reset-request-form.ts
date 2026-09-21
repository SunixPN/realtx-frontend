'use client';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useResetRequestMutation } from '@/features/reset-request-feature/_api/reset-request-mutation';
import { createResetRequestSchema, ResetRequestValues } from '@/features/reset-request-feature/_schemas/reset-request-schema';
type UseResetRequestFormArgs = {
    onSent: (email: string) => void;
};
export const useResetRequestForm = ({ onSent }: UseResetRequestFormArgs) => {
    const tV = useTranslations('validation');
    const schema = useMemo(() => createResetRequestSchema(tV), [tV]);
    const form = useForm<ResetRequestValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    });
    const { trigger, isMutating: isSubmitting } = useResetRequestMutation();
    const onSubmit = async (values: ResetRequestValues) => {
        const result = await trigger(values);
        if (result) onSent(values.email);
    };
    return { form, onSubmit, isSubmitting };
};
