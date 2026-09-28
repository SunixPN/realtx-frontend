export function formatPhone(phone: string): string {
    const m = /^\+375(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone)
    if (!m) return phone
    return `+375 ${m[1]} ${m[2]}-${m[3]}-${m[4]}`
}
