"use client"

import {ReactNode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {getQueryClient} from "@/shared/api/query";

type QueryProviderProps = {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
