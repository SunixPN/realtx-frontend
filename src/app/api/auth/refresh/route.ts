import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/shared/config/env'
import { TOKENS } from '@/shared/const/tokens'
import { API_ROUTES } from '@/shared/const/api-routes'

export async function POST() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(TOKENS.REFRESH_TOKEN)?.value

    if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    }

    const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    const res = await fetch(`${base}${API_ROUTES.AUTH.REFRESH}`, {
        method: 'POST',
        headers: { Cookie: `${TOKENS.REFRESH_TOKEN}=${refreshToken}` },
        cache: 'no-store',
    })

    if (!res.ok) {
        return NextResponse.json({ error: 'Refresh failed' }, { status: res.status })
    }

    const data = await res.json() as { accessToken: string }

    const response = NextResponse.json({ accessToken: data.accessToken })

    // Пробрасываем все Set-Cookie от бэкенда (включая новый refresh_token),
    // иначе старый refresh_token остаётся в браузере уже инвалидированным.
    res.headers.getSetCookie().forEach(cookie => {
        response.headers.append('Set-Cookie', cookie)
    })

    // Дополнительно выставляем access_token явно (httpOnly через Next.js)
    response.cookies.set(TOKENS.ACCESS_TOKEN, data.accessToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 15 * 60,
    })

    return response
}
