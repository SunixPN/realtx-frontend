import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/widgets/header";
import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-surface-page text-text-base antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
