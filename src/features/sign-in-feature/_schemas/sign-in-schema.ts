import {z} from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, 'Введите email')
        .email('Некорректный email'),
    password: z
        .string()
        .min(1, 'Введите пароль')
        .min(8, 'Минимум 8 символов'),
});

export type SignInValues = z.infer<typeof signInSchema>;