import axios from 'axios';
import { env } from '@/shared/config/env';
// Машиночитаемые поля ошибки бека (error.code, error.retryAfter)
export type ApiErrorDetails = {
    code?: string;
    retryAfter?: number;
};
export class ApiError extends Error {
    readonly code?: string;
    readonly retryAfter?: number;
    constructor(message: string, readonly status: number, details: ApiErrorDetails = {}) {
        super(message);
        this.code = details.code;
        this.retryAfter = details.retryAfter;
    }
}

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
