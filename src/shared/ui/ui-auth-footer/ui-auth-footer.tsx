'use client';

import { useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import UILegalModal, { type LegalType } from './ui-legal-modal';

export function UIAuthFooter() {
    const [open, setOpen] = useState<LegalType | null>(null);
    const [current, setCurrent] = useState<LegalType | null>(null);
    const nodeRef = useRef<HTMLDivElement>(null);

    const openModal = (type: LegalType) => {
        setCurrent(type);
        setOpen(type);
    };

    const closeModal = () => setOpen(null);

    return (
        <>
            <footer className="border-t border-border bg-surface-raised px-4 py-4 text-center text-xs text-text-faint">
                Продолжая, вы соглашаетесь с{' '}
                <button
                    type="button"
                    className="cursor-pointer text-inherit underline transition-colors hover:text-text-muted"
                    onClick={() => openModal('terms')}
                >
                    условиями использования
                </button>{' '}
                и{' '}
                <button
                    type="button"
                    className="cursor-pointer text-inherit underline transition-colors hover:text-text-muted"
                    onClick={() => openModal('privacy')}
                >
                    политикой конфиденциальности
                </button>
            </footer>

            <Transition nodeRef={nodeRef} in={open !== null} timeout={200} mountOnEnter unmountOnExit>
                {(state) => (
                    <UILegalModal
                        ref={nodeRef}
                        type={current!}
                        state={state}
                        onClose={closeModal}
                    />
                )}
            </Transition>
        </>
    );
}
