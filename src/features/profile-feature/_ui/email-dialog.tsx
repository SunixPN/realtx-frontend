'use client'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ExternalLink, Mail, MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { UIDialog } from '@/shared/ui/ui-dialog'
import { UIButton } from '@/shared/ui/ui-button'
import { UIInput } from '@/shared/ui/ui-input'
import { IconLoader } from '@/shared/ui/ui-icons'
import { showToast } from '@/shared/helpers/show-toast'
import { useAddEmailMutation, useResendVerificationMutation } from '../_api/profile-mutations'
import { profileErrorText, retryAfterOf } from '../_lib/profile-error'
import { webmailUrl } from '../_lib/webmail-url'
import { useCountdown } from '../_hooks/use-countdown'

const RESEND_SECONDS = 60

/**
 * add    — у юзера нет email: форма → «Проверьте почту»
 * verify — email есть, но не подтверждён: сразу шлём письмо → «Проверьте почту»
 */
export type EmailDialogMode = 'add' | 'verify'

type EmailDialogProps = {
    open: boolean
    mode: EmailDialogMode
    email: string | null
    onClose: () => void
}

export function EmailDialog({ open, mode, email, onClose }: EmailDialogProps) {
    const t = useTranslations('profile')
    return (
        <UIDialog
            open={open}
            onClose={onClose}
            ariaLabel={mode === 'add' ? t('email_add_title') : t('email_verify_title')}
        >
            <EmailDialogBody mode={mode} email={email} />
        </UIDialog>
    )
}

type Step = 'form' | 'sending' | 'sent' | 'error'

function EmailDialogBody({ mode, email }: { mode: EmailDialogMode; email: string | null }) {
    const t = useTranslations('profile')
    const [step, setStep] = useState<Step>(mode === 'add' ? 'form' : 'sending')
    const [sentTo, setSentTo] = useState(email ?? '')
    const countdown = useCountdown()
    const { trigger: resend, isMutating: isResending } = useResendVerificationMutation()
    const autoSent = useRef(false)

    const send = async (auto = false) => {
        try {
            await resend()
            countdown.start(RESEND_SECONDS)
            setStep('sent')
            if (!auto) showToast({ status: 'success', text: t('email_resent_toast') })
        } catch (e) {
            const wait = retryAfterOf(e)
            if (wait !== null) {
                // Письмо уже уходило недавно — показываем «Проверьте почту» с остатком таймера
                countdown.start(wait)
                setStep('sent')
                if (!auto) showToast({ status: 'error', text: profileErrorText(e, t) })
                return
            }
            if (auto) setStep('error')
            else showToast({ status: 'error', text: profileErrorText(e, t) })
        }
    }

    useEffect(() => {
        if (mode !== 'verify' || autoSent.current) return
        autoSent.current = true
        void send(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode])

    if (step === 'form') {
        return (
            <AddEmailForm
                initialEmail={mode === 'verify' ? email ?? '' : ''}
                onSent={(address) => {
                    setSentTo(address)
                    countdown.start(RESEND_SECONDS)
                    setStep('sent')
                }}
            />
        )
    }

    if (step === 'sending') {
        return (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
                <IconLoader size={28} className="animate-spin text-brand" />
                <p className="text-sm text-text-muted">{t('email_sending')}</p>
            </div>
        )
    }

    if (step === 'error') {
        return (
            <div className="flex flex-col gap-5">
                <DialogIntro
                    tone="warning"
                    icon={<MailCheck className="size-7" />}
                    title={t('email_verify_title')}
                    text={t('email_send_failed')}
                />
                <UIButton size="lg" fullWidth loading={isResending} onClick={() => send()}>
                    {t('retry')}
                </UIButton>
            </div>
        )
    }

    const inbox = webmailUrl(sentTo)
    return (
        <div className="flex flex-col gap-5">
            <DialogIntro
                tone="success"
                icon={<MailCheck className="size-7" />}
                title={t('email_sent_title')}
                text={t.rich('email_sent_text', {
                    email: () => <span className="font-medium text-text-base break-all">{sentTo}</span>,
                })}
            />
            <div className="flex flex-col gap-2">
                {inbox && (
                    <a
                        href={inbox}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center justify-center gap-2 rounded-sm bg-brand px-6 text-base font-medium text-white transition-colors hover:bg-brand-hover"
                    >
                        <Mail className="size-5" />
                        {t('open_mailbox')}
                        <ExternalLink className="size-4 opacity-70" />
                    </a>
                )}
                {countdown.done ? (
                    <UIButton
                        variant={inbox ? 'ghost' : 'primary'}
                        size="lg"
                        fullWidth
                        loading={isResending}
                        onClick={() => send()}
                    >
                        {t('email_resend')}
                    </UIButton>
                ) : (
                    <span className="py-2.5 text-center text-sm text-text-faint tabular-nums">
                        {t('email_resend_countdown', { seconds: countdown.secondsLeft })}
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="cursor-pointer py-1 text-sm font-medium text-text-muted hover:text-text-base"
                >
                    {t('email_change_address')}
                </button>
            </div>
            <p className="rounded-md border border-border bg-surface-muted p-3 text-xs leading-relaxed text-text-faint">
                {t('email_spam_hint')}
            </p>
        </div>
    )
}

function AddEmailForm({ initialEmail, onSent }: { initialEmail: string; onSent: (email: string) => void }) {
    const t = useTranslations('profile')
    const tV = useTranslations('validation')
    const [value, setValue] = useState(initialEmail)
    const [error, setError] = useState<string | null>(null)
    const { trigger: addEmail, isMutating } = useAddEmailMutation()

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        const email = value.trim().toLowerCase()
        if (!email) return setError(tV('email_required'))
        if (email.length > 255) return setError(tV('email_too_long'))
        if (!z.string().email().safeParse(email).success) return setError(tV('email_invalid'))
        try {
            await addEmail({ email })
            onSent(email)
        } catch (err) {
            setError(profileErrorText(err, t))
        }
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <DialogIntro
                tone="brand"
                icon={<Mail className="size-7" />}
                title={t('email_add_title')}
                text={t('email_add_text')}
            />
            <UIInput
                type="email"
                label={t('email_label')}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                autoFocus
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(null) }}
                error={error ?? undefined}
            />
            <UIButton type="submit" size="lg" fullWidth loading={isMutating}>
                {t('email_send_link')}
            </UIButton>
        </form>
    )
}

const TONES = {
    brand: 'bg-brand-bg text-brand',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-error-bg text-error',
} as const

export function DialogIntro({
    tone,
    icon,
    title,
    text,
}: {
    tone: keyof typeof TONES
    icon: React.ReactNode
    title: string
    text: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <span className={`flex size-14 items-center justify-center rounded-2xl ${TONES[tone]}`}>{icon}</span>
            <h2 className="text-xl font-semibold text-text-base">{title}</h2>
            <p className="text-sm leading-relaxed text-text-muted">{text}</p>
        </div>
    )
}
