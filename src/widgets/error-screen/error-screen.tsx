'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { ROUTES } from '@/shared/const/routes';
import { UIButton } from '@/shared/ui/ui-button';
import {
    IconAlertTriangle,
    IconArrowLeft,
    IconCompass,
    IconHome,
    IconRefreshCw,
} from '@/shared/ui/ui-icons';

type Tone = 'brand' | 'danger';

function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center bg-surface-page">
            <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-6 px-6 py-10 text-center sm:py-16">
                {children}
            </div>
        </div>
    );
}

function BigCode({ code, tone }: { code: string; tone: Tone }) {
    return (
        <div
            aria-hidden
            className={
                'select-none font-semibold leading-none tracking-tight tabular-nums text-[104px] sm:text-[128px] ' +
                (tone === 'brand' ? 'text-brand' : 'text-error')
            }
        >
            {code}
        </div>
    );
}

function IconBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
    const cls =
        tone === 'brand'
            ? 'bg-brand-bg text-brand'
            : 'bg-[color:var(--error-bg)] text-error';
    return (
        <span className={'flex size-14 items-center justify-center rounded-2xl ' + cls}>
            {children}
        </span>
    );
}

export function NotFoundScreen() {
    const t = useTranslations('errors');
    const router = useRouter();
    return (
        <Shell>
            <BigCode code="404" tone="brand" />
            <IconBadge tone="brand">
                <IconCompass size={28} />
            </IconBadge>
            <div>
                <h1 className="text-2xl font-semibold text-text-base sm:text-3xl">
                    {t('not_found_title')}
                </h1>
                <p className="mt-2 text-base text-text-muted">
                    {t('not_found_description')}
                </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href={ROUTES.ROOT} className="contents">
                    <UIButton
                        size="lg"
                        variant="primary"
                        iconLeft={<IconHome size={18} />}
                        fullWidth
                    >
                        {t('to_home')}
                    </UIButton>
                </Link>
                <UIButton
                    size="lg"
                    variant="secondary"
                    iconLeft={<IconArrowLeft size={18} />}
                    fullWidth
                    onClick={() => router.back()}
                >
                    {t('go_back')}
                </UIButton>
            </div>
        </Shell>
    );
}

export function SomethingWentWrongScreen({
    onRetry,
    digest,
}: {
    onRetry: () => void;
    digest?: string;
}) {
    const t = useTranslations('errors');
    return (
        <Shell>
            <BigCode code="500" tone="danger" />
            <IconBadge tone="danger">
                <IconAlertTriangle size={28} />
            </IconBadge>
            <div>
                <h1 className="text-2xl font-semibold text-text-base sm:text-3xl">
                    {t('crash_title')}
                </h1>
                <p className="mt-2 text-base text-text-muted">
                    {t('crash_description')}
                </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <UIButton
                    size="lg"
                    variant="primary"
                    iconLeft={<IconRefreshCw size={18} />}
                    fullWidth
                    onClick={onRetry}
                >
                    {t('retry')}
                </UIButton>
                <Link href={ROUTES.ROOT} className="contents">
                    <UIButton
                        size="lg"
                        variant="secondary"
                        iconLeft={<IconHome size={18} />}
                        fullWidth
                    >
                        {t('to_home')}
                    </UIButton>
                </Link>
            </div>
            {digest && (
                <div className="mt-2 rounded-md border border-border bg-surface-subtle px-3 py-2 font-mono text-xs text-text-faint">
                    <span className="text-text-muted">{t('digest_label')}:</span>{' '}
                    <span className="tabular-nums">{digest}</span>
                </div>
            )}
        </Shell>
    );
}
