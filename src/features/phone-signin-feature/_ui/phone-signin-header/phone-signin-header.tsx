'use client';

import { useTranslations } from 'next-intl';
import { IconArrowLeft, IconPhone } from '@/shared/ui/ui-icons';

type PhoneSignInHeaderProps = {
    title:    string;
    subtitle: React.ReactNode;
    onBack:   () => void;
};

export default function PhoneSignInHeader({ title, subtitle, onBack }: PhoneSignInHeaderProps) {
    const t = useTranslations('common');
    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                onClick={onBack}
                className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-base"
            >
                <IconArrowLeft size={14} />
                {t('back')}
            </button>

            <div className="flex flex-col items-center gap-3 pt-1 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-bg text-brand">
                    <IconPhone size={28} />
                </span>
                <h1 className="text-2xl font-semibold text-text-base">{title}</h1>
                <p className="max-w-sm text-sm text-text-muted">{subtitle}</p>
            </div>
        </div>
    );
}
