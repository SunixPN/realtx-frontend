'use client'
import { useState } from 'react'
import { ArrowLeft, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UIDialog } from '@/shared/ui/ui-dialog'
import { showToast } from '@/shared/helpers/show-toast'
import { CodeStepForm, PhoneStepForm, maskPhone, useRecaptcha } from '@/features/phone-signin-feature'
import { usePhoneConfirmMutation } from '../_api/profile-mutations'
import { profileErrorText } from '../_lib/profile-error'
import { DialogIntro } from './email-dialog'

type PhoneDialogProps = {
    open: boolean
    onClose: () => void
}

export function PhoneDialog({ open, onClose }: PhoneDialogProps) {
    const t = useTranslations('profile')
    return (
        <UIDialog open={open} onClose={onClose} ariaLabel={t('phone_add_title')}>
            <PhoneDialogBody onDone={onClose} />
        </UIDialog>
    )
}

function PhoneDialogBody({ onDone }: { onDone: () => void }) {
    const t = useTranslations('profile')
    const [phase, setPhase] = useState<'phone' | 'code'>('phone')
    const [phone, setPhone] = useState<string | null>(null)
    // Тот же Firebase-флоу, что при входе: invisible reCAPTCHA → SMS → код → ID токен
    const { containerRef, getVerifier, resetVerifier } = useRecaptcha()
    const { trigger: confirmPhone } = usePhoneConfirmMutation()

    const onVerified = async (idToken: string) => {
        try {
            await confirmPhone({ idToken })
            showToast({ status: 'success', text: t('phone_added_toast') })
            onDone()
            return true
        } catch (e) {
            showToast({ status: 'error', text: profileErrorText(e, t) })
            return false
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {phase === 'phone' ? (
                <>
                    <DialogIntro
                        tone="brand"
                        icon={<Phone className="size-7" />}
                        title={t('phone_add_title')}
                        text={t('phone_add_text')}
                    />
                    <PhoneStepForm
                        getVerifier={getVerifier}
                        resetVerifier={resetVerifier}
                        submitLabel={t('phone_send_code')}
                        onSuccess={(p) => {
                            setPhone(p)
                            setPhase('code')
                        }}
                    />
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setPhase('phone')}
                        className="-mt-2 flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-base"
                    >
                        <ArrowLeft className="size-4" />
                        {t('back')}
                    </button>
                    <DialogIntro
                        tone="brand"
                        icon={<Phone className="size-7" />}
                        title={t('phone_code_title')}
                        text={t.rich('phone_code_text', {
                            phone: () => <span className="font-medium text-text-base tabular-nums">{phone ? maskPhone(phone) : ''}</span>,
                        })}
                    />
                    <CodeStepForm
                        resetVerifier={resetVerifier}
                        onChangeNumber={() => setPhase('phone')}
                        onVerified={onVerified}
                        submitLabel={t('phone_confirm')}
                    />
                </>
            )}
            <div ref={containerRef} />
        </div>
    )
}
