import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signInSchema, SignInValues } from '@/features/sign-in-feature/_schemas/sign-in-schema';
import { signInMutation } from '@/features/sign-in-feature/_api/sign-in-mutation';

export const useSignInForm = () => {
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const { mutate: login, isPending: isSubmitting } = useMutation({
      ...signInMutation,
  });

  const onSubmit = async (values: SignInValues) => {
    login(values);
  };

  return { form, onSubmit, isSubmitting };
};
