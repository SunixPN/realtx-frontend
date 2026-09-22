import type { ReactNode } from 'react';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';
type UIAuthShellProps = {
    children: ReactNode;
    below?: ReactNode;
    slot?: ReactNode;
    hideFooter?: boolean;
};
export function UIAuthShell({ children, below, slot, hideFooter }: UIAuthShellProps) {
    return (
        <div
            className="relative flex flex-col bg-surface-subtle"
            style={{ minHeight: 'calc(var(--app-height, 100dvh) - var(--header-height))' }}
        >
            <main className="flex flex-1 items-center justify-center px-3 py-4 xs:px-4 xs:py-6 sm:py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised p-4 xs:p-6 sm:gap-5 sm:rounded-lg sm:p-8">
                        {children}
                    </div>
                    {below && <div className="mt-4 xs:mt-5 sm:mt-6">{below}</div>}
                </div>
            </main>
            {slot && <div className="pointer-events-none absolute size-0 overflow-hidden">{slot}</div>}
            {!hideFooter && <UIAuthFooter />}
        </div>
    );
}
