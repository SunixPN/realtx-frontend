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
    bottomInset?: number;
};

const DURATION_MS = 280;

export function UIFiltersSheet({
    open,
    onClose,
    ariaLabel,
    children,
    className,
    bottomInset = 0,
}: UIFiltersSheetProps) {
    const [mounted, setMounted] = useState(false);
    const [rendered, setRendered] = useState(open);
    const [visible, setVisible] = useState(false);
    const [geom, setGeom] = useState<{ top: number; height: number }>({
        top: 0,
        height: 0,
    });
    const scrollYRef = useRef(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const bottomInsetRef = useRef(bottomInset);
    bottomInsetRef.current = bottomInset;

    useLayoutEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!rendered) return;
        const vv = window.visualViewport;
        const update = () => {
            setGeom({
                top: vv ? vv.offsetTop : 0,
                height: vv ? vv.height : window.innerHeight,
            });
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        vv?.addEventListener('resize', update);
        vv?.addEventListener('scroll', update);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
            vv?.removeEventListener('resize', update);
            vv?.removeEventListener('scroll', update);
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
                const usableBottom = vvBottom - bottomInsetRef.current - SAFE_MARGIN;
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

    // If we haven't measured yet, fall back to full viewport values so the
    // very first paint still positions the sheet sensibly.
    const top = geom.height > 0 ? geom.top : 0;
    const height = geom.height > 0 ? geom.height : window.innerHeight;

    return createPortal(
        <>
            <div
                onClick={onClose}
                aria-hidden
                style={{
                    position: 'fixed',
                    top: `${top}px`,
                    left: 0,
                    width: '100%',
                    height: `${height}px`,
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
                    top: `${top}px`,
                    left: 0,
                    width: '100%',
                    height: `100dvh`,
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
