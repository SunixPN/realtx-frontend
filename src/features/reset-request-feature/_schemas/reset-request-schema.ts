import { z } from 'zod';
import { createEmailSchema } from '@/shared/schemas/password-schema';

type T = (key: string) => string;

export const createResetRequestSchema = (t: T) =>
    z.object({
        email: createEmailSchema(t),
    });

export type ResetRequestValues = z.infer<ReturnType<typeof createResetRequestSchema>>;
