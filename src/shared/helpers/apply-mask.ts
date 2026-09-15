/**
 * Накладывает маску на строку. Символ `#` в маске = позиция для цифры,
 * остальные символы вставляются как литералы-разделители.
 *
 * @example applyMask('291234567', '## ### ## ##') // '29 123 45 67'
 */
export const applyMask = (raw: string, mask: string): string => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';

    let result = '';
    let i = 0;
    for (const ch of mask) {
        if (i >= digits.length) break;
        if (ch === '#') {
            result += digits[i]!;
            i++;
        } else {
            result += ch;
        }
    }
    return result;
};

export const countMaskDigits = (mask: string): number => (mask.match(/#/g) ?? []).length;
