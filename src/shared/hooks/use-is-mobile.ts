'use client';
import { useEffect, useState } from 'react';

/**
 * Returns true when viewport width is below the given breakpoint (default: md = 768px).
 * Safe for SSR — starts as false on the server, updates after mount.
 */
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
