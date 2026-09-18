'use client';

import { useEffect, useRef } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '@/shared/firebase/firebase';

export const useRecaptcha = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const verifierRef = useRef<RecaptchaVerifier | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const verifier = new RecaptchaVerifier(firebaseAuth, containerRef.current, {
            size: 'invisible',
        });
        verifierRef.current = verifier;
        return () => {
            try {
                verifier.clear();
            }

            catch (e) {
                console.log(e)
            }

            verifierRef.current = null;
        };
    }, []);

    const resetVerifier = () => {
        if (!containerRef.current) return null;
        verifierRef.current?.clear();
        const next = new RecaptchaVerifier(firebaseAuth, containerRef.current, {
            size: 'invisible',
        });
        verifierRef.current = next;
        return next;
    };

    return {
        containerRef,
        getVerifier: () => verifierRef.current,
        resetVerifier,
    };
};
