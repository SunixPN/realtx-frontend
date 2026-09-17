"use client"

import {ReactNode} from "react";
import {SWRConfig} from "swr";
import '@/entities/me/api/auth-api-interceptors';

type QueryProviderProps = {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            }}
        >
            {children}
        </SWRConfig>
    )
}
