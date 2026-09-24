'use client'
import { useTransition } from 'react'
import { AlertTriangle, Check, LogOut, Mail, Moon, Plus, Send, ShieldAlert, Sun } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/shared/helpers/cn'
import { UIBadge } from '@/shared/ui/ui-badge'
import { UISwitch } from '@/shared/ui/ui-switch'
import { showToast } from '@/shared/helpers/show-toast'
import { formatPhone } from '@/shared/helpers/format-phone'
import { useTheme, type Theme } from '@/shared/theme'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/shared/i18n/config'
import { setLocale } from '@/shared/i18n/actions'
import { beginTopLoader, doneTopLoader } from '@/shared/lib/begin-top-loader'
import { useLogout } from '@/features/logout-feature/_hooks/use-logout'
import { InlineEditField, ProfileRow, profileErrorText, useUpdateProfileMutation } from '@/features/profile-feature'
import type { AuthUserType } from '@/entities/me/types/me-type'
import { ActionRow, ProfileSection, SegmentRow } from './profile-primitives'

export type EmailStatus = 'verified' | 'unverified' | 'missing'
export type PhoneStatus = 'verified' | 'missing'

export function emailStatusOf(user: AuthUserType): EmailStatus {
    if (!user.email) return 'missing'
    return user.emailVerified ? 'verified' : 'unverified'
}
export function phoneStatusOf(user: AuthUserType): PhoneStatus {
    return user.phone && user.phoneVerified ? 'verified' : 'missing'
}

// --- Личные данные ---

export function PersonalDataSection({
    user,
    onAddEmail,
    onVerifyEmail,
    onAddPhone,
}: {
    user: AuthUserType
    onAddEmail: () => void
    onVerifyEmail: () => void
    onAddPhone: () => void
}) {
    const t = useTranslations('profile')
    const { trigger: update } = useUpdateProfileMutation()
    const save = (field: 'name' | 'city') => async (value: string) => {
        try {
            await update(field === 'name' ? { name: value } : { city: value || null })
            showToast({ status: 'success', text: t('saved_toast') })
        } catch (e) {
            showToast({ status: 'error', text: profileErrorText(e, t) })
            throw e
        }
    }
    const emailStatus = emailStatusOf(user)
    const phoneStatus = phoneStatusOf(user)

    return (
        <ProfileSection title={t('personal_title')} description={t('personal_description')}>
            <InlineEditField
                label={t('field_name')}
                value={user.name}
                placeholder={t('field_name_placeholder')}
                maxLength={60}
                emptyError={t('field_name_required')}
                autoComplete="name"
                onSave={save('name')}
            />
            <ProfileRow
                label={t('field_email')}
                value={
                    emailStatus === 'missing' ? (
                        <span className="text-base text-text-faint">{t('not_specified')}</span>
                    ) : (
                        <>
                            <span className="min-w-0 truncate text-base text-text-base">{user.email}</span>
                            {emailStatus === 'verified' ? (
                                <UIBadge tone="success" icon={<Check className="size-3" />}>{t('status_verified')}</UIBadge>
                            ) : (
                                <UIBadge tone="warning" icon={<AlertTriangle className="size-3" />}>{t('status_unverified')}</UIBadge>
                            )}
                        </>
                    )
                }
                action={
                    emailStatus === 'missing' ? (
                        <AddButton label={t('add')} onClick={onAddEmail} />
                    ) : emailStatus === 'unverified' ? (
                        <button
                            type="button"
                            onClick={onVerifyEmail}
                            className="shrink-0 cursor-pointer rounded-sm border border-warning/25 bg-warning-bg px-2.5 py-1 text-sm font-medium text-warning transition-colors hover:border-warning/50"
                        >
                            {t('confirm')}
                        </button>
                    ) : null
                }
            />
            <ProfileRow
                label={t('field_phone')}
                value={
                    phoneStatus === 'missing' ? (
                        <>
                            <span className="text-base text-text-faint">{t('not_specified')}</span>
                            <span className="text-xs text-text-faint">{t('phone_sms_hint')}</span>
                        </>
                    ) : (
                        <>
                            <span className="truncate text-base text-text-base tabular-nums">{formatPhone(user.phone!)}</span>
                            <UIBadge tone="success" icon={<Check className="size-3" />}>{t('status_verified_sms')}</UIBadge>
                        </>
                    )
                }
                action={phoneStatus === 'missing' ? <AddButton label={t('add')} onClick={onAddPhone} /> : null}
            />
            <InlineEditField
                label={t('field_city')}
                value={user.city}
                placeholder={t('field_city_placeholder')}
                maxLength={80}
                allowEmpty
                autoComplete="address-level2"
                onSave={save('city')}
            />
        </ProfileSection>
    )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text-base"
        >
            <Plus className="size-3.5" />
            {label}
        </button>
    )
}

