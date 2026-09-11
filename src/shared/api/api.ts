import axios from 'axios';
import { env } from '@/shared/config/env';

export class ApiError extends Error {
    constructor(message: string, private readonly status: number) {
        super(message);
    }
}

export const api = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});
