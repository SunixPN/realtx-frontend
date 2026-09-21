import { cookies } from 'next/headers'
import { env } from '@/shared/config/env'
import { TOKENS } from '@/shared/const/tokens'

type ServerFetchOptions = {
    token?: string
    revalidate?: number
    skipAuth?: boolean
}

export async function serverFetch<T>(
    path: string,
    params?: URLSearchParams | Record<string, string>,
    tokenOrOptions?: string | ServerFetchOptions,
): Promise<T> {
    const options: ServerFetchOptions =
        typeof tokenOrOptions === 'string'
            ? { token: tokenOrOptions }
            : tokenOrOptions ?? {}

    const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    const qs = params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(
            Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
          ).toString()
    const url = qs ? `${base}${path}?${qs}` : `${base}${path}`

    const reqHeaders: Record<string, string> = {}
    if (!options.skipAuth) {
        const resolvedToken = options.token ?? (await cookies()).get(TOKENS.ACCESS_TOKEN)?.value
        if (resolvedToken) reqHeaders['Authorization'] = `Bearer ${resolvedToken}`
    }

    const fetchInit: RequestInit & { next?: { revalidate?: number } } =
        options.revalidate !== undefined
            ? { headers: reqHeaders, next: { revalidate: options.revalidate } }
            : { headers: reqHeaders, cache: 'no-store' }

    const res = await fetch(url, fetchInit)
    if (!res.ok) throw new Error(`serverFetch ${path} → ${res.status}`)
    return res.json() as Promise<T>
}
