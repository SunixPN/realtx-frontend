export function plural(n: number, forms: [string, string, string]): string {
    const last = n % 10
    const two = n % 100
    if (two >= 11 && two <= 14) return forms[2]
    if (last === 1) return forms[0]
    if (last >= 2 && last <= 4) return forms[1]
    return forms[2]
}
