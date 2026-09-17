import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createSignInSchema, SignInValues } from '@/features/sign-in-feature/_schemas/sign-in-schema';
import { useSignInMutation } from '@/features/sign-in-feature/_api/sign-in-mutation';
import { ROUTES } from '@/shared/const/routes';

export const useSignInForm = () => {
  const router = useRouter();
  const tV = useTranslations('validation');
  const schema = useMemo(() => createSignInSchema(tV), [tV]);
  const form = useForm<SignInValues>({ resolver: zodResolver(schema) });
  const { trigger, isMutating: isSubmitting } = useSignInMutation();

  const onSubmit = async (values: SignInValues) => {
    const result = await trigger(values);
    if (result) router.push(ROUTES.ROOT);
  };

  return { form, onSubmit, isSubmitting };
};
