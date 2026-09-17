'use client';

import { useTranslations } from 'next-intl';
import { IconMail } from '@/shared/ui/ui-icons';
import { UIButton } from '@/shared/ui/ui-button';
import { useResendCooldown } from '@/shared/hooks/use-resend-cooldown';
import { useResetRequestMutation } from '@/features/reset-request-feature/_api/reset-request-mutation';
import { showToast } from '@/shared/helpers/show-toast';

type ResetSentViewProps = {
    email: string;
};

export default function ResetSentView({ email }: ResetSentViewProps) {
    const t = useTranslations('auth.reset_request');
    const cooldown = useResendCooldown(45);

    const { trigger: resend, isMutating: isResending } = useResetRequestMutation();

    const handleResend = async () => {
        const result = await resend({ email });
        if (result) {
            showToast({ status: 'success', text: t('toast_resent') });
            cooldown.restart();
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <IconMail size={28} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">{t('sent_title')}</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    {t('sent_body_prefix')}{' '}
                    <span className="font-medium text-text-base">{email}</span>
                    {t('sent_body_suffix')}
                </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
                <UIButton
                    variant="secondary"
                    size="md"
                    fullWidth
                    iconLeft={<IconMail size={16} />}
                    onClick={() => window.open('mailto:', '_blank')}
                >
                    {t('open_mail')}
                </UIButton>

                {cooldown.canResend ? (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="cursor-pointer text-sm font-medium text-text-muted transition-colors hover:text-text-base disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isResending ? t('resend_pending') : t('resend')}
                    </button>
                ) : (
                    <span className="text-center text-sm text-text-faint tabular-nums">
                        {t('resend_countdown', { seconds: cooldown.secondsLeft })}
                    </span>
                )}
            </div>

            <div className="rounded-md border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-faint">
                {t('spam_hint')}
            </div>
        </div>
    );
}
