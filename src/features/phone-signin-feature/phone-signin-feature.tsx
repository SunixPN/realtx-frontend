'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/const/routes';
import { useRecaptcha } from '@/features/phone-signin-feature/_hooks/use-recaptcha';
import PhoneSignInHeader from '@/features/phone-signin-feature/_ui/phone-signin-header/phone-signin-header';
import PhoneStepForm from '@/features/phone-signin-feature/_ui/phone-step-form/phone-step-form';
import CodeStepForm from '@/features/phone-signin-feature/_ui/code-step-form/code-step-form';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

type Phase = 'phone' | 'code';

const maskPhone = (phone: string) => {
    if (phone.length < 8) return phone;
    const visibleTail = phone.slice(-2);
    const head = phone.slice(0, phone.length - 6);
    return `${head} ··· ·· ${visibleTail}`;
};

export default function PhoneSignInFeature() {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>('phone');
    const [phone, setPhone] = useState<string | null>(null);

    const { containerRef, getVerifier, resetVerifier } = useRecaptcha();

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
                        {phase === 'phone' ? (
                            <>
                                <PhoneSignInHeader
                                    title="Вход по номеру телефона"
                                    subtitle="Введите номер — пришлём одноразовый код в SMS. Пароль не понадобится."
                                    onBack={() => router.push(ROUTES.SIGN_IN)}
                                />
                                <PhoneStepForm
                                    getVerifier={getVerifier}
                                    resetVerifier={resetVerifier}
                                    onSuccess={(p) => {
                                        setPhone(p);
                                        setPhase('code');
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <PhoneSignInHeader
                                    title="Введите код из SMS"
                                    subtitle={
                                        <>
                                            Отправили шестизначный код на номер{' '}
                                            <span className="font-medium text-text-base tabular-nums">
                                                {phone ? maskPhone(phone) : ''}
                                            </span>.
                                        </>
                                    }
                                    onBack={() => setPhase('phone')}
                                />
                                <CodeStepForm
                                    resetVerifier={resetVerifier}
                                    onChangeNumber={() => setPhase('phone')}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>

            <div ref={containerRef} />
            <UIAuthFooter />
        </div>
    );
}
