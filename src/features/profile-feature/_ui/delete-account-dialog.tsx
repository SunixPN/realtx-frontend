'use client'
import { mutate } from 'swr'
import { ShieldAlert } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UIDialog } from '@/shared/ui/ui-dialog'
import { UIButton } from '@/shared/ui/ui-button'
import { showToast } from '@/shared/helpers/show-toast'
import { clearTokensAction } from '@/shared/actions/clear-tokens-action'
import { authKey } from '@/entities/me/api/auth-query'
import { ROUTES } from '@/shared/const/routes'
import useRouter from '@/shared/lib/use-router'
import { useDeleteAccountMutation } from '../_api/profile-mutations'
import { DialogIntro } from './email-dialog'

type DeleteAccountDialogProps = {
    open: boolean
    onClose: () => void
}

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
    const t = useTranslations('profile')
    const router = useRouter()
    const { trigger: deleteAccount, isMutating } = useDeleteAccountMutation()

    const confirm = async () => {
        try {
            await deleteAccount()
        } catch {
            showToast({ status: 'error', text: t('delete_error_toast') })
            return
        }
        await clearTokensAction()
        await mutate(authKey, null, { revalidate: false })
        showToast({ status: 'success', text: t('delete_success_toast') })
        router.replace(ROUTES.ROOT)
        router.refresh()
    }

    return (
        <UIDialog open={open} onClose={onClose} ariaLabel={t('delete_title')} dismissible={!isMutating}>
            <div className="flex flex-col gap-5">
                <DialogIntro
                    tone="danger"
                    icon={<ShieldAlert className="size-7" />}
                    title={t('delete_title')}
                    text={t('delete_text')}
                />
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <UIButton variant="secondary" size="lg" fullWidth disabled={isMutating} onClick={onClose}>
                        {t('cancel')}
                    </UIButton>
                    <UIButton variant="danger" size="lg" fullWidth loading={isMutating} onClick={confirm}>
                        {t('delete_confirm')}
                    </UIButton>
                </div>
            </div>
        </UIDialog>
    )
}
