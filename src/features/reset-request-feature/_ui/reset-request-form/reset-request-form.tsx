'use client';
import { useTranslations } from 'next-intl';
import { UIInput } from '@/shared/ui/ui-input';
import { UIButton } from '@/shared/ui/ui-button';
import { useResetRequestForm } from '@/features/reset-request-feature/_hooks/use-reset-request-form';
type ResetRequestFormProps = {
    onSent: (email: string) => void;
};
export default function ResetRequestForm({ onSent }: ResetRequestFormProps) {
    const t = useTranslations('auth.reset_request');
    const { form, onSubmit, isSubmitting } = useResetRequestForm({ onSent });
    return (
        <div className="flex flex-col gap-5">
            <header>
                <h1 className="text-xl font-semibold text-text-base xs:text-2xl">{t('title')}</h1>
                <p className="mt-1 text-sm text-text-muted xs:mt-1.5">
                    {t('subtitle')}
                </p>
            </header>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate suppressHydrationWarning>
                <UIInput
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={form.formState.errors.email?.message}
                    {...form.register('email')}
                />
                <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                    {t('submit')}
                </UIButton>
            </form>
            <div className="rounded-md border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-faint">
                {t('help_prefix')}{' '}
                <a href="mailto:help@realtx.local" className="font-medium text-brand hover:underline">
                    help@realtx.local
                </a>
                {' '}{t('help_suffix')}
            </div>
        </div>
    );
}
