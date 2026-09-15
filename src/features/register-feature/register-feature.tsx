'use client';

import { ReactNode } from 'react';
import RegisterHeader from '@/features/register-feature/_ui/register-header/register-header';
import RegisterForm from '@/features/register-feature/_ui/register-form/register-form';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

type RegisterFeatureProps = {
    googleOAuth?: ReactNode;
    phoneOAuth?: ReactNode;
};

export default function RegisterFeature({ googleOAuth, phoneOAuth }: RegisterFeatureProps) {
    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
                        <RegisterHeader />
                        <RegisterForm />

                        <div className="flex items-center gap-3">
                            <span className="h-px flex-1 bg-border" />
                            <span className="text-xs text-text-faint">или через</span>
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            {googleOAuth ?? <></>}
                            {phoneOAuth ?? <></>}
                        </div>
                    </div>
                </div>
            </main>

            <UIAuthFooter />
        </div>
    );
}
