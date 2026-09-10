"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { matchSkeleton } from '@/shared/ui/page-skeleton-provider/skeletons-map';

type PageSkeletonProviderProps = {
    isLoading: boolean;
    children: ReactNode;
};

export function PageSkeletonProvider({ isLoading, children }: PageSkeletonProviderProps) {
    const pathname = usePathname();

    if (!isLoading) return children;

    const Skeleton = matchSkeleton(pathname);
    if (!Skeleton) return children;

    return <Skeleton />;
}
