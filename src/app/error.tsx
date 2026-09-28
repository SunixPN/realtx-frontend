'use client';
import { useEffect } from 'react';
import { SomethingWentWrongScreen } from '@/widgets/error-screen';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <SomethingWentWrongScreen onRetry={reset} digest={error.digest} />;
}
