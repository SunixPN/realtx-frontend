'use client';

import { useTranslations } from 'next-intl';
import GoogleGlyph from '@/shared/icons/google-glyph-icon';
import { useGoogleAuth } from '@/features/google-auth-button-feature/_hooks/use-google-auth';

export default function GoogleAuthButtonFeature() {
    const t = useTranslations('auth');
    const { signInWithGoogle, isLoading } = useGoogleAuth();

    return (
        <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface-raised text-sm font-medium text-text-base hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-60"
        >
            <GoogleGlyph />
            {isLoading ? t('google_pending') : t('google_button')}
        </button>
    );
}
