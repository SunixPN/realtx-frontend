'use client';
import { useEffect, useState } from 'react';

export function useIsSafari(): boolean {
    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        const ua = navigator.userAgent;
        setIsSafari(/Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS/i.test(ua));
    }, []);
    return isSafari;
}
