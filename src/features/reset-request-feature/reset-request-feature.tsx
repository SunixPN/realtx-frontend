'use client';

import { useState } from 'react';
import ResetBackLink from '@/features/reset-request-feature/_ui/reset-back-link/reset-back-link';
import ResetRequestForm from '@/features/reset-request-feature/_ui/reset-request-form/reset-request-form';
import ResetSentView from '@/features/reset-request-feature/_ui/reset-sent-view/reset-sent-view';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

type Phase = 'form' | 'sent';

export default function ResetRequestFeature() {
    const [phase, setPhase] = useState<Phase>('form');
    const [email, setEmail] = useState<string>('');

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface-raised p-8">
                        <ResetBackLink />
                        {phase === 'form' ? (
                            <ResetRequestForm
                                onSent={(e) => {
                                    setEmail(e);
                                    setPhase('sent');
                                }}
                            />
                        ) : (
                            <ResetSentView email={email} />
                        )}
                    </div>
                </div>
            </main>

            <UIAuthFooter />
        </div>
    );
}
