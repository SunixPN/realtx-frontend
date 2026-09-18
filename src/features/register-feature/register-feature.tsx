'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import RegisterHeader from '@/features/register-feature/_ui/register-header/register-header';
import RegisterForm from '@/features/register-feature/_ui/register-form/register-form';
import { UIAuthShell } from '@/shared/ui/ui-auth-shell';

type RegisterFeatureProps = {
    googleOAuth?: ReactNode;
    phoneOAuth?: ReactNode;
};

export default function RegisterFeature({ googleOAuth, phoneOAuth }: RegisterFeatureProps) {
    const t = useTranslations('auth');
    return (
        <UIAuthShell>
            <RegisterHeader />
            <RegisterForm />

            <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-text-faint">{t('or_via')}</span>
                <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-2">
                {googleOAuth ?? <></>}
                {phoneOAuth ?? <></>}
            </div>
        </UIAuthShell>
    );
}
