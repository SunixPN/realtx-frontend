import type { ConfirmationResult } from 'firebase/auth';

let confirmation: ConfirmationResult | null = null;
let phone: string | null = null;

export const phoneConfirmationStore = {
    set(nextConfirmation: ConfirmationResult, nextPhone: string) {
        confirmation = nextConfirmation;
        phone = nextPhone;
    },
    get() {
        return { confirmation, phone };
    },
    clear() {
        confirmation = null;
        phone = null;
    },
};