// --- Каналы уведомлений ---

export function NotificationChannelsSection({ user }: { user: AuthUserType }) {
    const t = useTranslations('profile')
    const { trigger: update, isMutating } = useUpdateProfileMutation()
    const emailReady = emailStatusOf(user) === 'verified'
    const emailOn = emailReady && user.notifyByEmail

    const toggleEmail = async (next: boolean) => {
        try {
            await update({ notifyByEmail: next })
            showToast({ status: 'success', text: next ? t('channel_email_on_toast') : t('channel_email_off_toast') })
        } catch (e) {
            showToast({ status: 'error', text: profileErrorText(e, t) })
        }
    }

    const emailNote = !user.email
        ? t('channel_email_missing')
        : !user.emailVerified
            ? t('channel_email_unverified')
            : user.email

    return (
        <ProfileSection title={t('channels_title')} description={t('channels_description')}>
            <Channel
                icon={<Mail className="size-5" />}
                title={t('channel_email')}
                note={emailNote}
                active={emailOn}
                control={
                    <UISwitch
                        aria-label={t('channel_email_toggle_aria')}
                        checked={emailOn}
                        disabled={!emailReady || isMutating}
                        onChange={(e) => toggleEmail(e.target.checked)}
                    />
                }
            />
            <Channel
                icon={<Send className="size-5" />}
                title={t('channel_telegram')}
                note={t('channel_telegram_note')}
                active={false}
                control={<UIBadge tone="neutral">{t('soon')}</UIBadge>}
                muted
            />
        </ProfileSection>
    )
}

function Channel({
    icon,
    title,
    note,
    active,
    control,
    muted = false,
}: {
    icon: React.ReactNode
    title: string
    note: string
    active: boolean
    control: React.ReactNode
    muted?: boolean
}) {
    return (
        <div className={cn('flex items-center gap-3 rounded-md border border-border p-3', muted && 'opacity-70')}>
            <span
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-md transition-colors',
                    active ? 'bg-brand-bg text-brand' : 'bg-surface-muted text-text-faint',
                )}
            >
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-text-base">
                    {title}
                    {active && <Check className="size-3.5 text-success" aria-hidden />}
                </div>
                <div className="truncate text-xs text-text-faint">{note}</div>
            </div>
            <div className="shrink-0">{control}</div>
        </div>
    )
}

// --- Интерфейс ---

export function InterfaceSection() {
    const t = useTranslations('profile')
    const { theme, setTheme } = useTheme()
    const locale = useLocale() as Locale
    const [isPending, startTransition] = useTransition()

    const pickLocale = (next: Locale) => {
        if (next === locale) return
        beginTopLoader()
        startTransition(async () => {
            try {
                await setLocale(next)
            } finally {
                doneTopLoader()
            }
        })
    }

    return (
        <ProfileSection title={t('interface_title')}>
            <SegmentRow<Theme>
                label={t('theme_label')}
                value={theme}
                onChange={setTheme}
                options={[
                    { key: 'light', label: t('theme_light'), icon: <Sun className="size-4" /> },
                    { key: 'dark', label: t('theme_dark'), icon: <Moon className="size-4" /> },
                    { key: 'system', label: t('theme_system') },
                ]}
            />
            <SegmentRow<Locale>
                label={t('language_label')}
                value={locale}
                onChange={pickLocale}
                disabled={isPending}
                options={LOCALES.map((l) => ({ key: l, label: LOCALE_LABELS[l] }))}
            />
        </ProfileSection>
    )
}

// --- Аккаунт ---

export function AccountSection({ onDelete }: { onDelete: () => void }) {
    const t = useTranslations('profile')
    const { logout, isPending } = useLogout()
    return (
        <ProfileSection title={t('account_title')}>
            <ActionRow
                icon={<LogOut className="size-4" />}
                title={t('logout_title')}
                note={t('logout_note')}
                action={t('logout_action')}
                onClick={logout}
                disabled={isPending}
            />
            <ActionRow
                icon={<ShieldAlert className="size-4" />}
                title={t('delete_row_title')}
                note={t('delete_row_note')}
                action={t('delete_action')}
                tone="danger"
                onClick={onDelete}
            />
        </ProfileSection>
    )
}
