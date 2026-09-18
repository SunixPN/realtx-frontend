import type { ReactNode } from 'react';
import { UIAuthFooter } from '@/shared/ui/ui-auth-footer';

type UIAuthShellProps = {
    children: ReactNode;
    /** Дополнительный контент под карточкой (например, подсказка «By continuing…»). */
    below?: ReactNode;
    /** Слот, отрисованный внутри main до footer'а — например, скрытый recaptcha-контейнер. */
    slot?: ReactNode;
    /** Скрыть UIAuthFooter (редкие экраны, где юр.футер не нужен). */
    hideFooter?: boolean;
};

export function UIAuthShell({ children, below, slot, hideFooter }: UIAuthShellProps) {
    return (
        <div className="flex min-h-[calc(100dvh-var(--header-height))] flex-col bg-surface-subtle">
            <main className="flex flex-1 items-center justify-center px-4 py-6 sm:py-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised p-5 xs:p-6 sm:gap-5 sm:rounded-lg sm:p-8">
                        {children}
                    </div>

                    {below && <div className="mt-5 sm:mt-6">{below}</div>}
                </div>
            </main>

            {slot}

            {!hideFooter && <UIAuthFooter />}
        </div>
    );
}
