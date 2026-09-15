'use client';

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
    const { form, onSubmit, isSubmitting } = useResetConfirmForm({ token, onSuccess });

    const password = form.watch('password') ?? '';
    const strength = usePasswordStrength(password);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-1 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-bg text-brand">
                    <IconKey size={28} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">Новый пароль</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    Придумайте пароль минимум из 8 символов. После сохранения войдите
                    с ним — все активные сессии на других устройствах будут отключены.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div>
                    <UIInputPassword
                        label="Новый пароль"
                        placeholder="Минимум 8 символов"
                        autoComplete="new-password"
                        error={form.formState.errors.password?.message}
                        {...form.register('password')}
                    />
                    <UIPasswordStrength value={strength} isEmpty={!password} />
                </div>

                <UIInputPassword
                    label="Повторите пароль"
                    placeholder="Ещё раз тот же пароль"
                    autoComplete="new-password"
                    error={form.formState.errors.passwordConfirm?.message}
                    {...form.register('passwordConfirm')}
                />

                <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                    Сохранить пароль
                </UIButton>
            </form>
        </div>
    );
}
