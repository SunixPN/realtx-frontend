'use client';

import { UIInput } from '@/shared/ui/ui-input';
import { UIButton } from '@/shared/ui/ui-button';
import { useResetRequestForm } from '@/features/reset-request-feature/_hooks/use-reset-request-form';

type ResetRequestFormProps = {
    onSent: (email: string) => void;
};

export default function ResetRequestForm({ onSent }: ResetRequestFormProps) {
    const { form, onSubmit, isSubmitting } = useResetRequestForm({ onSent });

    return (
        <div className="flex flex-col gap-5">
            <header>
                <h1 className="text-2xl font-semibold text-text-base">Сброс пароля</h1>
                <p className="mt-1.5 text-sm text-text-muted">
                    Введите email от аккаунта — пришлём ссылку для установки нового пароля.
                </p>
            </header>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <UIInput
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={form.formState.errors.email?.message}
                    {...form.register('email')}
                />

                <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                    Отправить ссылку
                </UIButton>
            </form>

            <div className="rounded-md border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-faint">
                Не помните email? Напишите на{' '}
                <a href="mailto:help@realtx.local" className="font-medium text-brand hover:underline">
                    help@realtx.local
                </a>
                {' '}— поможем восстановить доступ по данным избранного.
            </div>
        </div>
    );
}
