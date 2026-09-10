"use client"

import GoogleGlyph from "@/shared/icons/google-glyph-icon";

export default function GoogleAuthButtonFeature() {
    return (
        <button
            type="button"
            className="flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface-raised text-sm font-medium text-text-base hover:bg-surface-subtle"
        >
            <GoogleGlyph />
            Продолжить с Google
        </button>
    )
}