'use client';

import { forwardRef, useEffect } from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { useTranslations } from 'next-intl';
import { IconX } from '@/shared/ui/ui-icons';

export type LegalType = 'terms' | 'privacy';

const STYLES: Partial<Record<TransitionStatus, string>> = {
    entering: 'opacity-100 translate-y-0 sm:scale-100',
    entered:  'opacity-100 translate-y-0 sm:scale-100',
    exiting:  'opacity-0 translate-y-4 sm:translate-y-0',
    exited:   'opacity-0 translate-y-4 sm:translate-y-0',
};

const BACKDROP_STYLES: Partial<Record<TransitionStatus, string>> = {
    entering: 'opacity-100',
    entered:  'opacity-100',
    exiting:  'opacity-0',
    exited:   'opacity-0',
};

function TermsBody() {
    const t = useTranslations('legal');
    return (
        <div className="space-y-4 text-sm leading-relaxed text-text-base">
            <p>{t('terms_intro')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_1_title')}</h3>
            <p>{t('terms_1_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_2_title')}</h3>
            <p>{t('terms_2_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_3_title')}</h3>
            <p>{t('terms_3_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_4_title')}</h3>
            <p>{t('terms_4_body')}</p>
            <h3 className="font-semibold text-text-base">{t('terms_5_title')}</h3>
            <p>{t('terms_5_body')}</p>
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
            <p>{t('privacy_3_body')}</p>
            <h3 className="font-semibold text-text-base">{t('privacy_4_title')}</h3>
            <p>{t('privacy_4_body')}</p>
            <h3 className="font-semibold text-text-base">{t('privacy_5_title')}</h3>
            <p>{t('privacy_5_body')}</p>
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

    return (
        <div
            ref={ref}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
        >
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-out ${BACKDROP_STYLES[state] ?? ''}`}
                onClick={onClose}
            />

            <div
                className={`relative z-10 flex w-full max-w-lg flex-col rounded-t-2xl border border-border bg-surface-raised shadow-2xl transition-[opacity,transform] duration-200 ease-out sm:rounded-2xl ${STYLES[state] ?? ''}`}
                style={{ maxHeight: '80dvh' }}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                    <h2 id="legal-modal-title" className="text-sm font-semibold text-text-base">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-text-faint transition-colors hover:bg-surface-subtle hover:text-text-muted"
                        aria-label={tCommon('close')}
                    >
                        <IconX size={16} />
                    </button>
                </div>

                <div className="relative min-h-0 flex-1">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-surface-raised to-transparent" />
                    <div className="overflow-y-auto px-6 py-5">
                        {type === 'terms' ? <TermsBody /> : <PrivacyBody />}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 from-surface-raised to-transparent" />
                </div>
            </div>
        </div>
    );
});

export default UILegalModal;
