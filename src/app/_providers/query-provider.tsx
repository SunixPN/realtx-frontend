"use client"

import {ReactNode, useEffect} from "react";
import {SWRConfig, mutate} from "swr";
import '@/entities/me/api/auth-api-interceptors';
import {authKey} from "@/entities/me/api/auth-query";
import {QueryClientProvider} from "@tanstack/react-query";
import {getQueryClient} from "@/shared/api/query";

type QueryProviderProps = {
    children: ReactNode
}

// Восстановление вкладки из BFCache (мобильный Chrome/Safari после свайпа из recent apps)
// не триггерит mount и не всегда даёт focus — SWR остаётся со stale state. Ручной revalidate
// при persisted-pageshow поднимает свежую сессию через fetcher useAuth.
function BFCacheRevalidator() {
    useEffect(() => {
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) mutate(authKey)
        }
        window.addEventListener('pageshow', onPageShow)
        return () => window.removeEventListener('pageshow', onPageShow)
    }, [])
    return null
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    shouldRetryOnError: false,
                }}
            >
                <BFCacheRevalidator />
                {children}
            </SWRConfig>
        </QueryClientProvider>
    )
}
