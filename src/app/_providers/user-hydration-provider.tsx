"use client";

import { ReactNode } from "react";
import { PageSkeletonProvider } from "@/shared/ui/page-skeleton-provider/page-skeleton-provider";
import {useQuery} from "@tanstack/react-query";
import {authQuery} from "@/entities/me/api/auth-query";

type UserHydrationProviderType = {
    children: ReactNode;
};

export default function UserHydrationProvider({ children }: UserHydrationProviderType) {
    const { isLoading } = useQuery(authQuery)

    return (
        <PageSkeletonProvider isLoading={isLoading}>
            {children}
        </PageSkeletonProvider>
    )
}
