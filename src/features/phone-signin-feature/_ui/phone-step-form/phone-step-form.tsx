'use client';
import { Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { RecaptchaVerifier } from 'firebase/auth';
import { UIInput } from '@/shared/ui/ui-input';
import { UIButton } from '@/shared/ui/ui-button';
import { applyMask } from '@/shared/helpers/apply-mask';
import { getCountry, type CountryCode } from '@/shared/const/countries';
import { usePhoneStepForm } from '@/features/phone-signin-feature/_hooks/use-phone-step-form';
import CountrySelect from '@/features/phone-signin-feature/_ui/country-select/country-select';
type PhoneStepFormProps = {
    getVerifier:   () => RecaptchaVerifier | null;
    resetVerifier: () => RecaptchaVerifier | null;
    onSuccess:     (phone: string) => void;
};
export default function PhoneStepForm({ getVerifier, resetVerifier, onSuccess }: PhoneStepFormProps) {
    const t = useTranslations('auth.phone');
    const { form, onSubmit, isSubmitting } = usePhoneStepForm({ getVerifier, resetVerifier, onSuccess });
    const countryCode = form.watch('countryCode') as CountryCode;
    const country = getCountry(countryCode);
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-text-base">{t('phone_label')}</span>
                <div className="flex items-start gap-2">
                    <Controller
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                            <CountrySelect
                                value={field.value as CountryCode}
                                onChange={(code) => {
                                    field.onChange(code);
                                    form.resetField('phone', { defaultValue: '' });
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <UIInput
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                placeholder={country.mask.replace(/#/g, '0')}
                                className="flex-1"
                                value={field.value}
                                onChange={(e) => field.onChange(applyMask(e.target.value, country.mask))}
                                error={form.formState.errors.phone?.message}
                            />
                        )}
                    />
                </div>
            </div>
            <UIButton type="submit" size="lg" fullWidth loading={isSubmitting}>
                {t('send_code')}
            </UIButton>
        </form>
    );
}
