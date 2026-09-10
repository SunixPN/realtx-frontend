"use client"

import {UIInput} from "@/shared/ui/ui-input";
import {IconEye, IconEyeOff} from "@/shared/ui/ui-icons";
import {ComponentProps, useState} from "react";

type UIInputPasswordProps = ComponentProps<typeof UIInput>

export default function UIInputPassword(props: UIInputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <UIInput
            {...props}
            type={showPassword ? 'text' : 'password'}
            rightSlot={
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    className="flex size-6 cursor-pointer items-center justify-center text-text-faint hover:text-text-base"
                >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
            }
        />
    )
}