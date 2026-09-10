'use client';

import {ReactNode} from 'react';
import SignInHeader from "@/features/sign-in-feature/_ui/sign-in-header/sign-in-header";
import SignInForm from "@/features/sign-in-feature/_ui/sign-in-form/sign-in-form";

type SignInFeatureProps = {
    googleOAuth?: ReactNode,
    phoneOAuth?: ReactNode,
}

export default function SignInFeature({
    googleOAuth,
    phoneOAuth,
}: SignInFeatureProps) {

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
                        <SignInHeader />
                        <SignInForm />
                        <div className="flex items-center gap-3">
                            <span className="h-px flex-1 bg-border" />
                            <span className="text-xs text-text-faint">или через</span>
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            {googleOAuth ? googleOAuth : <></>}
                            {phoneOAuth ? phoneOAuth : <></>}
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-text-faint">
                        RealtX — агрегатор объявлений с realt.by. Мы не участвуем в сделках,
                        аккаунт нужен только для сохранения избранного и подписок.
                    </p>
                </div>
            </main>

            <footer className="border-t border-border bg-surface-raised px-4 py-4 text-center text-xs text-text-faint">
                Продолжая, вы соглашаетесь с{' '}
                <a href="#" className="underline hover:text-text-muted">
                    условиями использования
                </a>{' '}
                и{' '}
                <a href="#" className="underline hover:text-text-muted">
                    политикой конфиденциальности
                </a>
            </footer>
        </div>
    );
}


