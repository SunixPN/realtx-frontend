'use client';
import { useEffect, useState } from 'react';

/**
 * True Safari (macOS/iOS) — исключаем iOS-обёртки других браузеров
 * (Chrome/Firefox/Edge на iOS используют WebKit, но у них UA содержит
 * CriOS/FxiOS/EdgiOS). Совпадает с detectSafari() из use-viewport-metrics.
 *
 * До монтирования возвращает false, чтобы SSR-разметка совпадала с
 * client render'ом первого кадра.
 */
export function useIsSafari(): boolean {
    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        const ua = navigator.userAgent;
        setIsSafari(/Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS/i.test(ua));
    }, []);
    return isSafari;
}
