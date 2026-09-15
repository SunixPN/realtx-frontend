import type { ReactNode } from 'react';
import { IconLoader } from '@/shared/ui/ui-icons';

type UILinkCheckerProps = {
    title:    string;
    subtitle: ReactNode;
    note?:    ReactNode;
};

export function UILinkChecker({ title, subtitle, note }: UILinkCheckerProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-4 py-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-bg text-brand">
                    <IconLoader size={28} className="animate-spin" />
                </span>
                <h1 className="text-xl font-semibold text-text-base">{title}</h1>
                <p className="max-w-sm text-sm text-text-muted">{subtitle}</p>
            </div>

            {note && (
                <div className="rounded-md border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-text-faint">
                    {note}
                </div>
            )}
        </div>
    );
}
