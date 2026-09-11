import { type PasswordStrength } from '@/shared/ui/ui-password-strength';

export function usePasswordStrength(password: string): PasswordStrength {
    if (!password) return 'weak';

    const criteria = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^a-zA-Z0-9]/.test(password),
        password.length >= 12,
    ];

    const score = criteria.filter(Boolean).length;

    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}
