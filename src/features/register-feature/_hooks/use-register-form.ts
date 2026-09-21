import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useRouter from '@/shared/lib/use-router';
import { useTranslations } from 'next-intl';
import { createRegisterSchema, RegisterValues } from '@/features/register-feature/_schemas/register-schema';
import { useRegisterMutation } from '@/features/register-feature/_api/register-mutation';
import { ROUTES } from '@/shared/const/routes';

export const useRegisterForm = () => {
    const router = useRouter();
    const tV = useTranslations('validation');
    const schema = useMemo(() => createRegisterSchema(tV), [tV]);
    const form = useForm<RegisterValues>({ resolver: zodResolver(schema) });
    const { trigger, isMutating: isSubmitting } = useRegisterMutation();

    const onSubmit = async (values: RegisterValues) => {
        const name = values.name?.trim() || undefined;
        const result = await trigger({ ...values, name });
        if (result) {
            router.push(ROUTES.ROOT);
        }
    };

    return { form, onSubmit, isSubmitting };
};
