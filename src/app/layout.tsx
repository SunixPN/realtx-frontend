import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Toaster} from "sonner";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages, getTranslations} from "next-intl/server";
import {Header} from "@/widgets/header";
import "./globals.css";
import QueryProvider from "@/app/_providers/query-provider";
import {ReactNode} from "react";
import { TopLoader } from "@/shared/ui/top-loader/top-loader";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

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
            <QueryProvider>
                <body className="min-h-screen bg-surface-page text-text-base antialiased">
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <TopLoader />
                        <Header/>
                        {children}
                        <Toaster position="top-right" richColors closeButton />
                    </NextIntlClientProvider>
                </body>
            </QueryProvider>
        </html>
    );
}
