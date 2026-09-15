import { z } from 'zod';
import { emailSchema } from '@/shared/schemas/password-schema';

export const resetRequestSchema = z.object({
    email: emailSchema,
});

export type ResetRequestValues = z.infer<typeof resetRequestSchema>;
