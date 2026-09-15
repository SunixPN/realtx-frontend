import axios from 'axios';
import { env } from '@/shared/config/env';

export class ApiError extends Error {
    constructor(message: string, private readonly status: number) {
        super(message);
    }
}

// Axios по умолчанию сериализует массив как rooms[]=1&rooms[]=2,
// а backend ожидает CSV: rooms=1,2. Без кастомного сериалайзера
// @Transform(toNumberArray) на бэке не разбирает bracket-формат.
function serializeParams(params: Record<string, unknown>): string {
    const parts: string[] = []
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue
        if (Array.isArray(value)) {
            if (value.length > 0) parts.push(`${encodeURIComponent(key)}=${value.join(',')}`)
        } else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        }
    }
    return parts.join('&')
}

export const api = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    paramsSerializer: { serialize: serializeParams },
});
