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

type RefreshResult = {
    accessToken: string;
    setCookies: string[];
} | null;

// Coalescing: параллельные запросы с одним refresh_token делят один Promise.
// Ключ — сам токен, чтобы после ротации новый вызов не подхватил чужое обещание.
const inflight = new Map<string, Promise<RefreshResult>>();

function decodeJwtExp(token: string): number | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"),
        ) as { exp?: number };
        return typeof payload.exp === "number" ? payload.exp : null;
    } catch {
        return null;
    }
}

function isExpired(token: string | undefined): boolean {
    if (!token) return true;
    const exp = decodeJwtExp(token);
    if (exp === null) return true;
    return Date.now() / 1000 >= exp - EXP_SKEW_SEC;
}

async function refresh(refreshToken: string): Promise<RefreshResult> {
    const existing = inflight.get(refreshToken);
    if (existing) return existing;

    const promise = (async (): Promise<RefreshResult> => {
        try {
            const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
            const res = await fetch(`${base}${API_ROUTES.AUTH.REFRESH}`, {
                method: "POST",
                headers: { Cookie: `${TOKENS.REFRESH_TOKEN}=${refreshToken}` },
                cache: "no-store",
            });
            if (!res.ok) return null;
            const data = (await res.json()) as { accessToken: string };
            return {
                accessToken: data.accessToken,
                setCookies: res.headers.getSetCookie(),
            };
        } catch {
            return null;
        }
    })();

    inflight.set(refreshToken, promise);
    // Освобождаем ключ после завершения — новый refresh_token стартует свою запись.
    promise.finally(() => inflight.delete(refreshToken));
    return promise;
}

type ParsedCookie = {
    name: string;
    value: string;
    options: {
        path?: string;
        domain?: string;
        maxAge?: number;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none";
    };
};

function parseSetCookie(header: string): ParsedCookie | null {
    const [nameValue, ...attrs] = header.split(";").map((p) => p.trim());
    const eq = nameValue.indexOf("=");
    if (eq === -1) return null;
    const name = nameValue.slice(0, eq);
    const value = decodeURIComponent(nameValue.slice(eq + 1));
    const options: ParsedCookie["options"] = {};
    for (const attr of attrs) {
        const idx = attr.indexOf("=");
        const k = (idx === -1 ? attr : attr.slice(0, idx)).toLowerCase();
        const v = idx === -1 ? "" : attr.slice(idx + 1);
        if (k === "path") options.path = v;
        else if (k === "domain") options.domain = v;
        else if (k === "max-age") options.maxAge = Number(v);
        else if (k === "expires") options.expires = new Date(v);
        else if (k === "httponly") options.httpOnly = true;
        else if (k === "secure") options.secure = true;
        else if (k === "samesite") options.sameSite = v.toLowerCase() as "lax" | "strict" | "none";
    }
    return { name, value, options };
}

function applyRefreshedCookies(
    response: NextResponse,
    request: NextRequest,
    accessToken: string,
    setCookies: string[],
) {
    // Обновляем и response (для браузера), и request.cookies (для downstream RSC/route handlers в этом же запросе).
    let hasAccessInSetCookie = false;
    for (const raw of setCookies) {
        const parsed = parseSetCookie(raw);
        if (!parsed) continue;
        if (parsed.name === TOKENS.ACCESS_TOKEN) hasAccessInSetCookie = true;
        response.cookies.set(parsed.name, parsed.value, parsed.options);
        request.cookies.set(parsed.name, parsed.value);
    }
    // Страховка: если бэк не кладёт access_token в куку — ставим сами.
    if (!hasAccessInSetCookie) {
        response.cookies.set(TOKENS.ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            maxAge: 15 * 60,
        });
        request.cookies.set(TOKENS.ACCESS_TOKEN, accessToken);
    }
}

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete(TOKENS.REFRESH_TOKEN);
    response.cookies.delete(TOKENS.ACCESS_TOKEN);
}

export const proxy: NextProxy = async (request) => {
    const { pathname } = request.nextUrl;
    const refreshToken = request.cookies.get(TOKENS.REFRESH_TOKEN)?.value;
    const accessToken = request.cookies.get(TOKENS.ACCESS_TOKEN)?.value;

    let refreshed: NonNullable<RefreshResult> | null = null;

    // Проактивный refresh: access протух (или отсутствует), но refresh есть.
    if (refreshToken && isExpired(accessToken)) {
        const result = await refresh(refreshToken);
        if (result) {
            refreshed = result;
        } else {
            // refresh не удался — refresh_token тоже мёртв, чистим и редиректим при необходимости.
            const response = PROTECTED_ROUTES.includes(pathname)
                ? NextResponse.redirect(new URL(PROTECTED_REDIRECT_ROUTE, request.url))
                : NextResponse.next();
            clearAuthCookies(response);
            return response;
        }
    }

    const hasRefresh = refreshed ? true : Boolean(refreshToken);
    const hasAccess = refreshed ? true : !!accessToken;

    if (PROTECTED_ROUTES.includes(pathname) && !(hasAccess || hasRefresh)) {
        const url = request.nextUrl.clone();
        url.pathname = PROTECTED_REDIRECT_ROUTE;
        const response = NextResponse.redirect(url);
        clearAuthCookies(response);
        return response;
    }

    if (AUTH_ROUTES.includes(pathname) && (hasAccess && hasRefresh)) {
        const url = request.nextUrl.clone();
        url.pathname = AUTH_REDIRECT_ROUTE;

        return NextResponse.redirect(url);
    }

    const response = NextResponse.next({ request });
    if (refreshed) {
        applyRefreshedCookies(response, request, refreshed.accessToken, refreshed.setCookies);
    }
    return response;
};

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
