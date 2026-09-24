'use client';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

// global-error срабатывает, когда падает сам RootLayout. Здесь нет доступа
// к next-intl/тем/провайдерам — только автономный HTML. Строки хардкодим
// по-русски: iframe с фолбэком лучше, чем белый экран.
const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'cyrillic'], display: 'swap' });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="ru" className={inter.variable}>
            <head>
                {/* RootLayout мёртв — Next-овская конвенция app/icon.png не
                    применяется. Явный <link> на тот же файл из /public. */}
                <link rel="icon" type="image/png" href="/logo.png" />
            </head>
            <body className="min-h-dvh bg-surface-page text-text-base antialiased">
                <div className="flex min-h-dvh w-full items-center justify-center">
                    <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-6 px-6 py-10 text-center sm:py-16">
                        <div
                            aria-hidden
                            className="select-none text-[104px] font-semibold leading-none tracking-tight text-error sm:text-[128px]"
                        >
                            500
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-text-base sm:text-3xl">
                                Что-то пошло не так
                            </h1>
                            <p className="mt-2 text-base text-text-muted">
                                Приложение упало неожиданно. Попробуйте обновить страницу.
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <button
                                type="button"
                                onClick={reset}
                                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-sm bg-brand px-6 text-base font-medium text-white transition-all hover:bg-brand-hover"
                            >
                                Обновить страницу
                            </button>
                            <a
                                href="/"
                                className="inline-flex h-12 items-center justify-center rounded-sm border border-border bg-surface-subtle px-6 text-base font-medium text-text-base transition-all hover:bg-surface-muted"
                            >
                                На главную
                            </a>
                        </div>
                        {error.digest && (
                            <div className="mt-2 rounded-md border border-border bg-surface-subtle px-3 py-2 font-mono text-xs text-text-faint">
                                <span className="text-text-muted">Код ошибки:</span>{' '}
                                <span className="tabular-nums">{error.digest}</span>
                            </div>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
