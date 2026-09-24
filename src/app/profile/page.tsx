import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ProfileWidget } from '@/widgets/profile-widget'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('profile')
    return { title: t('page_title') }
}

export default function ProfilePage() {
    return <ProfileWidget />
}
