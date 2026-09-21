import { z } from 'zod';
type T = (key: string) => string;

export const createPasswordSchema = (t: T) =>
    z
        .string()
        .min(1, t('password_required'))
        .min(8, t('password_min'))
        .max(72, t('password_max'))
        .regex(/[a-z]/, t('password_lower'))
        .regex(/[A-Z]/, t('password_upper'))
        .regex(/[0-9]/, t('password_digit'))
        .regex(/[^a-zA-Z0-9]/, t('password_special'));
export const createEmailSchema = (t: T) =>
    z
        .string()
        .min(1, t('email_required'))
        .email(t('email_invalid'))
        .max(255, t('email_too_long'));
