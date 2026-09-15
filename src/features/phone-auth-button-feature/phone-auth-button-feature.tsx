'use client';

import Link from 'next/link';
import { IconPhone } from '@/shared/ui/ui-icons';
import { ROUTES } from '@/shared/const/routes';

export default function PhoneAuthButtonFeature() {
    return (
        <Link
            href={ROUTES.SIGN_IN_PHONE}
            className="flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface-raised text-sm font-medium text-text-base hover:bg-surface-subtle"
        >
            <IconPhone size={16} className="text-text-muted" />
            По номеру телефона
        </Link>
    );
}
