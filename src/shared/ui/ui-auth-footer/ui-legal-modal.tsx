'use client';

import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { TransitionStatus } from 'react-transition-group';
import { useTranslations } from 'next-intl';
import { IconX } from '@/shared/ui/ui-icons';

export type LegalType = 'terms' | 'privacy';

const BACKDROP_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:   { opacity: 0 },
    unmounted: { opacity: 0 },
};

const CARD_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    entered:  { opacity: 1, transform: 'scale(1) translateY(0)' },
    exiting:  { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    exited:   { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    unmounted: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
};

function TermsBody() {
    const t = useTranslations('legal');
    return (
        <div className="space-y-4 text-sm leading-relaxed text-text-base">
            <p>{t('terms_intro')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_1_title')}</h3>
            <p className="text-text-muted">{t('terms_1_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_2_title')}</h3>
            <p className="text-text-muted">{t('terms_2_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_3_title')}</h3>
            <p className="text-text-muted">{t('terms_3_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_4_title')}</h3>
            <p className="text-text-muted">{t('terms_4_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_5_title')}</h3>
            <p className="text-text-muted">{t('terms_5_body')}</p>
        </div>
    );
}

function PrivacyBody() {
    const t = useTranslations('legal');
    return (
        <div className="space-y-4 text-sm leading-relaxed text-text-base">
            <p>{t('privacy_intro')}</p>
            <h3 className="font-semibold text-text-base">{t('privacy_1_title')}</h3>
            <ul className="list-disc space-y-1 pl-4 text-text-muted">
                <li>{t('privacy_1_item_1')}</li>
                <li>{t('privacy_1_item_2')}</li>
                <li>{t('privacy_1_item_3')}</li>
                <li>{t('privacy_1_item_4')}</li>
            </ul>
            <h3 className="font-semibold text-text-base">{t('privacy_2_title')}</h3>
            <ul className="list-disc space-y-1 pl-4 text-text-muted">
                <li>{t('privacy_2_item_1')}</li>
                <li>{t('privacy_2_item_2')}</li>
                <li>{t('privacy_2_item_3')}</li>
            </ul>
            <h3 className="font-semibold text-text-base">{t('privacy_3_title')}</h3>
            <p className="text-text-muted">{t('privacy_3_body')}</p>
            <h3 className="font-semibold text-text-base">{t('privacy_4_title')}</h3>
            <p className="text-text-muted">{t('privacy_4_body')}</p>
            <h3 className="font-semibold text-text-base">{t('privacy_5_title')}</h3>
            <p className="text-text-muted">{t('privacy_5_body')}</p>
        </div>
    );
}

type Props = {
    type: LegalType;
    state: TransitionStatus;
    onClose: () => void;
};

const UILegalModal = forwardRef<HTMLDivElement, Props>(function UILegalModal({ type, state, onClose }, ref) {
    const tFooter = useTranslations('auth.footer');
    const tCommon = useTranslations('common');
    const title = type === 'terms' ? tFooter('terms_title') : tFooter('privacy_title');

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            ref={ref}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
        >
            <div
                style={{ ...BACKDROP_STYLE[state], transition: 'opacity 220ms ease-out' }}
                className="absolute inset-0 bg-surface-overlay backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                style={{
                    ...CARD_STYLE[state],
                    transition: 'opacity 220ms ease-out, transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                    maxHeight: 'calc(100dvh - 2rem)',
                }}
                className="relative flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-border bg-surface-page shadow-xl"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                    <h2 id="legal-modal-title" className="text-base font-semibold text-text-base">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted"
                        aria-label={tCommon('close')}
                    >
                        <IconX size={16} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    {type === 'terms' ? <TermsBody /> : <PrivacyBody />}
                </div>
            </div>
        </div>,
        document.body,
    );
});

export default UILegalModal;
