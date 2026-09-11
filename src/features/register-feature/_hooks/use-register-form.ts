import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterValues } from '@/features/register-feature/_schemas/register-schema';
import { registerMutation } from '@/features/register-feature/_api/register-mutation';
import { ROUTES } from '@/shared/const/routes';

export const useRegisterForm = () => {
    const router = useRouter();
    const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
    const { mutate: register, isPending: isSubmitting } = useMutation({
        ...registerMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            registerMutation.onSuccess?.(data, variables, onMutateResult, context);
            router.push(ROUTES.ROOT);
        },
    });

    const onSubmit = (values: RegisterValues) => {
        const name = values.name?.trim() || undefined;
        register({ ...values, name });
    };

    return { form, onSubmit, isSubmitting };
};
