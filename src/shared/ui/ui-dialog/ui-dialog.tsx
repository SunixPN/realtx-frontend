'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import type { TransitionStatus } from 'react-transition-group/Transition';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/helpers/cn';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import { UIBottomSheet, useBottomSheetDrag } from '@/shared/ui/ui-bottom-sheet';

type UIDialogProps = {
    open: boolean;
    onClose: () => void;
    /** Заголовок в шапке. Если не передан — только крестик (контент сам рисует заголовок). */
    title?: ReactNode;
    ariaLabel: string;
    children: ReactNode;
    /** Tailwind max-width класс для десктопной модалки */
    maxWidthClassName?: string;
    /** Блокирует закрытие (например, пока идёт запрос) */
    dismissible?: boolean;
};

const BACKDROP_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: { opacity: 0 },
};
const CARD_STYLE: Record<TransitionStatus, React.CSSProperties> = {
    entering: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    entered: { opacity: 1, transform: 'scale(1) translateY(0)' },
    exiting: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    exited: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
    unmounted: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
};

/**
 * Адаптивный диалог: центрированная модалка на ≥640px и bottom sheet на телефоне.
 */
export function UIDialog({
    open,
    onClose,
    title,
    ariaLabel,
    children,
    maxWidthClassName = 'max-w-[440px]',
    dismissible = true,
}: UIDialogProps) {
    const isMobile = useIsMobile(640);
    const nodeRef = useRef<HTMLDivElement>(null);
    const close = () => { if (dismissible) onClose(); };
    const closeRef = useRef(close);
    useEffect(() => { closeRef.current = close; });

    useEffect(() => {
        if (!open || isMobile) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, isMobile]);

    if (isMobile) {
        return (
            <UIBottomSheet
                open={open}
                onClose={close}
                autoHeight
                ariaLabel={ariaLabel}
                dismissible={dismissible}
                contentClassName="px-5 pb-6"
            >
                <DialogHeader title={title} onClose={close} sheet />
                {children}
            </UIBottomSheet>
        );
    }

    if (typeof document === 'undefined') return null;
    return (
        <Transition nodeRef={nodeRef} in={open} timeout={220} mountOnEnter unmountOnExit>
            {(state) => createPortal(
                <div
                    ref={nodeRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={ariaLabel}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div
                        style={{ ...BACKDROP_STYLE[state], transition: 'opacity 220ms ease-out' }}
                        className="absolute inset-0 bg-surface-overlay backdrop-blur-sm"
                        onClick={close}
                    />
                    <div
                        style={{
                            ...CARD_STYLE[state],
                            transition: 'opacity 220ms ease-out, transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                            maxHeight: 'calc(100dvh - 2rem)',
                        }}
                        className={cn(
                            'relative w-full overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-surface-page p-6 shadow-xl',
                            maxWidthClassName,
                        )}
                    >
                        <DialogHeader title={title} onClose={close} />
                        {children}
                    </div>
                </div>,
                document.body,
            )}
        </Transition>
    );
}

function DialogHeader({ title, onClose, sheet = false }: { title?: ReactNode; onClose: () => void; sheet?: boolean }) {
    const t = useTranslations('common');
    const drag = useBottomSheetDrag();
    const closeButton = (
        <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted"
        >
            <X className="size-5" />
        </button>
    );
    if (!title) {
        return (
            <div
                {...(sheet ? drag?.handlers ?? {} : {})}
                style={sheet ? drag?.style : undefined}
                className={cn('flex justify-end', sheet ? '-mx-5 px-3 py-1 select-none' : '-mt-3 -mr-3 mb-1')}
            >
                {closeButton}
            </div>
        );
    }
    return (
        <div
            {...(sheet ? drag?.handlers ?? {} : {})}
            style={sheet ? drag?.style : undefined}
            className={cn(
                'mb-4 flex items-center justify-between gap-3',
                sheet && '-mx-5 px-5 py-2 select-none',
            )}
        >
            <h2 className="text-lg font-semibold text-text-base">{title}</h2>
            {closeButton}
        </div>
    );
}
