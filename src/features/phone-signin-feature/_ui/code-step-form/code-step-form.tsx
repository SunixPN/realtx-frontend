'use client';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { RecaptchaVerifier } from 'firebase/auth';
import { UIButton } from '@/shared/ui/ui-button';
import { useCodeStepForm } from '@/features/phone-signin-feature/_hooks/use-code-step-form';
import { useResendCooldown } from '@/shared/hooks/use-resend-cooldown';
import CodeBoxesInput from '@/features/phone-signin-feature/_ui/code-boxes-input/code-boxes-input';
type CodeStepFormProps = {
    resetVerifier: () => RecaptchaVerifier | null;
    onChangeNumber: () => void;
};
export default function CodeStepForm({ resetVerifier, onChangeNumber }: CodeStepFormProps) {
    const t = useTranslations('auth.phone');
    const cooldown = useResendCooldown(45);
    const { form, onSubmit, isSubmitting, isResending, resend } = useCodeStepForm({
        resetVerifier,
        onResendDone: cooldown.restart,
    });
    const codeError = form.formState.errors.code?.message;
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-3">
                <Controller
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <CodeBoxesInput
                            value={field.value}
                            onChange={(v) => {
                                field.onChange(v);
                                if (v.length === 6) form.handleSubmit(onSubmit)();
                            }}
                            hasError={!!codeError}
                            disabled={isSubmitting}
                        />
                    )}
                />
                {codeError && <p className="text-center text-xs text-error">{codeError}</p>}
            </div>
            <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                {t('submit')}
            </UIButton>
            <div className="flex flex-col items-center gap-2">
                {cooldown.canResend ? (
                    <button
                        type="button"
                        onClick={resend}
                        disabled={isResending || isSubmitting}
                        className="cursor-pointer text-sm font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
                    >
                        {isResending ? t('resend_pending') : t('resend')}
                    </button>
                ) : (
                    <span className="text-sm text-text-faint tabular-nums">
                        {t('resend_countdown', { seconds: cooldown.secondsLeft })}
                    </span>
                )}
                <button
                    type="button"
                    onClick={onChangeNumber}
                    className="cursor-pointer text-sm font-medium text-text-muted hover:text-text-base"
                >
                    {t('change_number')}
                </button>
            </div>
        </form>
    );
}
