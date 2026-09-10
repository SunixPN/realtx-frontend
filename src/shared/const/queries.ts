export const QUERIES = {
    AUTH_QUERY: "auth-query"
} as const;

export type QueryType = typeof QUERIES[keyof typeof QUERIES];
