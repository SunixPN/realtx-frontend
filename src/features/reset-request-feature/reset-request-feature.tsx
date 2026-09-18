'use client';

import { useState } from 'react';
import ResetBackLink from '@/features/reset-request-feature/_ui/reset-back-link/reset-back-link';
import ResetRequestForm from '@/features/reset-request-feature/_ui/reset-request-form/reset-request-form';
import ResetSentView from '@/features/reset-request-feature/_ui/reset-sent-view/reset-sent-view';
import { UIAuthShell } from '@/shared/ui/ui-auth-shell';

type Phase = 'form' | 'sent';

export default function ResetRequestFeature() {
    const [phase, setPhase] = useState<Phase>('form');
    const [email, setEmail] = useState<string>('');

    return (
        <UIAuthShell>
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
        </UIAuthShell>
    );
}
