import { ComponentType } from 'react';

type SkeletonEntry =
    | { kind: 'exact'; path: string; component: ComponentType }
    | { kind: 'prefix'; path: string; component: ComponentType };

export const SKELETONS_MAP: SkeletonEntry[] = [
    // Пример:
    // { kind: 'exact',  path: '/profile',  component: ProfileSkeleton },
    // { kind: 'prefix', path: '/property/', component: PropertySkeleton },
];

export function matchSkeleton(pathname: string): ComponentType | null {
    for (const entry of SKELETONS_MAP) {
        if (entry.kind === 'exact' && entry.path === pathname) return entry.component;
        if (entry.kind === 'prefix' && pathname.startsWith(entry.path)) return entry.component;
    }
    return null;
}
