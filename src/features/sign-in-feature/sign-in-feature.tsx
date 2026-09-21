'use client';
import {ReactNode} from 'react';
import { useTranslations } from 'next-intl';
import SignInHeader from "@/features/sign-in-feature/_ui/sign-in-header/sign-in-header";
import SignInForm from "@/features/sign-in-feature/_ui/sign-in-form/sign-in-form";
import { UIAuthShell } from '@/shared/ui/ui-auth-shell';
type SignInFeatureProps = {
    googleOAuth?: ReactNode,
    phoneOAuth?: ReactNode,
}
export default function SignInFeature({
    googleOAuth,
    phoneOAuth,
}: SignInFeatureProps) {
    const t = useTranslations('auth');
    return (
        <UIAuthShell
            below={
                <p className="text-center text-xs text-text-faint">
                    {t('footer_note')}
                </p>
            }
        >
            <SignInHeader />
            <SignInForm />
            <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-text-faint">{t('or_via')}</span>
                <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-2">
                {googleOAuth ? googleOAuth : <></>}
                {phoneOAuth ? phoneOAuth : <></>}
            </div>
        </UIAuthShell>
    );
}
