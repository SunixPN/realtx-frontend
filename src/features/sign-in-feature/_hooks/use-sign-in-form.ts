import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signInSchema, SignInValues } from '@/features/sign-in-feature/_schemas/sign-in-schema';
import { signInMutation } from '@/features/sign-in-feature/_api/sign-in-mutation';
import { ROUTES } from '@/shared/const/routes';

export const useSignInForm = () => {
  const router = useRouter();
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const { mutate: login, isPending: isSubmitting } = useMutation({
      ...signInMutation,
      onSuccess: (data, variables, onMutateResult, context) => {
          signInMutation.onSuccess?.(data, variables, onMutateResult, context);
          router.push(ROUTES.ROOT);
      },
  });

  const onSubmit = async (values: SignInValues) => {
    login(values);
  };

  return { form, onSubmit, isSubmitting };
};
