import type { Metadata } from 'next';
import RegisterFeature from '@/features/register-feature';
import GoogleAuthButtonFeature from '@/features/google-auth-button-feature/google-auth-button-feature';
import PhoneAuthButtonFeature from '@/features/phone-auth-button-feature/phone-auth-button-feature';

export const metadata: Metadata = { title: 'Регистрация — RealtX' };

export default function RegisterPage() {
    return (
        <RegisterFeature
            googleOAuth={<GoogleAuthButtonFeature />}
            phoneOAuth={<PhoneAuthButtonFeature />}
        />
    );
}
