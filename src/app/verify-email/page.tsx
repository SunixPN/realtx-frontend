import { Suspense } from 'react';
import VerifyEmailFeature from '@/features/verify-email-feature';

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailFeature />
        </Suspense>
    );
}
