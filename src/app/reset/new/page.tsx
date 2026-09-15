import { Suspense } from 'react';
import ResetConfirmFeature from '@/features/reset-confirm-feature';

export default function ResetNewPage() {
    return (
        <Suspense>
            <ResetConfirmFeature />
        </Suspense>
    );
}
