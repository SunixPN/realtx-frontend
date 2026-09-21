import { z } from 'zod';
import { createEmailSchema, createPasswordSchema } from '@/shared/schemas/password-schema';
type T = (key: string) => string;
export const createRegisterSchema = (t: T) =>
    z.object({
        name: z
            .string()
            .max(100, t('name_too_long'))
            .optional(),
        email: createEmailSchema(t),
        password: createPasswordSchema(t),
    });
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;
