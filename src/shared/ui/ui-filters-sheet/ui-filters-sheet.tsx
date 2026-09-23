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

/**
 * Bottom sheet for the "All filters" mobile drawer.
 *
 * Sizing/positioning is driven by the visualViewport API — the panel is
 * pinned to whatever region is *actually visible* to the user. When the
 * virtual keyboard opens on iOS/Android Chrome, the panel snaps to the
 * space above the keyboard on the very same frame the keyboard appears.
 * Because we write top/height directly in pixels (no CSS transition on
 * those properties) and no viewport units are involved, there is no
 * inter-frame interpolation for the browser to jitter over.
 *
 * The only animated property is `transform: translateY` for the enter /
 * exit slide — decoupled from any viewport change.
 */
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
    // Live geometry from visualViewport (or a sensible fallback).
    const [geom, setGeom] = useState<{ top: number; height: number }>({
        top: 0,
        height: 0,
    });
    const scrollYRef = useRef(0);
    const panelRef = useRef<HTMLDivElement>(null);
    const focusedInputRef = useRef<HTMLElement | null>(null);
    // Previous visualViewport.height — so we can detect the moment the
    // keyboard opens (height shrinks) and trigger scrollIntoView only then.
    const prevVvHeightRef = useRef<number | null>(null);

    useLayoutEffect(() => setMounted(true), []);

    // Track visualViewport whenever the sheet is rendered. We update
    // via a rAF loop-once pattern to coalesce back-to-back resize events
    // Chrome fires during keyboard animation.
    // On each shrink (keyboard opening) we also nudge the currently
    // focused input into view — Chrome on Android/iOS otherwise leaves
    // an input at the bottom of the sheet hidden behind the keyboard.
    useEffect(() => {
        if (!rendered) return;
        const vv = window.visualViewport;
        let raf = 0;
        const update = () => {
            raf = 0;
            const nextH = vv ? vv.height : window.innerHeight;
            const nextTop = vv ? vv.offsetTop : 0;
            const prevH = prevVvHeightRef.current;
            setGeom({ top: nextTop, height: nextH });
            // Detect the "keyboard just opened" moment: viewport shrunk
            // by a meaningful amount (>100px filters out URL-bar hides).
            const shrunk = prevH !== null && nextH < prevH - 100;
            prevVvHeightRef.current = nextH;
            if (shrunk && focusedInputRef.current) {
                // Wait for the panel to have laid out at its new height
                // before scrolling — otherwise scrollIntoView aims for a
                // position that's about to change.
                requestAnimationFrame(() => {
                    focusedInputRef.current?.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                        behavior: 'smooth',
                    });
                });
            }
        };
        const schedule = () => {
            if (raf) return;
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('resize', schedule);
        window.addEventListener('orientationchange', schedule);
        vv?.addEventListener('resize', schedule);
        vv?.addEventListener('scroll', schedule);
        return () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener('resize', schedule);
            window.removeEventListener('orientationchange', schedule);
            vv?.removeEventListener('resize', schedule);
            vv?.removeEventListener('scroll', schedule);
            prevVvHeightRef.current = null;
        };
    }, [rendered]);

    // Track the currently focused text input *inside* the panel. Stored
    // in a ref so the visualViewport effect can read it without re-subscribing.
    useEffect(() => {
        if (!rendered) return;
        const isTextInput = (el: Element | null): el is HTMLElement => {
            if (!el) return false;
            if (el instanceof HTMLTextAreaElement) return true;
            if (el instanceof HTMLInputElement) {
                const type = el.type.toLowerCase();
                return !['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden', 'range', 'color'].includes(type);
            }
            return (el as HTMLElement).isContentEditable === true;
        };
        const onFocusIn = (e: FocusEvent) => {
            const target = e.target as Element | null;
            if (!panelRef.current || !target) return;
            if (!panelRef.current.contains(target)) return;
            if (!isTextInput(target)) return;
            focusedInputRef.current = target;
        };
        const onFocusOut = () => {
            focusedInputRef.current = null;
        };
        document.addEventListener('focusin', onFocusIn, true);
        document.addEventListener('focusout', onFocusOut, true);
        return () => {
            document.removeEventListener('focusin', onFocusIn, true);
            document.removeEventListener('focusout', onFocusOut, true);
            focusedInputRef.current = null;
        };
    }, [rendered]);

    useEffect(() => {
        if (open) {
            setRendered(true);
            // Two rAFs so the mounted node paints with translateY(100%)
            // first, THEN transitions to 0. One rAF is not always enough
            // on iOS to flush the initial style.
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

    // Body scroll lock via position:fixed. Preserves iOS scroll position
    // through open/close.
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
                    height: `${height}px`,
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
