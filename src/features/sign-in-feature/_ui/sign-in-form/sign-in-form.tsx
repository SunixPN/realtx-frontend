'use client';
import { useTranslations } from 'next-intl';
import {UIInput} from "@/shared/ui/ui-input";
import UIInputPassword from "@/shared/ui/ui-input-password/ui-input-password";
import Link from "next/link";
import {ROUTES} from "@/shared/const/routes";
import {UIButton} from "@/shared/ui/ui-button";
import {useSignInForm} from "@/features/sign-in-feature/_hooks/use-sign-in-form";
export default function SignInForm() {
    const t = useTranslations('auth.sign_in');
    const { form, onSubmit, isSubmitting } = useSignInForm()
    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
        >
            <UIInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
            />
            <div>
                <UIInputPassword
                    label={t('password_label')}
                    placeholder={t('password_placeholder')}
                    autoComplete="current-password"
                    error={form.formState.errors.password?.message}
                    {...form.register('password')}
                />
                <div className="mt-1.5 text-right">
                    <Link
                        href={ROUTES.RESET}
                        className="text-xs font-medium text-brand hover:underline"
                    >
                        {t('forgot_password')}
                    </Link>
                </div>
            </div>
            <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                {t('submit')}
            </UIButton>
        </form>
    )
}
