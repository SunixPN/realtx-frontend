import {NextProxy, NextResponse} from "next/server";
import {TOKENS} from "@/shared/const/tokens";
import {PROTECTED_REDIRECT_ROUTE, PROTECTED_ROUTES} from "@/shared/const/routes-guard";

export const proxy: NextProxy = (request) => {
    const { pathname } = request.nextUrl
    const hasRefresh = request.cookies.has(TOKENS.REFRESH_TOKEN)

    if (PROTECTED_ROUTES.includes(pathname) && !hasRefresh) {
        const url = request.nextUrl.clone()
        url.pathname = PROTECTED_REDIRECT_ROUTE
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};