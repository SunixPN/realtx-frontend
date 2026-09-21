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
    const hasAccess = Boolean(request.cookies.get(TOKENS.ACCESS_TOKEN))

    if (hasAccess && isInvalidOrExpired(accessToken)) {
        try {
            const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
            const res = await fetch(`${base}${API_ROUTES.AUTH.REFRESH}`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                const response = NextResponse.redirect(new URL(PROTECTED_REDIRECT_ROUTE, request.url))
                response.cookies.delete(TOKENS.ACCESS_TOKEN)
                return response
            }

            const data = (await res.json()) as { accessToken: string };
            const response = authRoutesProtection(request, true)
            response.cookies.set(TOKENS.ACCESS_TOKEN, data.accessToken)

            return response

        } catch {
            const response = NextResponse.redirect(new URL(PROTECTED_REDIRECT_ROUTE, request.url))
            response.cookies.delete(TOKENS.ACCESS_TOKEN)
            return response
        }
    }

    if (PROTECTED_ROUTES.includes(pathname) && !hasAccess) {
        const url = request.nextUrl.clone();
        url.pathname = PROTECTED_REDIRECT_ROUTE;
        return NextResponse.redirect(url);
    }

    return authRoutesProtection(request, hasAccess)
};

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
