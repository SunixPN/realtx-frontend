'use client';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/helpers/cn';

type UIFiltersSheetProps = {
    open: boolean;
    onClose: () => void;
    ariaLabel?: string;
    children: ReactNode;
    className?: string;
};

const DURATION_MS = 280;

export function UIFiltersSheet({
    open,
    onClose,
    ariaLabel,
    children,
    className,
}: UIFiltersSheetProps) {
    const [mounted, setMounted] = useState(false);
    const [rendered, setRendered] = useState(open);
    const [visible, setVisible] = useState(false);
    const scrollYRef = useRef(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => setMounted(true), []);

    // iOS Chrome при показе клавиатуры покадрово ужимает весь webview (100dvh
    // и innerHeight уменьшаются), и шторка на 100dvh перестраивалась каждый
    // кадр анимации — низ с кнопками «мигал». Поэтому высоту фиксируем в px
    // на момент открытия: клавиатура просто перекрывает низ, как в Safari/Android.
    // Высоту клавиатуры отдаём в --sheet-kb — прокручиваемая область добавляет
    // её снизу отступом, чтобы нижние поля можно было поднять над клавиатурой.
    useLayoutEffect(() => {
        if (!rendered) return;
        const vv = window.visualViewport;
        let frozenHeight = window.innerHeight;
        let rotateTimer = 0;
        const applyHeight = () => {
            const h = `${frozenHeight}px`;
            if (panelRef.current) panelRef.current.style.height = h;
            if (backdropRef.current) backdropRef.current.style.height = h;
        };
        const syncKeyboard = () => {
            const visible = vv ? vv.offsetTop + vv.height : window.innerHeight;
            const kb = Math.max(0, frozenHeight - visible);
            panelRef.current?.style.setProperty('--sheet-kb', `${kb}px`);
        };
        const onOrientationChange = () => {
            (document.activeElement as HTMLElement | null)?.blur();
            window.clearTimeout(rotateTimer);
            rotateTimer = window.setTimeout(() => {
                frozenHeight = window.innerHeight;
                applyHeight();
                syncKeyboard();
            }, 300);
        };
        applyHeight();
        syncKeyboard();
        vv?.addEventListener('resize', syncKeyboard);
        window.addEventListener('orientationchange', onOrientationChange);
        return () => {
            window.clearTimeout(rotateTimer);
            vv?.removeEventListener('resize', syncKeyboard);
            window.removeEventListener('orientationchange', onOrientationChange);
        };
    }, [rendered]);

    useEffect(() => {
        if (!rendered) return;
        const FOCUS_SETTLE_MS = 350;
        let timer = 0;
        const isTextInput = (el: Element | null): el is HTMLElement => {
            if (!el) return false;
            if (el instanceof HTMLTextAreaElement) return true;
            if (el instanceof HTMLInputElement) {
                const type = el.type.toLowerCase();
                return !['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden', 'range', 'color'].includes(type);
            }
            return (el as HTMLElement).isContentEditable === true;
        };
        const findScrollableAncestor = (el: HTMLElement): HTMLElement | null => {
            let node: HTMLElement | null = el.parentElement;
            while (node) {
                const cs = getComputedStyle(node);
                if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
                    return node;
                }
                node = node.parentElement;
            }
            return null;
        };
        const scheduleScroll = (input: HTMLElement) => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                const vv = window.visualViewport;
                const rect = input.getBoundingClientRect();
                const vvBottom = (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight);
                const SAFE_MARGIN = 16;
                const usableBottom = vvBottom - SAFE_MARGIN;
                const overflow = rect.bottom - usableBottom;
                if (overflow <= 0) return;
                const scroller = findScrollableAncestor(input) ?? document.scrollingElement as HTMLElement | null;
                scroller?.scrollBy({ top: overflow, behavior: 'smooth' });
            }, FOCUS_SETTLE_MS);
        };
        const onFocusIn = (e: FocusEvent) => {
            const target = e.target as Element | null;
            if (!panelRef.current || !target) return;
            if (!panelRef.current.contains(target)) return;
            if (!isTextInput(target)) return;
            scheduleScroll(target as HTMLElement);
        };
        const onFocusOut = () => {
            window.clearTimeout(timer);
        };
        document.addEventListener('focusin', onFocusIn, true);
        document.addEventListener('focusout', onFocusOut, true);
        return () => {
            window.clearTimeout(timer);
            document.removeEventListener('focusin', onFocusIn, true);
            document.removeEventListener('focusout', onFocusOut, true);
        };
    }, [rendered]);

    useEffect(() => {
        if (open) {
            setRendered(true);
            let raf2 = 0;
            const raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setVisible(true));
            });
            return () => {
                cancelAnimationFrame(raf1);
                if (raf2) cancelAnimationFrame(raf2);
            };
        }
        setVisible(false);
        const t = window.setTimeout(() => setRendered(false), DURATION_MS);
        return () => window.clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!rendered || !visible) return;
        scrollYRef.current = window.scrollY;
        const body = document.body;
        const prev = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        body.style.position = 'fixed';
        body.style.top = `-${scrollYRef.current}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        return () => {
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.left = prev.left;
            body.style.right = prev.right;
            body.style.width = prev.width;
            body.style.overflow = prev.overflow;
            window.scrollTo(0, scrollYRef.current);
        };
    }, [rendered, visible]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!mounted || typeof document === 'undefined') return null;
    if (!rendered && !open) return null;

    return createPortal(
        <>
            <div
                ref={backdropRef}
                onClick={onClose}
                aria-hidden
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 80,
                }}
                className={cn(
                    'bg-black/40 backdrop-blur-[2px]',
                    'transition-opacity duration-300 ease-out',
                    visible ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,100%,0)',
                    transition: `transform ${DURATION_MS}ms cubic-bezier(.32,.72,0,1)`,
                    willChange: 'transform',
                    zIndex: 90,
                    pointerEvents: visible ? undefined : 'none',
                }}
                className={cn(
                    'flex flex-col bg-surface-page',
                    className,
                )}
            >
                {children}
            </div>
        </>,
        document.body,
    );
}
