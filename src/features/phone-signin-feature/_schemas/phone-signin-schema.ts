import { z } from 'zod';

export const phoneSchema = z.object({
    countryCode: z.string().min(1),
    phone: z
        .string()
        .min(1, 'Введите номер')
        .regex(/^[\d\s]+$/, 'Только цифры')
        .refine((v) => v.replace(/\D/g, '').length >= 7, 'Слишком короткий номер')
        .refine((v) => v.replace(/\D/g, '').length <= 15, 'Слишком длинный номер'),
});

export type PhoneValues = z.infer<typeof phoneSchema>;

export const codeSchema = z.object({
    code: z.string().length(6, 'Введите 6 цифр').regex(/^\d{6}$/, 'Только цифры'),
});

export type CodeValues = z.infer<typeof codeSchema>;
