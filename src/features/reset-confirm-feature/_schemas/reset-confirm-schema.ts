import { z } from 'zod';
import { passwordSchema } from '@/shared/schemas/password-schema';

export const resetConfirmSchema = z
    .object({
        password:        passwordSchema,
        passwordConfirm: z.string().min(1, 'Повторите пароль'),
    })
    .refine((v) => v.password === v.passwordConfirm, {
        path:    ['passwordConfirm'],
        message: 'Пароли не совпадают',
    });

export type ResetConfirmValues = z.infer<typeof resetConfirmSchema>;
