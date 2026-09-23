'use client';
import { useEffect, useState } from 'react';

/**
 * True on iOS Chrome (CriOS) and iOS Firefox (FxiOS) — both use WKWebView
 * and share the same virtualViewport jitter behaviour with the virtual keyboard.
 * Android Chrome and desktop browsers return false.
 *
 * Starts as false so SSR markup matches the first client render.
 */
export function useIsIOSChrome(): boolean {
    const [is, setIs] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        setIs(/CriOS|FxiOS/i.test(navigator.userAgent));
    }, []);
    return is;
}
