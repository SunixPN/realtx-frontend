'use client';

import { useEffect, useState } from 'react';

export const useResendCooldown = (initialSec: number = 45) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSec);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setInterval(() => {
            setSecondsLeft((s) => Math.max(s - 1, 0));
        }, 1000);
        return () => clearInterval(id);
    }, [secondsLeft]);

    return {
        secondsLeft,
        canResend: secondsLeft <= 0,
        restart: () => setSecondsLeft(initialSec),
    };
};
