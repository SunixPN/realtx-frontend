'use client'
import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UIDialog } from '@/shared/ui/ui-dialog'
import { UIButton } from '@/shared/ui/ui-button'
import { showToast, showToastAfterReload } from '@/shared/helpers/show-toast'
import { clearTokensAction } from '@/shared/actions/clear-tokens-action'
import { ROUTES } from '@/shared/const/routes'
import { useDeleteAccountMutation } from '../_api/profile-mutations'
import { DialogIntro } from './email-dialog'

type DeleteAccountDialogProps = {
    open: boolean
    onClose: () => void
}

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
    const t = useTranslations('profile')
    const { trigger: deleteAccount, isMutating } = useDeleteAccountMutation()
    // Не даём закрыть/нажать повторно, пока страница перезагружается
    const [isLeaving, setIsLeaving] = useState(false)
    const busy = isMutating || isLeaving

    const confirm = async () => {
        try {
            await deleteAccount()
        } catch {
            showToast({ status: 'error', text: t('delete_error_toast') })
            return
        }
        setIsLeaving(true)
        await clearTokensAction()
        showToastAfterReload({ status: 'success', text: t('delete_success_toast') })
        // Полная перезагрузка: сбрасывает кэши удалённого пользователя, страница не мигает пустой
        window.location.replace(ROUTES.ROOT)
    }

    return (
        <UIDialog open={open} onClose={onClose} ariaLabel={t('delete_title')} dismissible={!busy}>
            <div className="flex flex-col gap-5">
                <DialogIntro
                    tone="danger"
                    icon={<ShieldAlert className="size-7" />}
                    title={t('delete_title')}
                    text={t('delete_text')}
                />
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <UIButton variant="secondary" size="lg" fullWidth disabled={busy} onClick={onClose}>
                        {t('cancel')}
                    </UIButton>
                    <UIButton variant="danger" size="lg" fullWidth loading={busy} onClick={confirm}>
                        {t('delete_confirm')}
                    </UIButton>
                </div>
            </div>
        </UIDialog>
    )
}
