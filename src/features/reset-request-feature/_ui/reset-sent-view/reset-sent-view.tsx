'use client';

import { useMutation } from '@tanstack/react-query';
import { IconMail } from '@/shared/ui/ui-icons';
import { UIButton } from '@/shared/ui/ui-button';
import { useResendCooldown } from '@/shared/hooks/use-resend-cooldown';
import { resetRequestMutation } from '@/features/reset-request-feature/_api/reset-request-mutation';
import { showToast } from '@/shared/helpers/show-toast';

type ResetSentViewProps = {
    email: string;
};

export default function ResetSentView({ email }: ResetSentViewProps) {
    const cooldown = useResendCooldown(45);

    const { mutate: resend, isPending: isResending } = useMutation({
        ...resetRequestMutation,
        onSuccess: (data, variables, onMutateResult, context) => {
            resetRequestMutation.onSuccess?.(data, variables, onMutateResult, context);
            showToast({ status: 'success', text: 'Письмо отправлено повторно' });
            cooldown.restart();
        },
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 pb-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <IconMail size={28} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">Проверьте почту</h1>
                <p className="max-w-sm text-sm text-text-muted">
                    Мы отправили ссылку для сброса на{' '}
                    <span className="font-medium text-text-base">{email}</span>.
                    Она действует один час.
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
                    Открыть почтовый клиент
                </UIButton>

                {cooldown.canResend ? (
                    <button
                        type="button"
                        onClick={() => resend({ email })}
                        disabled={isResending}
                        className="cursor-pointer text-sm font-medium text-text-muted transition-colors hover:text-text-base disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isResending ? 'Отправляем...' : 'Отправить снова'}
                    </button>
                ) : (
                    <span className="text-center text-sm text-text-faint tabular-nums">
                        Отправить снова через {cooldown.secondsLeft} сек.
                    </span>
                )}
            </div>

            <div className="rounded-md border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-faint">
                Письма нет? Проверьте «Спам» и папку «Промоакции». Если аккаунт
                заведён через Google или по номеру телефона, пароля у него нет —
                войдите через ту же кнопку, что и раньше.
            </div>
        </div>
    );
}
