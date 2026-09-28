'use client';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import {cn} from '@/shared/helpers/cn';

type UIBottomSheetProps = {
    open: boolean;
    onClose: () => void;
    snapPoints?: number[];
    initialSnapIndex?: number;
    onSnapChange?: (index: number) => void;
    autoHeight?: boolean;
    autoMaxDvh?: number;
    ariaLabel?: string;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    showHandle?: boolean;
    dismissible?: boolean;
    dismissOnBackdrop?: boolean;
};

const DURATION_MS = 320;

type DragHandlers = {
    onPointerDown: (e: ReactPointerEvent) => void;
    onPointerMove: (e: ReactPointerEvent) => void;
    onPointerUp: (e: ReactPointerEvent) => void;
    onPointerCancel: (e: ReactPointerEvent) => void;
};

type BottomSheetCtx = {
    dragHandlers: DragHandlers;
    dragStyle: CSSProperties;
    snapIdx: number;
    snapCount: number;
};

const Ctx = createContext<BottomSheetCtx | null>(null);

export function useBottomSheetDrag(): {
    handlers: DragHandlers;
    style: CSSProperties;
} | null {
    const ctx = useContext(Ctx);
    if (!ctx) return null;
    return {handlers: ctx.dragHandlers, style: ctx.dragStyle};
}

