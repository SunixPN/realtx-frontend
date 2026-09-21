import { z } from 'zod';
type T = (key: string) => string;
export const createSignInSchema = (t: T) =>
    z.object({
        email: z
            .string()
            .min(1, t('email_required'))
            .email(t('email_invalid')),
        password: z
            .string()
            .min(1, t('password_required'))
            .min(8, t('password_min')),
    });
export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>;
