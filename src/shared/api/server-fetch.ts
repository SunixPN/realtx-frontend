import { cookies } from 'next/headers'
import { env } from '@/shared/config/env'
import { TOKENS } from '@/shared/const/tokens'

/** Серверный fetch для SSR prefetch.
 *  Refresh access-токена делает proxy до RSC — здесь уже читаем свежий токен из cookies. */
export async function serverFetch<T>(
    path: string,
    params?: URLSearchParams | Record<string, string>,
    token?: string,
): Promise<T> {
    const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    const qs = params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(
            Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
          ).toString()

    const url = qs ? `${base}${path}?${qs}` : `${base}${path}`
    const resolvedToken = token ?? (await cookies()).get(TOKENS.ACCESS_TOKEN)?.value

    const reqHeaders: Record<string, string> = {}
    if (resolvedToken) reqHeaders['Authorization'] = `Bearer ${resolvedToken}`

    const res = await fetch(url, { headers: reqHeaders, cache: 'no-store' })
    if (!res.ok) throw new Error(`serverFetch ${path} → ${res.status}`)
    return res.json() as Promise<T>
}
