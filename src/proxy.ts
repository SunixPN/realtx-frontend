import { NextProxy, NextRequest, NextResponse } from "next/server";
import { TOKENS } from "@/shared/const/tokens";
import {
    AUTH_REDIRECT_ROUTE,
    AUTH_ROUTES,
    PROTECTED_REDIRECT_ROUTE,
    PROTECTED_ROUTES
} from "@/shared/const/routes-guard";
import { env } from "@/shared/config/env";
import { API_ROUTES } from "@/shared/const/api-routes";

const EXP_SKEW_SEC = 30;
const B64URL_RE = /^[A-Za-z0-9_-]+$/;

function decodeBase64UrlJson(part: string): Record<string, unknown> | null {
    if (!B64URL_RE.test(part)) return null;
    try {
        const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        const bin = atob(padded);
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        const json = JSON.parse(new TextDecoder().decode(bytes));
        if (typeof json !== "object" || json === null || Array.isArray(json)) return null;
        return json as Record<string, unknown>;
    } catch {
        return null;
    }
}

interface ParsedJwt {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
}

function parseJwt(token: string): ParsedJwt | null {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [h, p, s] = parts;
    if (!h || !p || !s) return null;          // пустые сегменты
    if (!B64URL_RE.test(s)) return null;      // подпись тоже base64url

    const header = decodeBase64UrlJson(h);
    const payload = decodeBase64UrlJson(p);
    if (!header || !payload) return null;

    // Минимальные требования к заголовку
    if (typeof header.alg !== "string" || header.alg === "" ) return null;
    if (header.alg.toLowerCase() === "none") return null; // "alg: none" — красный флаг

    return { header, payload };
}

function isInvalidOrExpired(token: string | undefined): boolean {
    if (!token) return true;

    const jwt = parseJwt(token.trim());
    if (!jwt) return true;

    const { exp } = jwt.payload;
    if (typeof exp !== "number" || !Number.isFinite(exp)) return true;

    return Date.now() / 1000 >= exp - EXP_SKEW_SEC;
}

function authRoutesProtection( request: NextRequest, hasAccess: boolean) {
    const { pathname } = request.nextUrl
    if (AUTH_ROUTES.includes(pathname) && hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = AUTH_REDIRECT_ROUTE;
        return NextResponse.redirect(url);
    }

    return NextResponse.next()
}

export const proxy: NextProxy = async (request) => {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get(TOKENS.ACCESS_TOKEN)?.value;
    const hasAccess = Boolean(accessToken)
    const hasRefresh = Boolean(request.cookies.get(TOKENS.REFRESH_TOKEN))
    const domain = env.COOKIE_DOMAIN || undefined

    function clearAccessCookie(response: NextResponse) {
        // На проде кука ставится с Domain=.realtx.online (COOKIE_DOMAIN),
        // так что удалять надо с теми же атрибутами — иначе браузер игнорит
        // Set-Cookie и возникает бесконечный редирект-луп при битом токене.
        response.cookies.set(TOKENS.ACCESS_TOKEN, '', {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 0,
            ...(domain ? { domain } : {}),
        })
    }

    // Рефрешим и когда access протух/битый, и когда его вообще нет,
    // но refresh_token ещё жив. Иначе после 15 минут неактивности
    // (particularly на мобильных, где вкладка бэкграундится) access
    // естественным путём удаляется браузером — и мы без попытки refresh
    // выбрасывали юзера на /sign-in, хотя refresh был бы успешным.
    //
    // Server actions (POST с заголовком next-action) не рефрешим: они ничего не рендерят,
    // а сразу после логина фронт шлёт их пачкой (saveAccessToken, readCookie на каждый
    // API-запрос) — с одним и тем же свежим refresh_token. Параллельные refresh'и
    // ротируют токен наперегонки, проигравшие получают 401, и пользователь
    // остаётся без сессии. Токен для API-запросов обновляет клиентский интерцептор
    // (у него single-flight очередь).
    const isServerAction = request.method === "POST" && request.headers.has("next-action");
    const needsRefresh = !isServerAction && hasRefresh && (!hasAccess || isInvalidOrExpired(accessToken));
    const isProtected = PROTECTED_ROUTES.includes(pathname);

    // Refresh не удался: с защищённой страницы — на вход, с публичной — просто
    // продолжаем гостем. Редирект с публичных (в т.ч. с самого /sign-in) давал луп.
    function onRefreshFailed(setCookie?: string | null) {
        const response = isProtected
            ? NextResponse.redirect(new URL(PROTECTED_REDIRECT_ROUTE, request.url))
            : NextResponse.next()
        clearAccessCookie(response)
        if (setCookie) response.headers.append("set-cookie", setCookie);
        return response
    }

    if (needsRefresh) {
        try {
            const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
            const cookieHeader = request.headers.get("cookie") ?? "";
            const res = await fetch(`${base}${API_ROUTES.AUTH.REFRESH}`, {
                method: "POST",
                headers: cookieHeader ? { cookie: cookieHeader } : {},
            });

            if (!res.ok) {
                return onRefreshFailed(res.headers.get("set-cookie"))
            }

            const data = (await res.json()) as { accessToken: string };
            const response = authRoutesProtection(request, true)
            response.cookies.set(TOKENS.ACCESS_TOKEN, data.accessToken, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                maxAge: 15 * 60,
                ...(domain ? { domain } : {}),
            })

            const setCookie = res.headers.get("set-cookie");
            if (setCookie) response.headers.append("set-cookie", setCookie);

            return response

        } catch {
            return onRefreshFailed()
        }
    }

    if (isProtected && !hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = PROTECTED_REDIRECT_ROUTE;
        return NextResponse.redirect(url);
    }

    return authRoutesProtection(request, hasAccess)
};

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
