'use client';

import { useTranslations } from 'next-intl';
import UIInputPassword from '@/shared/ui/ui-input-password/ui-input-password';
import { UIButton } from '@/shared/ui/ui-button';
import { UIPasswordStrength } from '@/shared/ui/ui-password-strength';
import { usePasswordStrength } from '@/shared/hooks/use-password-strength';
import { IconKey } from '@/shared/ui/ui-icons';
import { useResetConfirmForm } from '@/features/reset-confirm-feature/_hooks/use-reset-confirm-form';

type ResetConfirmFormProps = {
    token:     string;
    onSuccess: () => void;
};

export default function ResetConfirmForm({ token, onSuccess }: ResetConfirmFormProps) {
    const t = useTranslations('auth.reset_confirm');
    const { form, onSubmit, isSubmitting } = useResetConfirmForm({ token, onSuccess });

    const password = form.watch('password') ?? '';
    const strength = usePasswordStrength(password);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-1 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-bg text-brand">
                    <IconKey size={28} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">{t('title')}</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    {t('subtitle')}
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

                <UIInputPassword
                    label={t('password_confirm_label')}
                    placeholder={t('password_confirm_placeholder')}
                    autoComplete="new-password"
                    error={form.formState.errors.passwordConfirm?.message}
                    {...form.register('passwordConfirm')}
                />

                <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                    {t('submit')}
                </UIButton>
            </form>
        </div>
    );
}
