"use client";

import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import NProgress from "nprogress";

export default function useCustomRouter() {
    const router = useRouter();
    const pathname = usePathname();

    return useMemo(() => {
        const start = (href: string) => {
            // если переходим на тот же путь, страница не сменится
            // и полоса зависнет, поэтому не запускаем её
            if (href === pathname) return false;
            NProgress.start();
            return true;
        };

        return {
            ...router,
            push: (href: string, options?: Parameters<typeof router.push>[1]) => {
                start(href);
                router.push(href, options);
            },
            replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
                start(href);
                router.replace(href, options);
            },
            back: () => {
                NProgress.start();
                router.back();
            },
        };
    }, [router, pathname]);
}