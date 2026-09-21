import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server'
import RegisterFeature from '@/features/register-feature';
import GoogleAuthButtonFeature from '@/features/google-auth-button-feature/google-auth-button-feature';
import PhoneAuthButtonFeature from '@/features/phone-auth-button-feature/phone-auth-button-feature';
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('common')
    return { title: t('page_title_register') }
}
export default function RegisterPage() {
    return (
        <RegisterFeature
            googleOAuth={<GoogleAuthButtonFeature />}
            phoneOAuth={<PhoneAuthButtonFeature />}
        />
    );
}
