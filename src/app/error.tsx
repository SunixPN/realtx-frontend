'use client';
import { useEffect } from 'react';
import { SomethingWentWrongScreen } from '@/widgets/error-screen';

// Next.js error boundary: срабатывает при рантайм-ошибке в любом сегменте
// ниже. RootLayout (Header, Providers) остаётся смонтированным. Для крашей
// самого RootLayout есть отдельный global-error.tsx рядом.
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
