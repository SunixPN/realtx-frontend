import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Toaster} from "sonner";
import {Header} from "@/widgets/header";
import "./globals.css";
import QueryProvider from "@/app/_providers/query-provider";
import UserHydrationProvider from "@/app/_providers/user-hydration-provider";
import {ReactNode} from "react";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "RealtX — агрегатор недвижимости",
    description: "Поиск квартир, домов и коммерческой недвижимости в Беларуси",
};

export default function RootLayout({
    children,
}: { children: ReactNode; }) {
    return (
        <html lang="ru" className={inter.variable} suppressHydrationWarning>
            <QueryProvider>
                <UserHydrationProvider>
                    <body className="min-h-screen bg-surface-page text-text-base antialiased">
                        <Header/>
                        {children}
                        <Toaster position="top-right" richColors closeButton />
                    </body>
                </UserHydrationProvider>
            </QueryProvider>
        </html>
    );
}
