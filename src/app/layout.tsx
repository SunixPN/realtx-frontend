import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import {Toaster} from "sonner";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages, getTranslations} from "next-intl/server";
import {Header} from "@/widgets/header";
import "./globals.css";
import QueryProvider from "@/app/_providers/query-provider";
import {ReactNode} from "react";
import { ThemeInitScript, ThemeProvider } from "@/shared/theme";
import NextTopLoader from "nextjs-toploader";
import { ViewportMetricsProvider } from "@/app/_providers/viewport-metrics-provider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("common");
    return {
        title: t("meta_title"),
        description: t("app_description"),
    };
}

export default async function RootLayout({
    children,
}: { children: ReactNode; }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className={inter.variable} suppressHydrationWarning>
            <head>
                <ThemeInitScript />
            </head>
            <QueryProvider>
                <body className="min-h-dvh bg-surface-page text-text-base antialiased">
                    <ThemeProvider>
                        <NextIntlClientProvider locale={locale} messages={messages}>
                            <NextTopLoader
                                color={"var(--brand)"}
                                height={4}
                            />
                            <ViewportMetricsProvider />
                            <Header/>
                            {children}
                            <Toaster position="top-right" richColors closeButton />
                        </NextIntlClientProvider>
                    </ThemeProvider>
                </body>
            </QueryProvider>
        </html>
    );
}
