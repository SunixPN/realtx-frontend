"use client"

import {ReactNode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/shared/api/query";

type QueryProviderProps = {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
