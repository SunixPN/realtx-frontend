'use client';
import Link from "next/link";
import { useTranslations } from 'next-intl';
import {ROUTES} from "@/shared/const/routes";
export default function SignInHeader() {
    const t = useTranslations('auth.sign_in');
    return (
        <header>
            <h1 className="text-xl font-semibold text-text-base xs:text-2xl">{t('title')}</h1>
            <p className="mt-1 text-sm text-text-muted xs:mt-1.5">
                {t('no_account')}{' '}
                <Link
                    href={ROUTES.REGISTER}
                    className="font-medium text-brand hover:underline"
                >
                    {t('create_account')}
                </Link>
            </p>
        </header>
    )
}
