"use client"
import {ComponentProps, useState} from "react";
import { useTranslations } from 'next-intl';
import {UIInput} from "@/shared/ui/ui-input";
import {IconEye, IconEyeOff} from "@/shared/ui/ui-icons";
type UIInputPasswordProps = ComponentProps<typeof UIInput>
export default function UIInputPassword(props: UIInputPasswordProps) {
    const t = useTranslations('common');
    const [showPassword, setShowPassword] = useState(false);
    return (
        <UIInput
            {...props}
            type={showPassword ? 'text' : 'password'}
            rightSlot={
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t('hide_password_aria') : t('show_password_aria')}
                    className="flex size-6 cursor-pointer items-center justify-center text-text-faint hover:text-text-base"
                >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
            }
        />
    )
}