'use client';
import { useEffect, useState } from 'react';

export function useIsMobile(breakpointPx = 1024): boolean {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, [breakpointPx]);
    return isMobile;
}
