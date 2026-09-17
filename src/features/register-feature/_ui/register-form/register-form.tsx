'use client';

import { useTranslations } from 'next-intl';
import { UIInput } from '@/shared/ui/ui-input';
import UIInputPassword from '@/shared/ui/ui-input-password/ui-input-password';
import { UIButton } from '@/shared/ui/ui-button';
import { UIPasswordStrength } from '@/shared/ui/ui-password-strength';
import { useRegisterForm } from '@/features/register-feature/_hooks/use-register-form';
import { usePasswordStrength } from '@/shared/hooks/use-password-strength';

export default function RegisterForm() {
    const t = useTranslations('auth.register');
    const { form, onSubmit, isSubmitting } = useRegisterForm();
    const password = form.watch('password') ?? '';
    const strength = usePasswordStrength(password);

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
        >
            <UIInput
                label={t('name_label')}
                placeholder={t('name_placeholder')}
                autoComplete="given-name"
                error={form.formState.errors.name?.message}
                {...form.register('name')}
            />

            <UIInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                hint={t('email_hint')}
                error={form.formState.errors.email?.message}
                {...form.register('email')}
            />

            <div>
                <UIInputPassword
                    label={t('password_label')}
                    placeholder={t('password_placeholder')}
                    autoComplete="new-password"
                    error={form.formState.errors.password?.message}
                    {...form.register('password')}
                />
                <UIPasswordStrength value={strength} isEmpty={!password} />
            </div>

            <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                {t('submit')}
            </UIButton>
        </form>
    );
}
