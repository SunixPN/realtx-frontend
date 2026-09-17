import { z } from 'zod';

type T = (key: string) => string;

export const createPhoneSchema = (t: T) =>
    z.object({
        countryCode: z.string().min(1),
        phone: z
            .string()
            .min(1, t('phone_required'))
            .regex(/^[\d\s]+$/, t('phone_only_digits'))
            .refine((v) => v.replace(/\D/g, '').length >= 7, t('phone_too_short'))
            .refine((v) => v.replace(/\D/g, '').length <= 15, t('phone_too_long')),
    });

export type PhoneValues = z.infer<ReturnType<typeof createPhoneSchema>>;

export const createCodeSchema = (t: T) =>
    z.object({
        code: z.string().length(6, t('code_length')).regex(/^\d{6}$/, t('code_only_digits')),
    });

export type CodeValues = z.infer<ReturnType<typeof createCodeSchema>>;
