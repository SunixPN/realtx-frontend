import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/shared/schemas/password-schema';

export const registerSchema = z.object({
    name: z
        .string()
        .max(100, 'Имя слишком длинное')
        .optional(),
    email: emailSchema,
    password: passwordSchema,
});

export type RegisterValues = z.infer<typeof registerSchema>;
