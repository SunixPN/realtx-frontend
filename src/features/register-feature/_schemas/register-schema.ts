import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .max(100, 'Имя слишком длинное')
        .optional(),
    email: z
        .string()
        .min(1, 'Введите email')
        .email('Некорректный email')
        .max(255, 'Email слишком длинный'),
    password: z
        .string()
        .min(1, 'Введите пароль')
        .min(8, 'Минимум 8 символов')
        .max(72, 'Максимум 72 символа')
        .regex(/[a-z]/, 'Добавьте строчную букву')
        .regex(/[A-Z]/, 'Добавьте заглавную букву')
        .regex(/[0-9]/, 'Добавьте цифру')
        .regex(/[^a-zA-Z0-9]/, 'Добавьте спецсимвол (!@#$% и т.д.)'),
});

export type RegisterValues = z.infer<typeof registerSchema>;