export function UIBottomSheet({
    open,
    onClose,
    snapPoints = [0.95],
    initialSnapIndex,
    onSnapChange,
    autoHeight = false,
    autoMaxDvh = 85,
    ariaLabel,
    children,
    className,
    contentClassName,
    showHandle = true,
    dismissible = true,
    dismissOnBackdrop = true,
}: UIBottomSheetProps) {
    const [mounted, setMounted] = useState(false);
    const [rendered, setRendered] = useState(open);
    const [visible, setVisible] = useState(false);
    const [snapIdx, setSnapIdx] = useState(
        initialSnapIndex ?? snapPoints.length - 1,
    );
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startY = useRef<number | null>(null);
    const startTime = useRef(0);
    const activePointerId = useRef<number | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelHeightRef = useRef(0);
    const dismissingRef = useRef(false);
    const [dismissing, setDismissing] = useState(false);

    useLayoutEffect(() => setMounted(true), []);

    useLayoutEffect(() => {
        if (!rendered) return;
        const measure = () => {
            if (panelRef.current) {
                panelHeightRef.current = panelRef.current.offsetHeight;
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [rendered]);

    useEffect(() => {
        if (open) {
            setRendered(true);
            setSnapIdx(initialSnapIndex ?? snapPoints.length - 1);
            dismissingRef.current = false;
            setDismissing(false);
            setDragY(0);
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
    }, [open, initialSnapIndex, snapPoints.length]);

    useEffect(() => {
        if (!rendered || !visible) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [rendered, visible]);

    useEffect(() => {
        if (!open || !dismissible) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose, dismissible]);

    const commitSnap = useCallback(
        (idx: number) => {
            setSnapIdx(idx);
            onSnapChange?.(idx);
        },
        [onSnapChange],
    );

    const onPointerDown = useCallback((e: ReactPointerEvent) => {
        if (!dismissible) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const target = e.target as HTMLElement | null;
        if (target && target.closest('button, a, input, textarea, select, [role="button"]')) {
            return;
        }
        startY.current = e.clientY;
        startTime.current = Date.now();
        activePointerId.current = e.pointerId;
        setDragging(true);
    }, [dismissible]);

    const onPointerMove = useCallback((e: ReactPointerEvent) => {
        if (startY.current === null) return;
        if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
        const dy = e.clientY - startY.current;
        setDragY(dy);
    }, []);

    const dismissWithSwipe = () => {
        dismissingRef.current = true;
        setDismissing(true);
        const panelHeight = panelHeightRef.current || window.innerHeight;
        setDragY(panelHeight);
        onClose();
        window.setTimeout(() => {
            dismissingRef.current = false;
            setDismissing(false);
            setDragY(0);
        }, DURATION_MS + 20);
    }

    const onPointerUp = useCallback((e: ReactPointerEvent) => {
        if (startY.current === null) return;
        if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
        const dy = e.clientY - startY.current;
        const dt = Date.now() - startTime.current;
        const velocity = dy / Math.max(1, dt);
        startY.current = null;
        activePointerId.current = null;
        setDragging(false);

        const panelHeight = panelHeightRef.current || window.innerHeight;
        const maxFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapPoints.length - 1] ?? 1;
        const currentFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapIdx] ?? maxFrac;
        const visibleHeight = (currentFrac / maxFrac) * panelHeight;

        if (velocity > 0.6 && dy > 30) {
            dismissWithSwipe();
            return;
        }
        if (!autoHeight && velocity < -0.6 && dy < -30) {
            if (snapIdx < snapPoints.length - 1) commitSnap(snapIdx + 1);
            setDragY(0);
            return;
        }
        if (dy > visibleHeight * 0.32) {
            if (autoHeight || snapIdx === 0) {
                dismissWithSwipe();
                return;
            }
            commitSnap(snapIdx - 1);
        } else if (!autoHeight && dy < -visibleHeight * 0.2 && snapIdx < snapPoints.length - 1) {
            commitSnap(snapIdx + 1);
        }
        setDragY(0);
    }, [autoHeight, autoMaxDvh, snapIdx, snapPoints, commitSnap, dismissWithSwipe]);

    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e: PointerEvent) => {
            if (startY.current === null) return;
            if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
            const dy = e.clientY - startY.current;
            setDragY(dy);
        };
        const handleUp = (e: PointerEvent) => {
            if (startY.current === null) return;
            if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
            const dy = e.clientY - startY.current;
            const dt = Date.now() - startTime.current;
            const velocity = dy / Math.max(1, dt);
            startY.current = null;
            activePointerId.current = null;
            setDragging(false);

            const panelHeight = panelHeightRef.current || window.innerHeight;
            const maxFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapPoints.length - 1] ?? 1;
            const currentFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapIdx] ?? maxFrac;
            const visibleHeight = (currentFrac / maxFrac) * panelHeight;

            if (velocity > 0.6 && dy > 30) {
                dismissWithSwipe();
                return;
            }
            if (!autoHeight && velocity < -0.6 && dy < -30) {
                if (snapIdx < snapPoints.length - 1) commitSnap(snapIdx + 1);
                setDragY(0);
                return;
            }
            if (dy > visibleHeight * 0.32) {
                if (autoHeight || snapIdx === 0) {
                    dismissWithSwipe();
                    return;
                }
                commitSnap(snapIdx - 1);
            } else if (!autoHeight && dy < -visibleHeight * 0.2 && snapIdx < snapPoints.length - 1) {
                commitSnap(snapIdx + 1);
            }
            setDragY(0);
        };
        window.addEventListener('pointermove', handleMove, {passive: true});
        window.addEventListener('pointerup', handleUp, {passive: true});
        window.addEventListener('pointercancel', handleUp, {passive: true});
        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
            window.removeEventListener('pointercancel', handleUp);
        };
    }, [dragging, autoHeight, autoMaxDvh, snapIdx, snapPoints, commitSnap]);

    const dragHandlers: DragHandlers = useMemo(() => ({
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
    }), [onPointerDown, onPointerMove, onPointerUp]);

    const dragStyle: CSSProperties = useMemo(() => ({touchAction: 'pan-y'}), []);

    useEffect(() => {
        if (!dragging) return;
        const onTouchMove = (e: TouchEvent) => {
            if (startY.current !== null) e.preventDefault();
        };
        document.addEventListener('touchmove', onTouchMove, {passive: false});
        return () => document.removeEventListener('touchmove', onTouchMove);
    }, [dragging]);

    const ctxValue = useMemo<BottomSheetCtx>(() => ({
        dragHandlers,
        dragStyle,
        snapIdx,
        snapCount: snapPoints.length,
    }), [dragHandlers, dragStyle, snapIdx, snapPoints.length]);

    if (!mounted || typeof document === 'undefined') return null;
    if (!rendered && !open) return null;

    const maxFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapPoints.length - 1] ?? 1;
    const currentFrac = autoHeight ? autoMaxDvh / 100 : snapPoints[snapIdx] ?? maxFrac;
    const baseOffsetDvh = (maxFrac - currentFrac) * 100;

    let effectiveDragY = dragY;
    if (dragY < 0 && (autoHeight || snapIdx >= snapPoints.length - 1)) {
        effectiveDragY = -Math.sqrt(-dragY * 40);
    }

    const heightStyle: CSSProperties = autoHeight
        ? {maxHeight: `${autoMaxDvh}dvh`}
        : {height: `${maxFrac * 100}dvh`};

    // Both hidden and shown transforms use the same translate3d + calc
    // syntax. iOS Safari refuses to interpolate between mixed forms
    // (e.g. `translateY(95dvh)` -> `translate3d(0, calc(...))`), which
    // left the panel stuck off-screen while the backdrop faded in.
    const hiddenTransform = `translate3d(0, calc(${maxFrac * 100}dvh + 0px), 0)`;
    const shownTransform = `translate3d(0, calc(${baseOffsetDvh}dvh + ${effectiveDragY}px), 0)`;


    return createPortal(
        <Ctx.Provider value={ctxValue}>
            <div
                onClick={() => {
                    if (dismissible && dismissOnBackdrop) onClose();
                }}
                aria-hidden
                className={cn(
                    'fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]',
                    'transition-opacity duration-300 ease-out',
                    visible && !dismissing ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                style={{
                    ...heightStyle,
                    transform: visible || dismissing ? shownTransform : hiddenTransform,
                    transition: dragging
                        ? 'none'
                        : `transform ${DURATION_MS}ms cubic-bezier(.32,.72,0,1)`,
                    willChange: 'transform',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    pointerEvents: visible && !dismissing ? undefined : 'none',
                }}
                className={cn(
                    'fixed inset-x-0 bottom-0 z-[90] flex flex-col overflow-hidden',
                    'rounded-t-2xl border-t border-border bg-surface-raised',
                    'shadow-[0_-12px_40px_-12px_rgb(15_23_42/0.28)]',
                    className,
                )}
            >
                {showHandle && (
                    <div
                        {...dragHandlers}
                        style={dragStyle}
                        className="flex shrink-0 cursor-grab items-center justify-center py-2.5 active:cursor-grabbing"
                    >
                        <span className="h-1 w-10 rounded-full bg-border-strong"/>
                    </div>
                )}
                <div className={cn('flex min-h-0 flex-1 flex-col', contentClassName)}>
                    {children}
                </div>
            </div>
        </Ctx.Provider>,
        document.body,
    );
}
