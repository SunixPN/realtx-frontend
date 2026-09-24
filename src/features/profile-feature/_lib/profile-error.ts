import { ApiError } from '@/shared/api/api'

type T = (key: string, values?: Record<string, number>) => string

/** Текст ошибки профиля по машиночитаемому коду бека — чтобы работала локализация */
export function profileErrorText(error: unknown, t: T): string {
    if (error instanceof ApiError) {
        switch (error.code) {
            case 'EMAIL_TAKEN': return t('error_email_taken')
            case 'EMAIL_ALREADY_VERIFIED': return t('error_email_already_verified')
            case 'PHONE_TAKEN': return t('error_phone_taken')
            case 'EMAIL_RESEND_COOLDOWN': return t('error_resend_cooldown', { seconds: error.retryAfter ?? 60 })
        }
    }
    return t('error_generic')
}

/** Сколько секунд ждать до повторной отправки, если бек ответил 429 */
export function retryAfterOf(error: unknown): number | null {
    return error instanceof ApiError && error.code === 'EMAIL_RESEND_COOLDOWN'
        ? error.retryAfter ?? 60
        : null
}
