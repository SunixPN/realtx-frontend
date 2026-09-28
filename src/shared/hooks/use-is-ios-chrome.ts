'use client';
import { useEffect, useState } from 'react';

export function useIsIOSChrome(): boolean {
    const [is, setIs] = useState(false);
    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        setIs(/CriOS|FxiOS/i.test(navigator.userAgent));
    }, []);
    return is;
}
