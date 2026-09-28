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
