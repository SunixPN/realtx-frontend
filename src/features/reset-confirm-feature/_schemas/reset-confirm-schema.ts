import { z } from 'zod';
import { createPasswordSchema } from '@/shared/schemas/password-schema';

type T = (key: string) => string;

export const createResetConfirmSchema = (t: T) =>
    z
        .object({
            password:        createPasswordSchema(t),
            passwordConfirm: z.string().min(1, t('password_confirm_required')),
        })
        .refine((v) => v.password === v.passwordConfirm, {
            path:    ['passwordConfirm'],
            message: t('passwords_not_match'),
        });

export type ResetConfirmValues = z.infer<ReturnType<typeof createResetConfirmSchema>>;
