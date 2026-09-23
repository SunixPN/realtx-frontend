'use client';
import { useEffect, useState } from 'react';

/**
 * True — iOS Chrome (WebKit-обёртка Chrome под iOS). UA содержит `CriOS`.
 * Android Chrome и десктоп Chrome сюда НЕ попадают.
 *
 * До монтирования — false, чтобы SSR-разметка совпадала с первым client-рендером.
 */
export function useIsIOSChrome(): boolean {
    const [is, setIs] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        setIs(/CriOS/i.test(navigator.userAgent));
    }, []);
    return is;
}
