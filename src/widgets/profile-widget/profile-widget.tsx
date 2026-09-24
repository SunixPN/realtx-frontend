'use client'
import { useState } from 'react'
import { useAuth } from '@/entities/me/api/auth-query'
import { DeleteAccountDialog, EmailDialog, PhoneDialog, type EmailDialogMode } from '@/features/profile-feature'
import { ActivityTiles, MissingEmailBanner, ProfileHeader, UnverifiedEmailBanner } from './_ui/profile-overview'
import {
    AccountSection,
    InterfaceSection,
    NotificationChannelsSection,
    PersonalDataSection,
    emailStatusOf,
} from './_ui/profile-sections'

type Dialog = 'email' | 'phone' | 'delete' | null

export function ProfileWidget() {
    const { data: auth, isLoading } = useAuth()
    const [dialog, setDialog] = useState<Dialog>(null)
    // Режим держим отдельно от open, чтобы контент не мигал во время анимации закрытия
    const [emailMode, setEmailMode] = useState<EmailDialogMode>('add')
    const user = auth?.user

    if (!user) {
        return isLoading || auth === undefined ? <ProfileSkeleton /> : null
    }

    const emailStatus = emailStatusOf(user)
    const openEmail = (mode: EmailDialogMode) => {
        setEmailMode(mode)
        setDialog('email')
    }
    const close = () => setDialog(null)

    return (
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6">
            <ProfileHeader user={user} />
            {emailStatus === 'unverified' && user.email && (
                <UnverifiedEmailBanner email={user.email} onConfirm={() => openEmail('verify')} />
            )}
            {emailStatus === 'missing' && <MissingEmailBanner onAdd={() => openEmail('add')} />}
            <ActivityTiles user={user} />
            <PersonalDataSection
                user={user}
                onAddEmail={() => openEmail('add')}
                onVerifyEmail={() => openEmail('verify')}
                onAddPhone={() => setDialog('phone')}
            />
            <NotificationChannelsSection user={user} />
            <InterfaceSection />
            <AccountSection onDelete={() => setDialog('delete')} />

            <EmailDialog
                open={dialog === 'email'}
                mode={emailMode}
                email={user.email}
                onClose={close}
            />
            <PhoneDialog open={dialog === 'phone'} onClose={close} />
            <DeleteAccountDialog open={dialog === 'delete'} onClose={close} />
        </div>
    )
}

function ProfileSkeleton() {
    const block = 'animate-pulse rounded-lg bg-surface-muted'
    return (
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6" aria-busy="true">
            <div className="flex items-center gap-4 border-b border-border pb-5 sm:pb-6">
                <div className="size-14 animate-pulse rounded-2xl bg-surface-muted sm:size-16" />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="h-6 w-40 animate-pulse rounded bg-surface-muted" />
                    <div className="h-4 w-64 max-w-full animate-pulse rounded bg-surface-muted" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[0, 1, 2].map((i) => <div key={i} className={`h-[88px] sm:h-[74px] ${block}`} />)}
            </div>
            <div className={`h-14 ${block}`} />
            <div className={`h-72 ${block}`} />
            <div className={`h-48 ${block}`} />
        </div>
    )
}
